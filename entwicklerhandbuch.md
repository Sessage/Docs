# Entwicklerhandbuch

Dieses Dokument ist die Landkarte für den Quellcode von Sessage. Kommentare im Code
erläutern bewusst Verträge, Invarianten und nicht offensichtliche Entscheidungen. Dieses
Dokument ergänzt sie um die Zusammenhänge zwischen den Projekten. Kommentare, die nur
die jeweilige C#-Anweisung wiederholen, werden vermieden: Sie veralten schnell und
erschweren das Lesen.

## Lösungsstruktur und Abhängigkeitsrichtung

```text
Enterprise.Server ──> Enterprise.Modules ──> Community ──> Community.Shared
                                                ▲                 ▲
                                                │                 │
                                          Server.Tests          Mobile

Licensing.Server ──> Licensing.Contracts <── Enterprise.Modules
PushRelay                    Mobile.Tests ──> Mobile
```

- **Community.Shared** enthält Domänenmodelle, Serviceverträge, wiederverwendbare
  Razor-Komponenten und Capability-Namen. Dieses Projekt darf keine Server- oder
  Enterprise-Implementierung voraussetzen.
- **Community** ist Anwendungskern und lauffähiger Community-Host. Hier liegen EF-Core-
  Persistenz, Autorisierung, REST-Endpunkte, Hintergrunddienste und die Web-Oberfläche.
- **Enterprise.Modules** erweitert den Community-Kern ausschließlich über dessen
  Verträge. Lizenzierte Implementierungen ersetzen Community-Dienste während der
  Dependency-Injection-Komposition; die Community kennt diese Implementierungen nicht.
- **Enterprise.Server** ist absichtlich ein dünner Produkthost. Produktlogik gehört in
  Community oder Enterprise.Modules, nicht in `Program.cs` dieses Hosts.
- **Mobile** ist ein gemeinsames MAUI-Binary für Community und Enterprise. Es erkennt
  Serverfähigkeiten zur Laufzeit und darf ein nicht lizenziertes Feature nie allein
  aufgrund einer lokalen UI-Entscheidung freischalten.
- **PushRelay** kennt weder Aufgabeninhalte noch Kundendatenbanken. Der Dienst vermittelt
  Push-Installationen und Benachrichtigungen mandantengetrennt an Azure Notification Hubs.
- **Licensing.Contracts** enthält nur den portablen kryptografischen Vertrag.
  **Licensing.Server** verwaltet Kunden und signiert Lizenzen; private Schlüssel dürfen
  diesen Dienst niemals verlassen.

Diese Richtung ist eine Sicherheits- und Produktgrenze. Eine Referenz von Community auf
Enterprise oder vom Relay auf eine Kundeninstallation wäre ein Architekturfehler.

## Server: Weg einer Anfrage

1. Der Host registriert Community-Dienste über `CommunityApplication` und optionale
   Module über `IApplicationModule`.
2. Authentifizierung stellt eine Benutzer-ID bereit. Controller und Minimal-API-Endpunkte
   reichen diese Identität an die Serviceebene weiter.
3. Die Workspace-Services prüfen die Berechtigung am betroffenen Objekt erneut. Eine
   ausgeblendete Schaltfläche ist keine Autorisierung.
4. EF Core lädt und verändert Aggregate. Schreiboperationen erhöhen die Inhaltsversion;
   parallele Änderungen werden als `WorkspaceConcurrencyException` sichtbar gemacht.
5. SignalR und Benachrichtigungsdienste informieren andere Sitzungen erst nach einer
   erfolgreichen fachlichen Änderung.

`TodoWorkspaceServiceBase` bündelt gemeinsame Zugriffs- und Ladeoperationen. Fachliche
Services sollen diese Basis nutzen, damit Listen-, Portfolio- und Aufgabenrechte nicht
unterschiedlich interpretiert werden. Controller bleiben Transportadapter: Validierung,
HTTP-Status und DTO-Abbildung gehören dorthin, Geschäftsregeln in Services.

## Community- und Enterprise-Funktionen

`IProductFeatureCatalog` ist die gemeinsame Abfragefläche für Produktfähigkeiten. Im
Enterprise-Host liest `IEnterpriseLicenseState` die lokal gespeicherte, signierte Lizenz
und vergleicht deren Installations-ID. Fehler oder abgelaufene Lizenzen deaktivieren nur
Enterprise-Funktionen; bestehende Community-Daten werden nicht gelöscht.

Enterprise-Dekoratoren müssen zweifach absichern:

1. Die Funktion muss in der Lizenz enthalten sein.
2. Der konkrete Benutzer muss auf die betroffene Ressource zugreifen dürfen.

