# Enterprise installieren und lizenzieren

Sessage Enterprise wird als fertiges Kundenpaket ausgeliefert. Quellcode und .NET SDK werden auf dem Kundenserver nicht benötigt.

## Installationsart wählen

| Variante | Passendes Paket | Voraussetzungen | Empfehlung |
| --- | --- | --- | --- |
| Docker | `sessage-enterprise-docker-<version>.zip` | Docker Engine/Desktop und Compose v2 | Standard für neue Einzelserver |
| Windows ohne Docker | `sessage-enterprise-windows-x64-<version>.zip` | Windows Server x64, PostgreSQL und Reverse Proxy | Wenn Windows-Dienste bevorzugt werden |
| Linux ohne Docker | `sessage-enterprise-linux-x64-<version>.zip` | Linux x64 mit systemd, PostgreSQL und Reverse Proxy | Wenn Container nicht erlaubt sind |

Die Docker-Variante kann PostgreSQL automatisch mitbetreiben. Die direkten Pakete installieren bewusst keinen Datenbankserver: Sie verbinden Sessage mit einer bereits angelegten PostgreSQL-Datenbank. Die Anleitung dafür steht unter [Direktinstallation ohne Docker](./direktinstallation.md).

## Docker-Schnellinstallation

### Voraussetzungen

- Docker Engine beziehungsweise Docker Desktop
- Docker Compose 2.20 oder neuer
- mindestens 2 GB freier Arbeitsspeicher für eine kleine Installation
- ein dauerhafter Installationsordner
- für Produktion: DNS-Name, HTTPS-Reverse-Proxy und externes Backupziel

Entpacken Sie das Docker-Paket und öffnen Sie ein Terminal im entpackten Ordner. Vergleichen Sie vorher die ZIP-Datei mit `SHA256SUMS.txt`.

Windows PowerShell:

```powershell
.\install.ps1
```

Linux:

```bash
chmod +x install.sh update.sh install-license.sh
./install.sh
```

Der Assistent fragt nur die öffentliche URL, den lokalen Port, den ersten Administrator und die Datenbankart ab. Leere Administrator-Kennwörter werden sicher generiert; Datenbank- und JWT-Geheimnisse für die interne Datenbank ebenfalls. Danach erstellt er `.env`, die persistenten Ordner und startet Sessage. Bewahren Sie ein angezeigtes Initialkennwort nur bis zur ersten Anmeldung sicher auf und ändern Sie es anschließend.

Für eine Einzelinstallation wählen Sie `intern`. Bei `extern` müssen Datenbank, Benutzer, Netzwerkzugriff, TLS und Backups bereits eingerichtet sein. Details zu allen Variablen stehen unter [Docker-Konfiguration](../docker-konfiguration.md). Die Verzeichnisanmeldung wird separat unter [AD-Anbindung](../ad-anbindung.md) erklärt.

::: warning Vorhandene Installation
`install.ps1` beziehungsweise `install.sh` ist nur für die Erstinstallation. Sobald `.env` vorhanden ist, verwenden Sie für neue Versionen ausschließlich `update.ps1` oder `update.sh`.
:::

## Installations-ID und Lizenz

Beim ersten erfolgreichen Start entsteht dauerhaft:

```text
storage/app-data/installation.id
```

Zeigen Sie die ID bei Bedarf an:

```powershell
Get-Content .\storage\app-data\installation.id
```

```bash
cat storage/app-data/installation.id
```

Stellen Sie in der internen Lizenzverwaltung eine Lizenz für genau diese ID aus und laden Sie dort das `sessage-license-….zip` herunter. Es enthält Lizenz und exakt passenden öffentlichen Schlüssel.

Installieren Sie beide Dateien mit dem mitgelieferten Skript. Es prüft Dateiformat und Installations-ID, kopiert atomar und wartet nach dem Neustart auf einen erfolgreichen Healthcheck. Erfolg wird erst gemeldet, nachdem die laufende Anwendung Signatur, Installations-ID und Laufzeit bestätigt hat.

Windows:

```powershell
.\install-license.ps1 -LicenseFile C:\Transfer\sessage-license.zip
```

Linux:

```bash
./install-license.sh /tmp/sessage-license.zip
```

Unter Linux wird dafür `unzip` benötigt, beispielsweise `sudo apt install unzip` auf Debian/Ubuntu.

Der private Signaturschlüssel bleibt ausschließlich auf dem internen Lizenzserver. Das Installationsskript rollt bei einer ungültigen Signatur oder einem Startfehler automatisch auf die vorherige Lizenz zurück und bewahrt die abgelehnten Dateien unter `storage/app-data/rejected-license-*` auf. Sichern Sie `storage/app-data/` vollständig; ohne dieselbe `installation.id` ist eine neue Lizenz nötig.

Der Installer verlangt das aktuelle Lizenzformat 3 auf beiden Seiten. Meldet er einen veralteten Enterprise-Container, wurde zwar das Skript, aber noch nicht der neu veröffentlichte Inhalt von `publish/` aktualisiert. Meldet er eine fehlende `keyId` oder `signedPayload`, muss der separate Lizenzserver aktualisiert und die Lizenz anschließend **neu ausgestellt** werden.

