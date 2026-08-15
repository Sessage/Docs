# Enterprise ohne Docker installieren

Die direkten Pakete enthalten Sessage als selbstenthaltene Anwendung. Auf dem Zielserver sind weder Docker noch .NET SDK oder .NET Runtime erforderlich. PostgreSQL wird nicht automatisch installiert und muss vorab erreichbar sein.

## PostgreSQL vorbereiten

Verwenden Sie eine unterstützte PostgreSQL-Version, legen Sie Datenbank und Rolle an und erlauben Sie dem Benutzer Schemaänderungen für automatische EF-Core-Migrationen:

```sql
CREATE ROLE sessage LOGIN PASSWORD '<langes-zufälliges-passwort>';
CREATE DATABASE sessage OWNER sessage ENCODING 'UTF8' TEMPLATE template0;
```

Bei einer entfernten Datenbank wird TLS mit `VerifyFull` empfohlen. Testen Sie DNS, Firewall, Zertifikat und Anmeldung vom Anwendungsserver aus. Datenbankbackup, Überwachung und Aktualisierung bleiben Aufgabe des Serverbetriebs.

## Windows Server

1. `sessage-enterprise-windows-x64-<version>.zip` dauerhaft entpacken.
2. Die ZIP-Prüfsumme mit `SHA256SUMS.txt` vergleichen.
3. PowerShell **als Administrator** im Paketordner öffnen.
4. Starten:

   ```powershell
   .\install.ps1
   ```

Der Assistent fragt URL, Port, Administrator und PostgreSQL-Zugang ab. Standardmäßig entstehen:

| Bestandteil | Pfad/Name |
| --- | --- |
| Windows-Dienst | `SessageEnterprise` |
| Programm | `C:\Program Files\Sessage\Enterprise` |
| persistente Daten | `C:\ProgramData\Sessage\Enterprise` |
| lokale Bindung | `http://127.0.0.1:8080` |

Der Dienst läuft als eingeschränktes Konto `LocalService`; Kennwörter und persistente Daten erhalten passende ACLs. Status und Neustart:

```powershell
Get-Service SessageEnterprise
Restart-Service SessageEnterprise
Invoke-WebRequest http://127.0.0.1:8080/healthz -UseBasicParsing
```

## Linux mit systemd

1. `sessage-enterprise-linux-x64-<version>.zip` dauerhaft entpacken.
2. Prüfsumme vergleichen.
3. Im Paketordner starten:

   ```bash
   sudo sh install.sh
   ```

Standardmäßig entstehen:

| Bestandteil | Pfad/Name |
| --- | --- |
| systemd-Dienst | `sessage-enterprise` |
| Programm | `/opt/sessage/enterprise` |
| persistente Daten | `/var/lib/sessage-enterprise` |
| geschützte Konfiguration | `/etc/sessage-enterprise/sessage.env` |
| lokale Bindung | `http://127.0.0.1:8080` |

Das Skript legt einen nicht interaktiven Benutzer `sessage` an und aktiviert einen gehärteten systemd-Dienst. Erforderlich sind `systemd`, `openssl` und `curl`.

```bash
systemctl status sessage-enterprise
journalctl -u sessage-enterprise -n 200 --no-pager
curl --fail http://127.0.0.1:8080/healthz
```

## Lizenz installieren

Die Installations-ID liegt unter Windows in `C:\ProgramData\Sessage\Enterprise\App_Data\installation.id`, unter Linux in `/var/lib/sessage-enterprise/App_Data/installation.id`.

Windows, als Administrator:

```powershell
.\install-license.ps1 `
  -LicenseFile C:\Transfer\todosuite.license.json `
  -PublicKeyFile C:\Transfer\license-signing-public.pem
```

Linux:

```bash
sudo sh install-license.sh /tmp/todosuite.license.json /tmp/license-signing-public.pem
```

Das Skript verweigert eine Lizenz mit abweichender Installations-ID und wartet nach dem Neustart auf `/healthz`.

## Reverse Proxy und Firewall

Die direkte Installation bindet Sessage bewusst nur an `127.0.0.1`. Veröffentlichen Sie die Anwendung über IIS, nginx, Apache oder Caddy mit HTTPS. Der Proxy muss `X-Forwarded-For`, `X-Forwarded-Proto`, den ursprünglichen Host sowie WebSocket-Upgrades weiterreichen. Öffnen Sie den lokalen Sessage-Port nicht öffentlich.

## Update und Rollback

Vor jedem Update Datenbank und persistenten Datenordner sichern. Entpacken Sie das neue, zur Plattform passende Paket in einen neuen temporären Ordner und führen Sie dort als Administrator/root aus:

```powershell
.\update.ps1
```

```bash
sudo sh update.sh
```

Das Skript liest den gespeicherten Installationsstatus, stoppt den Dienst, tauscht nur die Programmdateien aus und prüft `/healthz`. Konfiguration, Uploads, Data-Protection-Schlüssel, Installations-ID und Lizenz bleiben erhalten. Bei einem fehlgeschlagenen Healthcheck wird automatisch auf die vorherige Anwendung zurückgeschaltet. Diese Vorversion liegt unterhalb des persistenten Ordners `backups/`.

::: danger Datenbankmigrationen
Sessage führt ausstehende Migrationen beim Start aus. Ein Anwendungsrollback kann eine bereits angewendete, inkompatible Datenbankmigration nicht zurücknehmen. Halten Sie deshalb immer ein unmittelbar vor dem Update erstelltes und wiederherstellbares PostgreSQL-Backup bereit.
:::

## Vollständiges Backup

Sichern Sie gemeinsam und extern:

- PostgreSQL als logisch geprüften Dump,
- unter Windows `C:\ProgramData\Sessage\Enterprise`,
- unter Linux `/var/lib/sessage-enterprise` und `/etc/sessage-enterprise`,
- Reverse-Proxy-Konfiguration und TLS-Automatisierung.

Eine Wiederherstellung gilt erst als geprüft, wenn Anmeldung, Uploads, Lizenzstatus und eine Schreiboperation auf einem getrennten System funktionieren.
