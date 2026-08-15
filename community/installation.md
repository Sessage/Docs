# Community mit Docker installieren

Diese Anleitung installiert Sessage Community zusammen mit einem persistenten PostgreSQL-Container oder verbindet die Anwendung mit einem vorhandenen PostgreSQL-Server.

## Voraussetzungen

- ein Linux- oder Windows-Server mit Docker Engine beziehungsweise Docker Desktop
- Docker Compose 2.20 oder neuer
- mindestens 2 GB freier Arbeitsspeicher für eine kleine Installation
- ausreichend Speicherplatz für Datenbank, Anhänge und Backups
- ein DNS-Name und für den Produktivbetrieb ein HTTPS-Reverse-Proxy
- das vollständige Community-Release-Paket mit gefülltem `publish/`-Ordner

Prüfen Sie Docker:

```powershell
docker version
docker compose version
```

## Paket ablegen

Kopieren und entpacken Sie das Community-Paket in einen dauerhaft verwendeten Ordner, beispielsweise:

```text
/opt/sessage/community                 # Linux
C:\Sessage\Community                   # Windows
```

Der Ordner enthält mindestens:

```text
compose.yml
Dockerfile
.env.example
README.md
update.ps1
update.sh
publish/TodoSuite.Community.dll
storage/
```

Führen Sie alle weiteren Befehle in diesem Ordner aus.

## Konfiguration anlegen

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux:

```bash
cp .env.example .env
chmod 600 .env
```

Öffnen Sie `.env` und ersetzen Sie jeden Wert mit `CHANGE_ME`. Verwenden Sie unterschiedliche, zufällige Werte für:

- `POSTGRES_PASSWORD`
- `INITIAL_ADMIN_PASSWORD`
- `JWT_KEY`

Passen Sie außerdem mindestens `INITIAL_ADMIN_EMAIL`, `ALLOWED_HOSTS` und `APP_BASE_URL` an. Alle Variablen sind unter [Docker-Konfiguration](../docker-konfiguration.md) erläutert.

## Variante A: PostgreSQL im Docker-Paket

Die mitgelieferte `.env.example` ist für diese Variante vorbereitet:

```dotenv
DATABASE_MODE=internal
DATABASE_HOST=postgres
DATABASE_PORT=5432
POSTGRES_DB=sessage
POSTGRES_USER=sessage
POSTGRES_PASSWORD=<sicheres-zufälliges-passwort>
```

PostgreSQL-Daten werden dauerhaft unter `storage/postgres/` gespeichert. Ein Container- oder Image-Austausch löscht sie nicht.

Starten Sie die Installation:

```powershell
.\update.ps1
```

Unter Linux:

```bash
chmod +x update.sh
./update.sh
```

Das Skript baut das Community-Image, startet PostgreSQL mit dem Profil `internal-db`, wartet auf den Datenbankzustand und startet anschließend Sessage.

## Variante B: vorhandenes PostgreSQL verwenden

Verwenden Sie bevorzugt PostgreSQL 18, da diese Version auch mit dem Paket getestet wird. Legen Sie auf dem externen Server eine leere Datenbank und einen eigenen Benutzer an. Beispiel als PostgreSQL-Administrator:

```sql
CREATE ROLE sessage LOGIN PASSWORD '<sicheres-passwort>';
CREATE DATABASE sessage OWNER sessage ENCODING 'UTF8' TEMPLATE template0;
```

Der Benutzer muss das Schema erstellen und durch EF-Core-Migrationen verändern dürfen. Begrenzen Sie den Netzwerkzugriff der Datenbank auf den Docker-Host und verwenden Sie bei einer Netzwerkverbindung TLS.

Ändern Sie `.env`:

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

Läuft PostgreSQL direkt auf demselben Rechner wie Docker, kann `DATABASE_HOST=host.docker.internal` verwendet werden. Unter Linux wird dieser Name durch das Compose-Paket auf das Host-Gateway abgebildet.

Starten Sie anschließend ebenfalls `update.ps1` oder `update.sh`. Bei `DATABASE_MODE=external` wird kein PostgreSQL-Container gestartet.

::: warning Backup der externen Datenbank
Das Sessage-Update-Skript kann eine extern verwaltete Datenbank nicht zuverlässig sichern. Erstellen und prüfen Sie das Datenbankbackup mit Ihrem PostgreSQL-Betriebsverfahren, bevor Sie Sessage aktualisieren.
:::

## Ersten Start prüfen

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

