# Mein Tag: persönliche Tagesplanung

## Bedienung

- **Mein Tag** steht in der Navigation von Web und Mobile, direkt vor **Aufgaben**.
- Unter **Aufgaben / Meine zugewiesenen Aufgaben** und in Listenansichten besitzt
  jede Aufgabenkarte eine Schaltfläche zum Hinzufügen oder Entfernen aus Mein Tag.
  Der Aufgabendialog bietet dieselbe Aktion, auch bei schreibgeschützten Listen.
- **Mehrfachauswahl** auf der Aufgaben- und Mein-Tag-Seite ermöglicht die Auswahl
  über mehrere Ursprungslisten hinweg. In der Aktionsleiste stehen **Zu Mein Tag
  hinzufügen** und **Aus Mein Tag entfernen** bereit. Die gemeinsame Aktionsleiste
  bietet diese beiden Aktionen auch in Listen-, Tabellen- und Kanbanansichten.
- Vorschläge priorisieren überfällige, heute fällige und wichtige offene Aufgaben.
  Weitere Aufgaben können über den Suchbereich ausgewählt werden. 3 bis 7 Aufgaben
  werden empfohlen, mehr sind erlaubt. Pro Mehrfachänderung sind maximal 500 möglich.

## Synchronisierung und Fehlerverhalten

`DailyFocusClient` hält einen gemeinsamen bestätigten Zustand pro angemeldeter
Sitzung. Einzelaktionen, Mehrfachauswahl und Mein Tag aktualisieren sich nach einem
erfolgreichen Speichervorgang unmittelbar. Ein einziger `DailyFocusSync` pro Layout
prüft den Server alle zehn Sekunden und beim Zurückkehren oder Wiederverbinden.
Die Hintergrundabfrage lädt nur den Tagesplan; die Mein-Tag-Seite lädt zusätzlich
betroffene Listen, ohne einen geöffneten Aufgabendialog neu zu initialisieren.

Eine Serververbindung ist erforderlich. Fehler werden sichtbar gemeldet; die
Mehrfachauswahl bleibt für einen erneuten Versuch erhalten. Fehlgeschlagene Aktionen
werden nicht als erfolgreich dargestellt. Ein Profil-/Serverwechsel verwirft den
vorherigen Zustand. Antworten aus einer vorherigen Sitzung werden nicht übernommen.

Die erste Verwendung legt die gemeinsame Kontozeitzone anhand des Geräts fest.
Weitere Geräte übernehmen diese Zeitzone. Das Datum und der nächste Tageswechsel
kommen vom Server; Sommerzeit und Mitternachtswechsel werden berücksichtigt. Alte
Auswahlen verändern keine Aufgaben. Verspätete Anfragen für einen anderen Tag werden
nicht angewendet; die Oberfläche fordert dann eine erneute Auswahl an.

Bestehende lokale Auswahlen werden für denselben Tag übernommen, sofern die Aufgaben
noch zugänglich sind. Danach wird der alte lokale Eintrag entfernt.

## API und Datenbank

- `GET /api/my-day?timeZoneId=Europe%2FBerlin`
- `PUT /api/my-day/tasks/{taskId}` mit `date` (YYYY-MM-DD) und `selected`
- `PUT /api/my-day/tasks` mit `date`, `selected` und `taskIds` (1–500 IDs)

Der Benutzer wird ausschließlich aus der Anmeldung bestimmt. Jede Anfrage prüft die
Leserechte auf alle betroffenen Aufgaben. Mehrfachänderungen sind atomar und
idempotent: Unzugängliche Aufgaben verhindern den gesamten Vorgang. Änderungen
verschiedener Aufgaben überschreiben sich nicht. Gelöschte Aufgaben oder entzogene
Freigaben verschwinden aus dem Tagesplan.

Die Migration `20260906120000_AddDailyFocus` erstellt `DailyFocusPreferences` und
`DailyFocusSelections`. Sie wird über den vorhandenen Migrationslauf beim Start des
aktualisierten Servers angewendet. Server und Clients gemeinsam aktualisieren.
Diese Entwicklung führt keine Migration auf einer bestehenden Kundendatenbank aus.

## Release-Prüfung

```
npm --prefix Community run tw:build
dotnet test TodoSuite.Server.Tests/TodoSuite.Server.Tests.csproj --no-restore --disable-build-servers -m:1 --filter "FullyQualifiedName~DailyFocus|FullyQualifiedName~LocalizationResourceTests"
node --test --test-isolation=none tools/daily-focus.test.mjs
dotnet run --project tools/DailyFocusUiTests/DailyFocusUiTests.csproj --no-restore --disable-build-servers -p:BuildInParallel=false
```

Der isolierte Browser-Test nutzt die echten Webkomponenten, künstliche Benutzer und
eine InMemory-Datenbank. Er prüft Navigation, Kartenaktionen, Dialog, Mehrfachauswahl,
zweiten Gerätekontext, Kontotrennung, Fehler/Wiederholung und schmale Bildschirme.
Die Servertests prüfen Berechtigungen, Batch-Grenzen, Tageswechsel, Sommerzeit und
das PostgreSQL-Modell samt generiertem Migrations-SQL. Eine Migration gegen eine
laufende PostgreSQL-Instanz und native iOS-/Android-Gerätetests sind separate
Releaseprüfungen auf den entsprechenden Plattformen.
