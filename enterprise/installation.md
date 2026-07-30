# Enterprise mit Docker installieren und lizenzieren

Sessage Enterprise enthält den vollständigen Community-Kern und ergänzt ihn um lizenzierte Module. Die Installation verwendet wahlweise den mitgelieferten PostgreSQL-Container oder einen vorhandenen PostgreSQL-Server.

## Voraussetzungen

- Docker Engine beziehungsweise Docker Desktop
- Docker Compose 2.20 oder neuer
- mindestens 2 GB freier Arbeitsspeicher für eine kleine Installation
- DNS, HTTPS-Reverse-Proxy und ausreichend dauerhafter Speicher
- das Enterprise-Release-Paket mit `publish/TodoSuite.Enterprise.Server.dll`
- Zugriff auf die interne Sessage-Lizenzverwaltung, um die Installation zu aktivieren

Prüfen Sie die Docker-Werkzeuge:

```powershell
docker version
docker compose version
```

## Paket ablegen

Entpacken Sie das Paket in einen dauerhaften Ordner, beispielsweise:

```text
/opt/sessage/enterprise
C:\Sessage\Enterprise
```

Der Ordner muss mindestens enthalten:

```text
compose.yml
Dockerfile
.env.example
README.md
update.ps1
update.sh
publish/TodoSuite.Enterprise.Server.dll
storage/
```

## Konfiguration erstellen

Windows:

```powershell
Copy-Item .env.example .env
```

Linux:

```bash
cp .env.example .env
chmod 600 .env
chmod +x update.sh
```

Ersetzen Sie in `.env` sämtliche `CHANGE_ME`-Werte. Konfigurieren Sie insbesondere Datenbank, initialen Administrator, JWT-Schlüssel, `ALLOWED_HOSTS` und die öffentliche `APP_BASE_URL`. Die vollständige Referenz steht unter [Docker-Konfiguration](../docker-konfiguration.md).

Für lizenzierte Push-Nachrichten tragen Sie zusätzlich die von Sessage für diese Installation bereitgestellten Werte ein:

```dotenv
PUSH_RELAY_ENDPOINT=https://push.sessage.com
PUSH_RELAY_TENANT_ID=<zugewiesene-mandanten-id>
PUSH_RELAY_API_KEY=<zugewiesener-langer-api-schlüssel>
PUSH_RELAY_TIMEOUT_SECONDS=10
```

Der API-Schlüssel gehört in die geschützte `.env`, nicht in das Containerimage oder ein Quellcode-Repository. Ohne vollständige Werte bleibt Push deaktiviert, während In-App- und E-Mail-Benachrichtigungen unverändert funktionieren. Der Container benötigt ausgehenden HTTPS-Zugriff auf `push.sessage.com:443`; eingehende Ports für Push sind nicht erforderlich.

## Variante A: PostgreSQL im Container

Belassen Sie:

```dotenv
DATABASE_MODE=internal
DATABASE_HOST=postgres
DATABASE_PORT=5432
POSTGRES_DB=sessage
POSTGRES_USER=sessage
POSTGRES_PASSWORD=<sicheres-zufälliges-passwort>
```

Die Datenbank liegt dauerhaft unter `storage/postgres/`. Starten Sie:

```powershell
.\update.ps1
```

oder unter Linux:

```bash
./update.sh
```

Das Skript aktiviert automatisch das Compose-Profil `internal-db`.

## Variante B: vorhandenes PostgreSQL

PostgreSQL 18 wird empfohlen und mit dem Paket getestet. Legen Sie eine eigene Datenbank und Rolle an:

```sql
CREATE ROLE sessage LOGIN PASSWORD '<sicheres-passwort>';
CREATE DATABASE sessage OWNER sessage ENCODING 'UTF8' TEMPLATE template0;
```

Setzen Sie danach beispielsweise:

```dotenv
DATABASE_MODE=external
DATABASE_HOST=db.example.internal
DATABASE_PORT=5432
POSTGRES_DB=sessage
POSTGRES_USER=sessage
POSTGRES_PASSWORD=<sicheres-passwort>
DATABASE_SSL_MODE=VerifyFull
DATABASE_TRUST_SERVER_CERTIFICATE=false
```

Für PostgreSQL direkt auf dem Docker-Host kann `DATABASE_HOST=host.docker.internal` verwendet werden. Das Compose-Paket stellt diesen Hostnamen auch unter Linux über das Host-Gateway bereit.

Starten Sie `update.ps1` beziehungsweise `update.sh`. Es wird nur der Enterprise-App-Container gestartet. Backup, Hochverfügbarkeit und Wartung der externen Datenbank bleiben Aufgabe des Datenbankbetriebs.

## Installation-ID erzeugen

Beim ersten erfolgreichen Start erstellt Enterprise diese persistente Datei:

```text
storage/app-data/installation.id
```

Prüfen Sie den Containerstatus und die Logs.

Interne Datenbank:

```powershell
docker compose --env-file .env -f compose.yml --profile internal-db ps
docker compose --env-file .env -f compose.yml --profile internal-db logs --tail 200 app
```

Externe Datenbank:

```powershell
docker compose --env-file .env -f compose.yml ps
docker compose --env-file .env -f compose.yml logs --tail 200 app
```

Lesen Sie anschließend die Installations-ID:

```powershell
Get-Content .\storage\app-data\installation.id
```

Linux:

```bash
cat storage/app-data/installation.id
```

::: danger Installations-ID sichern
Diese Datei bindet die Lizenz an die Installation. Wird sie gelöscht oder ersetzt, passt die bisherige Lizenz nicht mehr. Sichern Sie den gesamten Ordner `storage/app-data/`.
:::