## Adresse und Reverse Proxy

Für einen Test kann Sessage direkt unter `http://server:8080` veröffentlicht werden. Produktiv sollte ein Reverse Proxy HTTPS terminieren und Sessage nur lokal erreichen. Geben Sie dann im Assistenten die öffentliche URL wie `https://aufgaben.example.de` und als Bind-Adresse `127.0.0.1` an.

Der Proxy muss WebSockets/SignalR und ausreichend große Uploads unterstützen. Prüfen Sie nach der Einrichtung:

```text
https://aufgaben.example.de/healthz
```

Der Endpunkt muss HTTP 200 liefern. `APP_BASE_URL` muss der öffentlichen HTTPS-Adresse entsprechen.

## Aktualisieren

1. Prüfsumme und Releasehinweise prüfen.
2. Einen geprüften Datenbank-Dump, `.env` und den gesamten Ordner `storage/` extern sichern.
3. Nur die austauschbaren Paketdateien aus der neuen Version übernehmen; `.env`, `storage/` und `backups/` erhalten.
4. Im Installationsordner starten:

```powershell
.\update.ps1
```

```bash
./update.sh
```

Bei interner PostgreSQL-Datenbank legt das Skript vor einem Update automatisch einen geprüften Dump unter `backups/` an. Bei externer Datenbank bleibt das Backup Aufgabe des Datenbankbetriebs. Das Update gilt erst als erfolgreich, wenn `/healthz` wieder antwortet und eine vorhandene Enterprise-Lizenz von `/healthz/license` als gültig bestätigt wurde. Lizenzdateien aus älteren Ablagen unter `storage/App_Data/` oder direkt unter `storage/` werden bei leerem aktuellem Ziel automatisch nach `storage/app-data/` kopiert.

## Betrieb und Sicherung

Gemeinsam sichern:

- einen geprüften PostgreSQL-Dump,
- `.env`,
- `storage/uploads/`,
- `storage/profile-pictures/`,
- `storage/data-protection/`,
- `storage/app-data/` mit Installations-ID, Lizenz und öffentlichem Schlüssel.

Container dürfen ersetzt werden. Verwenden Sie nicht `docker compose down -v` und löschen Sie keine Ordner unter `storage/`.

Die interne PostgreSQL-Datenbank liegt im Docker-Volume `sessage-enterprise-postgres-data`. Dadurch funktionieren Eigentümer und Zugriffsrechte auch mit rootless Docker, `userns-remap` und Installationsordnern unter `/var/www`. Das Volume bleibt bei `docker compose down` erhalten, würde durch `docker compose down -v` jedoch gelöscht. Maßgebliche Sicherung für Wiederherstellungen bleibt der geprüfte Dump unter `backups/` beziehungsweise dessen externe Kopie.

Status und Logs bei interner Datenbank:

```powershell
docker compose --env-file .env -f compose.yml --profile internal-db ps
docker compose --env-file .env -f compose.yml --profile internal-db logs --tail 200 postgres
docker compose --env-file .env -f compose.yml --profile internal-db logs --tail 200 app
```

Bei externer Datenbank lassen Sie `--profile internal-db` weg.

## Häufige Fehler

| Problem | Prüfung |
| --- | --- |
| Docker nicht erreichbar | Docker-Dienst/Desktop und `docker compose version` prüfen |
| PostgreSQL ist `unhealthy` oder startet neu | PostgreSQL-Logs, `docker volume inspect sessage-enterprise-postgres-data` und freien Speicher prüfen; Daten älterer Hauptversionen nur per `pg_dump`/Restore migrieren |
| App wird nicht gesund | App-Logs, Datenbankzugriff, freien Speicher, Migrationen und die Kennwortregeln für den initialen Administrator prüfen |
| `license-missing` | beide Dateien unter `storage/app-data/` und Namen prüfen |
| `installation-mismatch` | Lizenz für den aktuellen Inhalt von `installation.id` neu ausstellen |
| `public-key-mismatch` | zusammengehöriges ZIP-Lizenzpaket neu herunterladen und installieren |
| Links zeigen auf localhost | öffentliche URL beziehungsweise `APP_BASE_URL` korrigieren |
| Enterprise-Modul fehlt | Lizenzstatus und freigeschaltete Capability kontrollieren |

Der authentifizierte Endpunkt `GET /api/enterprise/status` zeigt Lizenzstatus, Installations-ID, Capabilities und Modulzustände. Ohne gültige Lizenz bleibt der Community-Kern verfügbar; Enterprise-Module werden nicht aktiviert.

Für die schnelle Betriebsdiagnose liefert `GET /healthz/license` ausschließlich Edition, Gültigkeit, maschinenlesbaren Status und Ablaufzeit. Lizenzinhalt, Kunde, Installations-ID und Schlüsselpfade werden dort nicht ausgegeben. Die Update- und Lizenzinstallationsskripte rufen diesen Endpunkt innerhalb des Containers automatisch auf.
