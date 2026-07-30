# Community direkt auf Linux betreiben

Diese Anleitung betreibt Sessage Community ohne Anwendungscontainer als gehärteten
`systemd`-Dienst. PostgreSQL kann auf demselben Server oder auf einem getrennten
Datenbankserver laufen. Für die meisten Installationen ist der
[Docker-Compose-Weg](./installation.md) einfacher; der direkte Betrieb eignet sich, wenn
Ihre IT .NET-Dienste, PostgreSQL, Reverse Proxy und Sicherungen bereits standardisiert
verwaltet.

## Zielaufbau

```text
/opt/sessage/releases/<version>/     schreibgeschützte Programmdateien
/opt/sessage/current                 Symlink auf die aktive Version
/var/lib/sessage/                    Uploads, Profilbilder und Data-Protection-Schlüssel
/etc/sessage/community.env           geschützte Konfiguration und Geheimnisse
/etc/systemd/system/sessage.service  Dienstdefinition
```

Die Anwendung lauscht nur auf `127.0.0.1:8080`. Caddy, nginx, Apache oder ein vorhandener
Load Balancer stellt davor HTTPS bereit. Veröffentlichen Sie Kestrel nicht unverschlüsselt
im Internet.

## Voraussetzungen

- eine weiterhin unterstützte 64-Bit-Linux-Distribution,
- das ASP.NET Core Runtime Hosting Bundle für .NET 10,
- PostgreSQL 18 oder ein kompatibler, vom Betreiber gepflegter PostgreSQL-Server,
- ein dedizierter DNS-Name und ein HTTPS-Reverse-Proxy,
- das .NET 10 SDK auf einem Buildsystem, falls aus dem Quellcode gebaut wird,
- Root-Rechte ausschließlich für Installation und Dienstverwaltung.

Prüfen Sie Runtime und Datenbankzugriff:

```bash
dotnet --info
psql --version
```

## 1. Eigenen Dienstbenutzer und Verzeichnisse anlegen

```bash
sudo useradd --system --home-dir /var/lib/sessage --create-home \
  --shell /usr/sbin/nologin sessage
sudo install -d -o root -g root -m 0755 /opt/sessage/releases
sudo install -d -o root -g sessage -m 0750 /etc/sessage
sudo install -d -o sessage -g sessage -m 0750 \
  /var/lib/sessage/app-data \
  /var/lib/sessage/uploads \
  /var/lib/sessage/profile-pictures \
  /var/lib/sessage/.aspnet/DataProtection-Keys
```

Der Dienstbenutzer erhält keine interaktive Shell und keine Schreibrechte auf die
Programmdateien.

## 2. PostgreSQL vorbereiten

Legen Sie eine eigene Rolle und Datenbank an. Führen Sie diese Befehle als
PostgreSQL-Administrator aus und ersetzen Sie das Beispielkennwort:

```sql
CREATE ROLE sessage LOGIN PASSWORD '<langes-zufälliges-passwort>';
CREATE DATABASE sessage OWNER sessage ENCODING 'UTF8' TEMPLATE template0;
```

Der Benutzer muss das Schema erstellen und durch die mitgelieferten EF-Core-Migrationen
aktualisieren dürfen. Begrenzen Sie den Netzwerkzugriff auf den Anwendungsserver und nutzen
Sie bei einer Netzwerkverbindung `SSL Mode=VerifyFull` mit vertrauenswürdigem Zertifikat.

## 3. Community veröffentlichen

Erstellen Sie das Release auf einem vertrauenswürdigen Buildsystem aus einem geprüften Tag
oder Commit:

```bash
git clone https://github.com/Sessage/Community-Server.git
cd Community-Server
dotnet restore Community-Server.slnx
dotnet publish Community/TodoSuite.Community.csproj \
  --configuration Release \
  --no-restore \
  --output artifacts/community
```