Formulare und benutzerdefinierte Felder bilden gemeinsam eine Enterprise-Funktion. Daten
dürfen beim Lizenzwechsel erhalten bleiben, aber ohne Berechtigung weder über UI noch API
änderbar sein.

## Mobile Online- und Offline-Datenflüsse

Die Mobile-App arbeitet nach dem Muster **lokaler Stand plus dauerhafte Outbox**:

```text
UI ──> MobileWorkspaceService ──> LocalSqliteStore
                 │                       │
                 │                       └── pending_changes (Outbox)
                 │
                 └── bei Verbindung: MobileWorkspaceApiClient ──> MobileSyncController
                                      │
                                      └── Bestätigung/Konflikt ──> lokaler Stand + Outbox
```

### Schreiboperationen

- Die lokale Änderung und ihr Outbox-Eintrag werden so früh gespeichert, dass ein
  Prozessabbruch oder Verbindungsverlust keine Benutzeränderung verliert.
- Queue-Einträge sind nach Benutzerprofil partitioniert. Daten oder ausstehende Befehle
  dürfen nach einem Profilwechsel niemals unter einem anderen Konto gesendet werden.
- Ersetzbare Zustandsänderungen werden per `(user, type, list)` zusammengeführt. Ereignisse,
  deren Reihenfolge fachlich relevant ist, werden einzeln angefügt.
- Ein Queue-Eintrag wird nur bestätigt oder als fehlgeschlagen markiert, wenn sein Payload
  noch dem gesendeten Snapshot entspricht. So kann eine verspätete Antwort keine neuere
  lokale Bearbeitung löschen.
- Vorübergehende Fehler verwenden Backoff und `NextAttemptAtUtc`; fachlich endgültige
  Fehler bleiben sichtbar und können gezielt erneut versucht werden.

### Lesen und Abgleichen

- Bei Verbindung wird zuerst die Outbox in stabiler Reihenfolge abgearbeitet und danach
  der Serverstand geladen. Dadurch überschreibt ein älterer Download keine noch nicht
  gesendete lokale Änderung.
- `SyncToken`/`ContentVersion` bilden optimistische Nebenläufigkeit ab. Der Server lehnt
  eine Änderung mit altem Token als HTTP 409 ab, statt den Stand eines anderen Geräts
  still zu überschreiben.
- Der Fingerprint enthält nur synchronisationsrelevanten Inhalt und muss deterministisch
  bleiben. Änderungen daran benötigen Kompatibilitätstests mit älteren Clients.
- Löschungen und abhängige Entitäten sind besonders reihenfolgeempfindlich. Neue
  Operationstypen benötigen Tests für Wiederholung, Prozessabbruch, Profilwechsel,
  Konflikt und ein zweites Gerät.

## Benachrichtigungen und Push

`NotificationService` verwaltet den persistenten Posteingang; `ReminderDispatcher`
erzeugt fällige Erinnerungen idempotent. Die Badge-Anzahl wird aus ungelesenen,
persistierten Einträgen abgeleitet und darf nicht nur von einem SignalR-Ereignis abhängen.

Enterprise-Push verwendet pseudonyme, installationsspezifisch gehashte Benutzer-Handles.
Je nach Benutzereinstellung enthält die Nachricht entweder den Text oder nur eine neutrale
Meldung. Routen werden auf Listen- und Aufgaben-URLs begrenzt. Das zentrale Relay:

- authentifiziert jede Installation mit Mandanten-ID und gehashtem API-Schlüssel,
- vergleicht Schlüssel in konstanter Zeit und unterstützt kontrollierte Rotation,
- validiert Plattform, Größen und Route vor dem Hub-Aufruf,
- darf keine beliebigen URLs oder frei wählbaren Notification-Hub-Tags akzeptieren.

Push ist ein Komfortkanal, nicht die führende Datenquelle. Nach dem Öffnen lädt die App
die betreffende Aufgabe mit den normalen Berechtigungs- und Synchronisationsregeln.

## Persistenz und Migrationen

Die Community-Anwendungsdatenbank und die Lizenzdatenbank haben getrennte EF-Core-
Migrationshistorien. Schemaänderungen benötigen eine neue Migration; bestehende
Migrationen werden nach Veröffentlichung nicht nachträglich verändert. Mobile SQLite-
Migrationen sind additive, wiederholbare Initialisierungsschritte, weil Apps beliebig
viele Zwischenversionen überspringen können.

