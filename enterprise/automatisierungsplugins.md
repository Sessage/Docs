# Automatisierungsplugins entwickeln

::: info Enterprise
Das Plugin-System ist ausschließlich in Sessage Enterprise verfügbar und benötigt die lizenzierte Capability `enterprise.automation`. Community lädt und führt keine Plugins aus.
:::

Automatisierungsplugins ergänzen den Regeleditor um kundenspezifische Aktionen, ohne dass das Plugin mit Sessage ausgeliefert oder Sessage neu kompiliert werden muss. Typische Einsatzfälle sind:

- Nachrichten an Microsoft Teams oder andere Dienste senden
- Dokumente in einem DMS anlegen oder aktualisieren
- Aufgaben an ein Ticketsystem übertragen
- Titel und Beschreibung in ein Fremdformat umwandeln
- eine Aufgabe durch ein KI-Modell klassifizieren und anschließend über eine reguläre Sessage-Aktion verschieben

Plugins werden beim Start des Enterprise-Servers aus dem konfigurierten Plugin-Verzeichnis geladen. Änderungen werden erst nach einem Neustart wirksam.

## Sicherheitsmodell

::: danger Plugins sind vollständig vertrauenswürdiger Code
Ein .NET-Plugin läuft im Prozess des Enterprise-Servers und besitzt grundsätzlich dieselben Betriebssystemrechte wie Sessage. Es kann Dateien, Netzwerk und Prozessdaten verwenden. .NET stellt für solche Assemblies keine belastbare In-Process-Sandbox bereit. Installieren Sie ausschließlich geprüfte Plugins aus vertrauenswürdiger Quelle und beschränken Sie Schreibrechte auf das Plugin-Verzeichnis auf Administratoren.
:::

Sessage begrenzt die Integration trotzdem an mehreren Stellen:

- nur Enterprise lädt Plugin-Assemblies;
- jedes Plugin benötigt ein gültiges Manifest mit API-Version 1;
- Abhängigkeiten werden in einem eigenen `AssemblyLoadContext` aufgelöst;
- ein fehlerhaftes Plugin verhindert den Serverstart nicht und wird protokolliert;
- einzelne Ausführungen besitzen standardmäßig ein Zeitlimit von 30 Sekunden;
- höchstens 100 zurückgegebene Sessage-Aktionen werden akzeptiert;
- rekursive Plugin-Aktionen und das Umgehen der Webhook-Prüfung sind gesperrt;
- Spalten, Personen, Labels und Felder aus Plugin-Ergebnissen werden erneut serverseitig validiert;
- als `Secret` beschriebene Werte werden über ASP.NET Data Protection verschlüsselt gespeichert und nicht an Web- oder Mobile-Clients zurückgegeben.

Ein Zeitlimit beendet kooperativen asynchronen Code über ein `CancellationToken`. Es kann blockierenden oder bewusst bösartigen Code nicht sicher abbrechen. Solcher Code muss durch Entfernen des Plugins und Neustarten des Servers außer Betrieb genommen werden.

Externe Nebenwirkungen und die anschließende Sessage-Datenbankänderung bilden keine verteilte
Transaktion. Implementieren Sie Netzwerkaufrufe deshalb idempotent, verwenden Sie eine stabile
Aufgaben-ID als Deduplizierungsschlüssel und behandeln Sie Wiederholungen ausdrücklich.

## Verzeichnisstruktur

Jedes Plugin liegt in einem eigenen Unterordner:

```text
plugins/
└─ Contoso.Dms/
   ├─ plugin.json
   ├─ Contoso.Dms.dll
   └─ Weitere.Abhängigkeit.dll
```

`plugin.json`:

```json
{
  "id": "contoso.dms",
  "apiVersion": 1,
  "entryAssembly": "Contoso.Dms.dll",
  "entryType": "Contoso.Dms.ContosoDmsPlugin",
  "enabled": true
}
```

Regeln für das Manifest:

- `id` besteht aus Kleinbuchstaben, Ziffern, Punkt, Unterstrich oder Bindestrich und stimmt exakt mit `Metadata.Id` überein.
- `entryAssembly` ist ein relativer DLL-Pfad innerhalb des Plugin-Verzeichnisses.
- `entryType` ist optional, aber empfohlen. Ohne Angabe muss die Assembly genau einen öffentlichen Plugin-Typ enthalten.
- `apiVersion` ist derzeit `1`.
- `enabled: false` deaktiviert das Plugin beim nächsten Start.

## Projekt anlegen