## Enterprise-Lizenz ausstellen

1. Öffnen Sie die interne Lizenzverwaltung.
2. Legen Sie den Kunden an oder wählen Sie ihn aus.
3. Übertragen Sie die Installations-ID exakt.
4. Wählen Sie Laufzeit und gewünschte Enterprise-Module.
5. Stellen Sie die Lizenz aus und laden Sie sie herunter.
6. Laden Sie außerdem den öffentlichen Signaturschlüssel herunter.

Kopieren Sie die Dateien mit genau diesen Namen:

```text
storage/app-data/todosuite.license.json
storage/app-data/license-signing-public.pem
```

Der private Signaturschlüssel bleibt ausschließlich in der internen Lizenzverwaltung.

Starten Sie die App neu:

```powershell
docker compose --env-file .env -f compose.yml restart app
```

Melden Sie sich an und prüfen Sie die Enterprise-Funktionen. Für eine technische Prüfung liefert der authentifizierte Endpunkt `GET /api/enterprise/status` Lizenzstatus, Installation-ID, Capabilities und Modulzustände.

## Verhalten ohne gültige Lizenz

Ohne Lizenz, mit abgelaufener Lizenz oder bei einer abweichenden Installations-ID bleibt der Community-Kern nutzbar. Enterprise-Module werden nicht aktiviert. Bestehende Community-Daten werden dadurch nicht gelöscht oder verändert.

## Reverse Proxy und HTTPS

Empfohlene Grundwerte hinter einem Reverse Proxy auf demselben Host:

```dotenv
SESSAGE_BIND_ADDRESS=127.0.0.1
SESSAGE_HTTP_PORT=8080
SESSAGE_CONTAINER_PORT=8080
ALLOWED_HOSTS=localhost;aufgaben.example.de
APP_BASE_URL=https://aufgaben.example.de
FORWARDED_HEADERS_TRUST_ALL_PROXIES=false
```

`SESSAGE_HTTP_PORT` steuert den Port auf dem Docker-Host; `SESSAGE_CONTAINER_PORT` den internen ASP.NET-Port. Beide sind unabhängig voneinander konfigurierbar.

Der Reverse Proxy muss WebSockets beziehungsweise SignalR unterstützen und die üblichen Forwarded-Header korrekt setzen. Aktivieren Sie das Vertrauen in alle Proxys nur in einem abgeschotteten Netzwerkpfad.

## Persistente Daten und Backup

Sichern Sie gemeinsam:

- PostgreSQL als logisches, wiederherstellbar geprüftes Backup,
- `.env`,
- `storage/uploads/`,
- `storage/profile-pictures/`,
- `storage/data-protection/`,
- `storage/app-data/` einschließlich Installation-ID und Lizenz,
- bei Bedarf die automatisch erzeugten Dateien unter `backups/`.

Ohne `storage/data-protection/` können geschützte Anwendungsdaten und Cookies nach einer Neuinstallation unlesbar werden. Ohne `storage/app-data/installation.id` muss eine neue Lizenz ausgestellt werden.

## Enterprise aktualisieren

1. Erstellen Sie ein geprüftes Datenbankbackup.
2. Sichern Sie `.env` und den gesamten Ordner `storage/`.
3. Ersetzen Sie nur den Inhalt von `publish/` durch das neue Enterprise-Release.
4. Verändern Sie Lizenzdatei und Installation-ID nicht.
5. Führen Sie `update.ps1` oder `update.sh` aus.
6. Prüfen Sie Logs, Anmeldung, Lizenzstatus, Portfolios, Formulare und Automatisierungen.

Bei interner Datenbank erstellt das Update-Skript vor dem Image-Build ein `pg_dump` unter `backups/`. Bei externer Datenbank zeigt es eine Warnung; das externe Backup muss bereits vorhanden sein. Ausstehende EF-Core-Migrationen werden beim Start der neuen Anwendung automatisch ausgeführt.

## Stoppen und starten

Interne Datenbank:

```powershell
docker compose --env-file .env -f compose.yml --profile internal-db down
docker compose --env-file .env -f compose.yml --profile internal-db up -d --wait --wait-timeout 180
```

Externe Datenbank:

```powershell
docker compose --env-file .env -f compose.yml down
docker compose --env-file .env -f compose.yml up -d --wait --wait-timeout 180
```

Verwenden Sie nicht `down -v` und löschen Sie keine Verzeichnisse unter `storage/`.

## Häufige Fehler

| Problem | Prüfung |
| --- | --- |
| Docker ist nicht erreichbar | Docker Desktop beziehungsweise Docker-Dienst starten; unter Windows WSL-Status und ausstehende Updates prüfen |
| App startet wiederholt | App-Logs, Datenbankzugriff und fehlgeschlagene Migration prüfen |
| Kein PostgreSQL-Container sichtbar | Bei `DATABASE_MODE=external` beabsichtigt; sonst Modus und Profil prüfen |
| Lizenzstatus `license-missing` | Dateiname und Mount unter `storage/app-data/` prüfen |
| `installation-mismatch` | Lizenz für den Inhalt der aktuellen `installation.id` neu ausstellen |
| Enterprise-Funktion fehlt | Lizenzstatus und freigeschaltete Capability kontrollieren |
| Links zeigen auf localhost | `APP_BASE_URL` auf die öffentliche HTTPS-Adresse setzen |
| Push wird in der App nicht angeboten | Capability `enterprise.push-notifications`, Relay-Werte und ausgehendes HTTPS zu `push.sessage.com:443` prüfen |