Zeitpunkte werden als UTC gespeichert. Umwandlung in die lokale Zeitzone geschieht erst
an der Darstellungsgrenze. IDs, Tokens und Installationskennungen werden vor Vergleichen
normalisiert, sofern ihr jeweiliger Vertrag dies vorsieht.

## Lokalisierung und Sprachauswahl

Ressourcenschlüssel müssen in allen unterstützten Ressourcendateien vorhanden sein. Die
explizite Benutzersprache hat Vorrang vor Browser- beziehungsweise Gerätesprache. Der
Server speichert nur unterstützte, normalisierte Sprachcodes; die Mobile-App übernimmt
die Einstellung beim Profilwechsel und aktualisiert die Kultur vor dem erneuten Rendern.

Neue UI-Texte gehören in Ressourcen und nicht als Literale in Razor oder Services. Tests
prüfen die Schlüsselmengen der Sprachdateien und die Normalisierung der Benutzerwahl.

## Wichtige Einstiegspunkte

| Thema | Einstieg |
|---|---|
| Community-Komposition | `Community/CommunityApplication.cs` |
| Gemeinsame Serviceverträge | `TodoSuite.Community.Shared/Services/WorkspaceInterfaces.cs` |
| Server-Autorisierung und Aggregate | `Community/Services/TodoWorkspaceServiceBase.cs` |
| Mobile REST- und Sync-Grenze | `Community/Controllers/MobileSyncController.cs` |
| Enterprise-Komposition | `TodoSuite.Enterprise.Modules/EnterpriseApplicationModule.cs` |
| Lizenzprüfung | `TodoSuite.Enterprise.Modules/EnterpriseLicensing.cs` |
| Mobile-Start/Realtime | `TodoSuite.Mobile/Services/MobileWorkspaceService.cs` |
| Mobile-Datenfassade und Adapter | `TodoSuite.Mobile/Services/MobileInterfaceServices.cs` |
| Mobile SQLite/Outbox | `TodoSuite.Mobile/Services/LocalSqliteStore.cs`, `OfflineSyncQueueStore.cs` |
| Push-Registrierung | `TodoSuite.Mobile/Services/PushNotificationServices.cs` |
| Zentrales Relay | `TodoSuite.PushRelay/Program.cs`, `PushHubService.cs` |
| Signaturvertrag | `TodoSuite.Licensing.Contracts/LicenseContract.cs` |

Große Razor-Dateien enthalten UI-Zustand und Eventhandler nahe am Markup. Vor einer
Erweiterung ist zu prüfen, ob wiederverwendbare Logik in einen Service oder eine kleinere
Komponente gehört. UI-Komponenten dürfen Offline-, Lizenz- oder Autorisierungsregeln nicht
duplizieren.

## Teststrategie

- `TodoSuite.Server.Tests`: Services, Autorisierung, Lizenz-/Featuregrenzen,
  Controllerverhalten, Benachrichtigungen und Lokalisierung.
- `TodoSuite.Mobile.Tests`: Outbox-Reihenfolge, Fehlerzustände, Profilpartitionierung und
  mobile Hilfslogik ohne MAUI-Laufzeit.
- `TodoSuite.Ldap.IntegrationTests`: echte LDAP-/AD-nahe Abläufe gegen den Docker-Dienst.
- Projekt-Builds für Community, Enterprise, PushRelay, Licensing und MAUI erkennen
  Abhängigkeits- und plattformspezifische Fehler, die Unit-Tests nicht abdecken.

Bei Änderungen an Synchronisierung oder mehreren Geräten sind mindestens diese Szenarien
zu testen: offline erstellen und bearbeiten, Neustart vor dem Senden, wiederholte Antwort,
Netzwechsel während des Sendens, Konflikt zweier Geräte, Löschen mit abhängigen Daten,
Ab- und Anmeldung mit einem anderen Konto sowie Server ohne Enterprise-Capabilities.

## Regeln für neue Kommentare

Ein Kommentar ist sinnvoll, wenn er mindestens eine dieser Fragen beantwortet:

- Welche fachliche oder sicherheitsrelevante Invariante wird geschützt?
- Warum ist die naheliegende, einfachere Implementierung falsch?
- Welche Reihenfolge oder Transaktionsgrenze ist erforderlich?
- Welches Verhalten erwarten andere Projekte oder ältere Clients?
- Welcher Fehler ist dauerhaft und welcher darf erneut versucht werden?

Öffentliche Verträge erhalten XML-Dokumentation, wenn Name und Typen die Semantik nicht
vollständig ausdrücken. Bei Codeänderungen werden zugehörige Kommentare im selben Commit
aktualisiert. Kommentare sind keine Ablage für Tickets, historischen Code oder
auskommentierte Alternativen.