Ein Plugin zielt auf dieselbe .NET-Hauptversion wie die Installation und referenziert den Vertrag aus `TodoSuite.Community.Shared.dll`. Kopieren Sie diese Assembly aus dem veröffentlichten Sessage-Paket in einen lokalen Ordner `lib`, verwenden Sie sie nur zum Kompilieren und liefern Sie sie nicht als private Plugin-Kopie aus:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="TodoSuite.Community.Shared">
      <HintPath>lib/TodoSuite.Community.Shared.dll</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>
  <ItemGroup>
    <None Update="plugin.json"
          CopyToOutputDirectory="PreserveNewest"
          CopyToPublishDirectory="PreserveNewest" />
  </ItemGroup>
</Project>
```

Nach einem Sessage-Upgrade sollte das Plugin gegen die mit dieser Version ausgelieferte Vertragsassembly neu gebaut und getestet werden.

## Plugin-Vertrag

Ein Plugin implementiert `ISessageAutomationPlugin`, besitzt einen öffentlichen parameterlosen Konstruktor und kann mehrere Aktionen beschreiben:

```csharp
using Klassenbibliothek.AutomationPlugins;
using Klassenbibliothek.Data;

public sealed class DmsPlugin : ISessageAutomationPlugin
{
    public AutomationPluginMetadata Metadata { get; } =
        new("contoso.dms", "Contoso DMS", "1.0.0");

    public IReadOnlyList<AutomationPluginActionDefinition> Actions { get; } =
    [
        new("create-document", "Dokument anlegen", Inputs:
        [
            new("documentType", "Dokumenttyp", AutomationPluginInputType.Choice,
                Required: true,
                Options:
                [
                    new AutomationPluginInputOption("request", "Anfrage"),
                    new AutomationPluginInputOption("incident", "Störung")
                ]),
            new("apiToken", "API-Token", AutomationPluginInputType.Secret, Required: true)
        ])
    ];

    public async Task<AutomationPluginResult> ExecuteAsync(
        string actionId,
        AutomationPluginExecutionContext context,
        IReadOnlyDictionary<string, string?> configuration,
        CancellationToken cancellationToken)
    {
        // Hier das DMS über dessen SDK oder HTTP-API aufrufen.
        await CreateDocumentAsync(context.Task, configuration, cancellationToken);

        return new AutomationPluginResult(
        [
            new AutomationPluginCommand(
                TodoAutomationActionType.AddComment,
                "Dokument wurde im DMS angelegt.")
        ]);
    }
}
```

Die Plugin-Instanz wird für jede Ausführung neu erzeugt. Speichern Sie keine Aufgaben- oder Benutzerzustände in statischen Feldern. Wiederverwendbare Netzwerkclients dürfen thread-sicher und statisch sein.

## Eingabefelder beschreiben

`AutomationPluginInputDefinition` steuert den Editor und die serverseitige Validierung:

| Typ | Darstellung und Validierung |
| --- | --- |
| `Text` | einzeiliger Text |
| `MultilineText` | mehrzeiliger Text |
| `Number` | Zahl im invarianten Format |
| `Boolean` | Ja/Nein-Auswahl |
| `Choice` | feste, vom Plugin beschriebene Optionen |
| `Column` | aktuelle Spalten der Liste |
| `Person` | angenommene Personen der Liste |
| `Secret` | Passwortfeld; verschlüsselte serverseitige Speicherung |

`Required`, `Description` und `DefaultValue` ergänzen Pflichtprüfung, Hilfetext und Startwert. Schlüssel müssen innerhalb einer Aktion eindeutig und stabil bleiben. Das nachträgliche Umbenennen eines Schlüssels lässt gespeicherte Regeln den alten Wert verlieren.

## Aufgabe lesen und Sessage-Aktionen auslösen

`AutomationPluginExecutionContext` enthält unveränderliche Daten:

- Liste, Spalten und angenommene Teilnehmer
- aktueller Aufgabenstand
- vorheriger Aufgabenstand, sofern der Auslöser ihn liefert
- Auslöser und handelnder Benutzer
- Standardfelder, Genehmigungsstatus und benutzerdefinierte Feldwerte

Das Plugin ändert diese Objekte nicht direkt. Stattdessen gibt es `AutomationPluginCommand`-Einträge zurück. Unterstützt werden die regulären eingebauten Aktionen, beispielsweise:

```csharp
return new AutomationPluginResult(
[
    // Beschreibung ersetzen
    new(TodoAutomationActionType.SetCustomField,
        Value: transformedText,
        FieldKey: "description"),

    // Ergebnis einer Klassifizierung anwenden
    new(TodoAutomationActionType.MoveToColumn,
        Value: selectedColumn),

    // Entscheidung nachvollziehbar machen
    new(TodoAutomationActionType.AddComment,
        Value: $"KI-Klassifizierung: {selectedColumn}")
]);
```

Damit verwendet eine Plugin-Entscheidung dieselbe Änderungs-, Echtzeit- und Folgeauslöserlogik wie eine normale Automatisierungsaktion. Verschiebt das Plugin eine Aufgabe, können danach Regeln mit dem Auslöser „Aufgabe wurde in eine andere Spalte verschoben“ laufen.

`PluginAction` und `PostWebhook` dürfen nicht als Befehl zurückgegeben werden. Ein Plugin kann externe HTTP-Aufrufe selbst durchführen; es ist dann selbst für Zielvalidierung, Authentisierung, Wiederholungsstrategie und Datenschutz verantwortlich.

## KI-Plugin-Muster

Ein KI-Plugin sollte dem Modell nur die tatsächlich benötigten Felder senden, eine strukturierte Antwort verlangen und das Ergebnis gegen `context.Columns` prüfen. Anschließend gibt es eine normale Verschiebeaktion zurück:

```csharp
var selected = await classifier.ClassifyAsync(
    context.Task.Title,
    context.Task.Description,
    context.Columns,
    cancellationToken);