Übertragen Sie den Inhalt von `artifacts/community` auf den Server. Legen Sie für jedes
Release einen neuen Ordner an; im Beispiel ist `1.0.0` durch Ihre Version zu ersetzen:

```bash
sudo install -d -o root -g root -m 0755 /opt/sessage/releases/1.0.0
sudo cp -a artifacts/community/. /opt/sessage/releases/1.0.0/
sudo install -d -o root -g root -m 0755 \
  /opt/sessage/releases/1.0.0/App_Data \
  /opt/sessage/releases/1.0.0/uploads \
  /opt/sessage/releases/1.0.0/wwwroot/profile-pictures
sudo ln -sfn /opt/sessage/releases/1.0.0 /opt/sessage/current
```

Die letzten drei Zielordner werden beim Dienststart mit den persistenten Verzeichnissen
unter `/var/lib/sessage` überlagert. Programmdateien und Laufzeitdaten bleiben dadurch
sauber getrennt.

## 4. Geschützte Konfiguration erstellen

Erstellen Sie `/etc/sessage/community.env` ohne Einchecken in Git. Werte mit Leerzeichen
oder Semikolon werden für `systemd` in doppelte Anführungszeichen gesetzt:

```dotenv
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://127.0.0.1:8080
ConnectionStrings__DefaultConnection="Host=db.example.internal;Port=5432;Database=sessage;Username=sessage;Password=<datenbankpasswort>;SSL Mode=VerifyFull;Trust Server Certificate=false"
AllowedHosts="localhost;aufgaben.example.de"
InitialAdmin__Email=admin@example.de
InitialAdmin__Password=<einmaliges-starkes-initialkennwort>
InitialAdmin__WritePasswordFile=false
Jwt__Key=<zufälliger-geheimer-wert-mit-mindestens-32-bytes>
Jwt__Issuer=Sessage.Server
Jwt__Audience=Sessage.App
Smtp__AppBaseUrl=https://aufgaben.example.de
AllowRegistration=false
ForwardedHeaders__TrustAllProxies=false
ForwardedHeaders__KnownProxies__0=127.0.0.1
```

Setzen Sie die Dateirechte:

```bash
sudo chown root:sessage /etc/sessage/community.env
sudo chmod 0640 /etc/sessage/community.env
```

Das Initialkennwort legt nur bei einer leeren Datenbank das erste Administratorkonto an und
ändert kein bestehendes Konto. Lassen Sie es nach der erfolgreichen Ersteinrichtung nicht
unnötig in Automatisierungsprotokollen erscheinen. SMTP, Registrierung, AD/LDAP und weitere
Optionen stehen in der [Konfigurationsreferenz](../docker-konfiguration.md); die dort
aufgeführten ASP.NET-Core-Schlüssel gelten auch ohne Docker.

## 5. systemd-Dienst einrichten

Erstellen Sie `/etc/systemd/system/sessage.service`:

```ini
[Unit]
Description=Sessage Community Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=sessage
Group=sessage
WorkingDirectory=/opt/sessage/current
Environment=HOME=/var/lib/sessage
Environment=DOTNET_NOLOGO=true
EnvironmentFile=/etc/sessage/community.env
ExecStart=/usr/bin/dotnet /opt/sessage/current/TodoSuite.Community.dll
Restart=on-failure
RestartSec=5
TimeoutStopSec=30
UMask=0077

NoNewPrivileges=true
PrivateDevices=true
PrivateTmp=true
ProtectControlGroups=true
ProtectHome=true
ProtectKernelModules=true
ProtectKernelTunables=true
ProtectSystem=strict
ReadWritePaths=/var/lib/sessage
BindPaths=/var/lib/sessage/app-data:/opt/sessage/current/App_Data
BindPaths=/var/lib/sessage/uploads:/opt/sessage/current/uploads
BindPaths=/var/lib/sessage/profile-pictures:/opt/sessage/current/wwwroot/profile-pictures

[Install]
WantedBy=multi-user.target
```