Der App-Container und bei der internen Variante zusätzlich `postgres` müssen den Zustand
`healthy` besitzen. Das Update-Skript wartet dafür auf den Liveness-Endpunkt `/healthz` und
meldet Start- oder Migrationsfehler, statt das Update vorzeitig als erfolgreich zu beenden.
Öffnen Sie danach die in `APP_BASE_URL` konfigurierte Adresse und melden Sie sich mit
`INITIAL_ADMIN_EMAIL` und `INITIAL_ADMIN_PASSWORD` an.

Beim Start führt Sessage alle noch nicht angewendeten EF-Core-Migrationen aus. Schlägt eine Migration oder Datenbankverbindung fehl, beendet sich der App-Prozess und Docker versucht den Neustart. Prüfen Sie dann zuerst die App-Logs und die Datenbankerreichbarkeit.

## Reverse Proxy und HTTPS

Produktiv sollte Sessage nur über HTTPS erreichbar sein. Ein Reverse Proxy wie nginx, Apache, Caddy oder ein vorhandener Ingress leitet auf `http://127.0.0.1:8080` weiter.

Empfohlene Werte:

```dotenv
SESSAGE_BIND_ADDRESS=127.0.0.1
SESSAGE_HTTP_PORT=8080
SESSAGE_CONTAINER_PORT=8080
ALLOWED_HOSTS=localhost;aufgaben.example.de
APP_BASE_URL=https://aufgaben.example.de
FORWARDED_HEADERS_TRUST_ALL_PROXIES=false
```

`SESSAGE_HTTP_PORT` ist der Port auf dem Docker-Host. `SESSAGE_CONTAINER_PORT` ist der interne ASP.NET-Port. Meist bleibt der interne Port auf `8080`, während nur der Host-Port angepasst wird.

Aktivieren Sie `FORWARDED_HEADERS_TRUST_ALL_PROXIES` nur, wenn der Container ausschließlich hinter einem kontrollierten Proxy erreichbar ist. In größeren Netzen sollten bekannte Proxyadressen gezielt in der ASP.NET-Konfiguration festgelegt werden.

## Persistente Daten sichern

Für eine vollständige Sicherung benötigen Sie:

- die PostgreSQL-Datenbank als geprüftes logisches Backup,
- `.env`,
- `storage/uploads/`,
- `storage/profile-pictures/`,
- `storage/data-protection/`,
- `storage/app-data/`.

Kopieren Sie nicht einfach einen aktiven PostgreSQL-Datenordner. Verwenden Sie `pg_dump` beziehungsweise Ihr verwaltetes PostgreSQL-Backup.

## Community aktualisieren

1. Erstellen und prüfen Sie ein Datenbankbackup.
2. Sichern Sie `.env` und `storage/`.
3. Ersetzen Sie ausschließlich den Inhalt von `publish/` durch das neue Community-Release.
4. Lassen Sie `.env`, `storage/` und `backups/` unverändert.
5. Führen Sie `update.ps1` beziehungsweise `update.sh` aus.
6. Prüfen Sie Containerstatus, Logs, Anmeldung und wichtige Listen.

Bei internem PostgreSQL erkennt das Skript eine vorhandene Datenbank und legt vor dem Update ein `pg_dump` unter `backups/` an. Danach baut es nur das App-Image neu. Migrationen werden beim Start der neuen Anwendung ausgeführt.

## Stoppen und erneut starten

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

Verwenden Sie nicht `down -v` und löschen Sie `storage/` nicht. Die Bind-Mounts sind absichtlich außerhalb des Container-Dateisystems gespeichert.

## Fehler eingrenzen

- Docker ist nicht erreichbar: Docker Desktop beziehungsweise den Docker-Dienst starten. Unter Windows `wsl --status` prüfen und ausstehende WSL-Updates mit administrativen Rechten durchführen.
- `CHANGE_ME`-Fehler: Alle Platzhalter in `.env` ersetzen.
- Datenbank nicht erreichbar: Host, Port, Firewall, TLS-Modus und Zugangsdaten prüfen.
- PostgreSQL startet wiederholt: `docker compose ... logs postgres` lesen. Daten einer älteren PostgreSQL-Hauptversion dürfen nicht als Datenordner übernommen werden, sondern müssen per `pg_dump` und Restore migriert werden.
- App startet wiederholt: `docker compose ... logs app` lesen; häufig ist eine Migration oder die Initialkonfiguration fehlgeschlagen. Das initiale Administratorkennwort benötigt mindestens 12 Zeichen sowie Groß- und Kleinbuchstaben, Ziffer und Sonderzeichen.
- Einladungslink zeigt auf localhost: `APP_BASE_URL` auf die öffentliche HTTPS-Adresse setzen und App neu starten.
- Anmeldung des initialen Administrators scheitert: Beachten, dass das Initialkennwort ein bestehendes Konto nicht überschreibt.