if (!context.Columns.Contains(selected, StringComparer.OrdinalIgnoreCase))
    throw new InvalidOperationException("Das Modell lieferte eine unbekannte Spalte.");

return new AutomationPluginResult(
[
    new(TodoAutomationActionType.MoveToColumn, selected),
    new(TodoAutomationActionType.AddComment, $"Automatisch klassifiziert: {selected}")
]);
```

Auch wenn das Plugin selbst prüft, validiert Sessage die Zielspalte nochmals vor der Änderung.

## Beispielplugin bauen

Im Quellrepository liegt unter `examples/automation-plugins/Sessage.Example.AutomationPlugin` ein vollständiges Beispiel mit drei Aktionen:

- nach Schlüsselwort einsortieren
- Beschreibung über eine Vorlage formatieren
- Nachricht an einen Teams-Workflow-Webhook senden

Aus dem Repository-Stamm:

```powershell
dotnet publish .\examples\automation-plugins\Sessage.Example.AutomationPlugin\Sessage.Example.AutomationPlugin.csproj `
  -c Release `
  -o .\docker\enterprise\storage\plugins\sessage.example
```

Linux:

```bash
dotnet publish ./examples/automation-plugins/Sessage.Example.AutomationPlugin/Sessage.Example.AutomationPlugin.csproj \
  -c Release \
  -o ./docker/enterprise/storage/plugins/sessage.example
```

Entfernen Sie eine gegebenenfalls mitkopierte `TodoSuite.Community.Shared.dll` aus dem Plugin-Ordner. Danach starten Sie den Enterprise-App-Container neu.

## Konfiguration

```json
{
  "AutomationPlugins": {
    "Enabled": true,
    "Path": "plugins",
    "ExecutionTimeoutSeconds": 30
  }
}
```

Die mitgelieferte Compose-Datei liest diese Werte aus `.env`:

```dotenv
AUTOMATION_PLUGINS_ENABLED=true
AUTOMATION_PLUGIN_TIMEOUT_SECONDS=30
```

Docker Compose setzt daraus `AutomationPlugins__Enabled`, `AutomationPlugins__Path` und `AutomationPlugins__ExecutionTimeoutSeconds`. Im Enterprise-Container ist `/app/plugins` das feste Ziel des sichtbaren Hostordners `storage/plugins/`.

## Installation und Fehlerdiagnose

1. Plugin in einen neuen Unterordner von `storage/plugins/` veröffentlichen.
2. Eigentümer und Leserechte so setzen, dass nur Administratoren schreiben und der Container lesen kann.
3. Enterprise-App neu starten.
4. Serverprotokoll auf `Loaded Enterprise automation plugin ...` prüfen.
5. Liste als Administrator öffnen und im Automatisierungseditor unter der Gruppe **Plugins** nachsehen.

Fehler eines Manifests oder beim Laden einer Assembly werden mit dem Manifestpfad protokolliert. Das betreffende Plugin erscheint nicht im Editor; andere Plugins und Sessage laufen weiter. Laufzeitfehler werden ebenfalls protokolliert und beenden nur diese Plugin-Aktion. Nachfolgende Regeln und die ursprüngliche Aufgabenänderung bleiben erhalten.

Wenn ein Plugin entfernt wird, bleiben bestehende Regeln in der Datenbank sichtbar, können die fehlende Aktion aber nicht ausführen. Installieren Sie dieselbe stabile Plugin-/Aktions-ID erneut oder ersetzen Sie die Aktion in den Regeln.