Laden und starten Sie den Dienst:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now sessage.service
sudo systemctl status sessage.service
sudo journalctl -u sessage.service --since today
curl --fail --show-error http://127.0.0.1:8080/healthz
```

Beim ersten Start werden ausstehende Datenbankmigrationen ausgeführt. Bei einem Fehler
beendet sich der Prozess; Ursache und Datenbankmeldung stehen im Journal.

## 6. HTTPS-Reverse-Proxy konfigurieren

Ein minimales Caddy-Beispiel lautet:

```text
aufgaben.example.de {
    reverse_proxy 127.0.0.1:8080
}
```

Caddy übernimmt in dieser Konfiguration Zertifikat und WebSocket-Weiterleitung. Bei nginx,
Apache oder einem Load Balancer müssen Host, Client-IP, Schema und WebSocket-Upgrades
korrekt weitergereicht werden. Tragen Sie nur tatsächlich verwendete Proxyadressen unter
`ForwardedHeaders__KnownProxies` oder `KnownNetworks` ein.

Prüfen Sie anschließend Anmeldung, Anlegen und Speichern einer Liste, Anhänge, generierte
Links und — falls konfiguriert — SMTP und AD/LDAP.

## Backup und Wiederherstellung

Sichern Sie gemeinsam und testen Sie die Wiederherstellung regelmäßig:

- PostgreSQL als konsistentes logisches Backup, beispielsweise mit `pg_dump`,
- `/etc/sessage/community.env`,
- `/var/lib/sessage/app-data`,
- `/var/lib/sessage/uploads`,
- `/var/lib/sessage/profile-pictures`,
- `/var/lib/sessage/.aspnet/DataProtection-Keys`.

Ein reines Kopieren eines aktiven PostgreSQL-Datenverzeichnisses ist kein verlässliches
Backup. Schützen Sie Sicherungen wie Produktionsdaten, da sie Konten, Aufgaben, Anhänge und
Geheimnisse enthalten können.

## Sicher aktualisieren

1. Lesen Sie die Releasehinweise und prüfen Sie Runtime- sowie PostgreSQL-Anforderungen.
2. Erstellen und verifizieren Sie Datenbank- und Dateibackups.
3. Veröffentlichen und übertragen Sie die neue Version in einen **neuen** Releaseordner.
4. Legen Sie darin die drei leeren Mountziele wie bei der Erstinstallation an.
5. Stoppen Sie den Dienst mit `sudo systemctl stop sessage.service`.
6. Schalten Sie `/opt/sessage/current` auf den neuen Releaseordner um.
7. Starten Sie den Dienst und prüfen Sie Journal, `/healthz`, Anmeldung und eine Testliste.
8. Bewahren Sie die vorherige Version bis zum Abschluss der Abnahme auf.

Da der Start Datenbankmigrationen anwenden kann, ist ein Binär-Rollback nicht automatisch
auch ein Datenbank-Rollback. Stellen Sie bei einer inkompatiblen Migration Anwendung,
Datenbank und persistente Dateien gemeinsam aus dem geprüften Backup wieder her.

## Fehlerdiagnose

| Symptom | Prüfung |
| --- | --- |
| Dienst startet nicht | `systemctl status` und `journalctl -u sessage.service` lesen |
| Datenbankfehler | Host, Firewall, TLS, Rolle und Verbindungszeichenfolge prüfen |
| HTTP 400 über Domain | `AllowedHosts` um den öffentlichen Hostnamen ergänzen |
| Links zeigen auf localhost | `Smtp__AppBaseUrl` auf die öffentliche HTTPS-Adresse setzen |
| Proxy-Schema oder Client-IP falsch | Forwarded Headers und konkrete Proxyadresse prüfen |
| Upload nicht möglich | Bind-Mounts und Schreibrechte unter `/var/lib/sessage` prüfen |
| Anmeldung des ersten Admins scheitert | Initialwerte gelten nur bei leerer Datenbank; Journal prüfen |
