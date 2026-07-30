# Installation und Inbetriebnahme

Sessage besitzt zwei Serverprodukte mit demselben Community-Kern. Verwenden Sie die zur gewünschten Edition passende Anleitung:

- [Community installieren](./community/installation.md)
- [Enterprise installieren und lizenzieren](./enterprise/installation.md)

## Gemeinsame Voraussetzungen

- Docker Compose 2.20 oder neuer für die empfohlenen Installationspakete
- PostgreSQL 18 im mitgelieferten Container oder ein erreichbarer externer PostgreSQL-Server
- ein freier Host-Port; `8080` ist nur der vollständig änderbare Standard
- sichere Produktions-Secrets
- optional SMTP und Active Directory/LDAP

## Empfohlene Docker-Pakete

| Edition | Paketordner | Anwendung |
|---|---|---|
| Community | `docker/community` | `TodoSuite.Community.dll` |
| Enterprise | `docker/enterprise` | `TodoSuite.Enterprise.Server.dll` |

Jeder Ordner enthält Dockerfile, Compose-Datei, `.env.example`, Update-Skripte und persistente Speicherpfade. Die Anwendung wird aus den bereits veröffentlichten Dateien unter `publish/` gebaut.

Mit `DATABASE_MODE=internal` startet das Paket PostgreSQL selbst. Mit `DATABASE_MODE=external` verbindet sich nur der App-Container mit einer vorhandenen Datenbank. Details und sämtliche Variablen stehen unter [Docker-Konfiguration](./docker-konfiguration.md).

## Datenbank

Beim ersten Start:

1. wird die PostgreSQL-Verbindung geöffnet,
2. werden ausstehende Migrationen angewendet,
3. wird die Rolle `Admin` bei Bedarf angelegt und
4. wird der initiale Admin erstellt, sofern noch kein entsprechendes Konto existiert.

Vor Updates muss ein Datenbankbackup erstellt und wiederherstellbar geprüft werden. Das interne Update-Skript erzeugt für die Container-Datenbank zusätzlich ein logisches Backup. Externe Datenbanken werden durch deren Betreiber gesichert. Enterprise benötigt außerdem `storage/app-data/` mit Installation-ID und Lizenz.

## Reverse Proxy und HTTPS

Produktive Installationen sollten nach Möglichkeit hinter einem vertrauenswürdigen Reverse Proxy mit HTTPS betrieben werden. Der direkte Betrieb bleibt unterstützt. Ohne Reverse Proxy wird `ForwardedHeaders__TrustAllProxies=false` verwendet; die Anwendung ignoriert dann nicht vertrauenswürdige `X-Forwarded-*`-Angaben und startet ohne Proxy-Konfiguration.

Für den Proxybetrieb konfigurieren Sie:

- `Smtp__AppBaseUrl` mit der öffentlichen HTTPS-URL,
- `AllowedHosts`,
- vertrauenswürdige Forwarded-Header-Proxys oder Netze,
- TLS-Zertifikate am Reverse Proxy.

Aktivieren Sie `ForwardedHeaders__TrustAllProxies` nur in einem vollständig kontrollierten Netzwerk. Bevorzugen Sie konkrete Einträge unter `ForwardedHeaders__KnownProxies` oder `ForwardedHeaders__KnownNetworks`.

## SMTP

SMTP wird für Einladungen, Kontomails und E-Mail-Benachrichtigungen benötigt:

- `Smtp__Host`
- `Smtp__Port`
- `Smtp__UseSsl`
- `Smtp__User`
- `Smtp__Password`
- `Smtp__FromAddress`
- `Smtp__FromName`
- `Smtp__AppBaseUrl`

Der Enterprise-E-Mail-Import verwendet eine davon getrennte IMAP-Konfiguration pro Liste.

## Betriebsprüfung

Prüfen Sie nach Installation oder Update:

1. Anmeldung und Admin-Konto,
2. Anlegen, Öffnen und Speichern einer Testliste,
3. Datenbankmigrationen und Serverlogs,
4. SMTP über eine kontrollierte Einladung,
5. `GET /api/capabilities` mit einem authentifizierten Client,
6. bei Enterprise zusätzlich Lizenzstatus und Enterprise-Capabilities.
