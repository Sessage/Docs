# Docker-Konfiguration

Community und Enterprise verwenden dieselbe Grundkonfiguration. Jede Edition besitzt einen eigenen Paketordner:

```text
docker/community/
docker/enterprise/
```

Die `.env`-Datei enthält installationsabhängige Einstellungen und Geheimnisse. Im Enterprise-Paket erzeugen `install.ps1` beziehungsweise `install.sh` sie interaktiv und mit zufälligen Schlüsseln. Für eine manuelle oder Community-Installation wird sie aus `.env.example` kopiert und jeder `CHANGE_ME`-Wert ersetzt. Sie gehört nicht in eine öffentliche Versionsverwaltung und muss zusammen mit den persistenten Daten gesichert werden.

::: tip Einfacher Enterprise-Start
Für eine normale Erstinstallation müssen diese Variablen nicht von Hand gepflegt werden. Verwenden Sie den geführten Installer und ändern Sie `.env` nur für SMTP, LDAP/AD, Push Relay oder besondere Netzwerkanforderungen.
:::

## Datenbankmodus

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `DATABASE_MODE` | `internal` | `internal` startet PostgreSQL als Container. `external` verwendet einen vorhandenen PostgreSQL-Server und startet keinen Datenbank-Container. |
| `DATABASE_HOST` | `postgres` | DNS-Name oder IP des PostgreSQL-Servers. Intern muss der Wert `postgres` bleiben. Für PostgreSQL auf dem Docker-Host kann `host.docker.internal` verwendet werden. |
| `DATABASE_PORT` | `5432` | PostgreSQL-Port. |
| `POSTGRES_DB` | `sessage` | Name der Anwendungsdatenbank. |
| `POSTGRES_USER` | `sessage` | Datenbankbenutzer. Er muss Tabellen und Migrationen im Zielschema anlegen und ändern dürfen. |
| `POSTGRES_PASSWORD` | kein Standard | Datenbankkennwort. In `.env.example` muss jeder `CHANGE_ME`-Wert ersetzt werden. |
| `DATABASE_SSL_MODE` | `Prefer` | Npgsql-SSL-Modus, zum Beispiel `Disable`, `Prefer`, `Require`, `VerifyCA` oder `VerifyFull`. Für entfernte produktive Datenbanken wird mindestens `Require`, besser `VerifyFull`, empfohlen. |
| `DATABASE_TRUST_SERVER_CERTIFICATE` | `false` | `true` überspringt Teile der Zertifikatsprüfung und sollte nur in kontrollierten Testumgebungen verwendet werden. |

Bei `DATABASE_MODE=internal` muss Docker Compose mit dem Profil `internal-db` gestartet werden. Die mitgelieferten Skripte erledigen das automatisch. Bei `DATABASE_MODE=external` lassen sie das Profil weg.

Enterprise speichert die interne Datenbank im Docker-Volume `sessage-enterprise-postgres-data`. Dadurch ist die PostgreSQL-UID nicht von Rechten des Installationsordners abhängig. Community verwendet weiterhin `storage/postgres/` als Bind-Mount. In beiden Editionen ist ein geprüfter logischer Dump die maßgebliche Sicherung; `docker compose down -v` darf bei Enterprise niemals verwendet werden.

Die Editionspakete definieren für die Anwendung einen Healthcheck gegen `/healthz`. Die
Update-Skripte verwenden `docker compose up --wait` und liefern erst dann Erfolg zurück, wenn
der neue App-Container gestartet ist und diesen Check bestanden hat. Bei einem Fehler werden
der vollständige Containerstatus sowie die letzten PostgreSQL- und App-Logs ausgegeben.

::: warning Sonderzeichen im Datenbankkennwort
Die Anwendung erhält eine PostgreSQL-Verbindungszeichenfolge. Verwenden Sie für `POSTGRES_PASSWORD` ein langes, zufälliges Kennwort ohne Semikolon. Ein Base64-generierter Wert ist geeignet. Ein Semikolon würde die Verbindungszeichenfolge in weitere Felder aufteilen.
:::

## Anwendung und Netzwerk

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `SESSAGE_IMAGE` | editionsabhängig | Lokaler Name und Tag des gebauten Images, zum Beispiel `sessage-community:1.2.0`. |
| `SESSAGE_BIND_ADDRESS` | `0.0.0.0` | Hostadresse, auf der Docker den HTTP-Port veröffentlicht. Mit `127.0.0.1` ist Sessage nur lokal beziehungsweise über einen lokalen Reverse Proxy erreichbar. |
| `SESSAGE_HTTP_PORT` | `8080` | Von außen erreichbarer HTTP-Port auf dem Docker-Host. Er kann beispielsweise auf `8088` geändert werden. |
| `SESSAGE_CONTAINER_PORT` | `8080` | Interner Port, auf dem ASP.NET Core im Container lauscht. Compose, Dockerfile und Portweiterleitung verwenden gemeinsam diesen Wert. Normalerweise muss nur der Host-Port geändert werden. |
| `ALLOWED_HOSTS` | `localhost` | Zulässige Hostnamen für ASP.NET Core. `localhost` für den Container-Healthcheck beibehalten und produktive Domains mit Semikolon ergänzen. |
| `APP_BASE_URL` | `http://localhost:8080` | Öffentliche Basisadresse für Einladungs- und Freigabelinks, beispielsweise `https://aufgaben.example.de`. |

Produktiv sollte TLS an einem Reverse Proxy terminiert werden. Setzen Sie `SESSAGE_BIND_ADDRESS=127.0.0.1`, wenn ausschließlich ein Reverse Proxy auf demselben Host auf Sessage zugreift.

Beispiel mit äußerem Port `9080` und unverändertem Container-Port:

```dotenv
SESSAGE_BIND_ADDRESS=0.0.0.0
SESSAGE_HTTP_PORT=9080
SESSAGE_CONTAINER_PORT=8080
APP_BASE_URL=http://server.example.de:9080
```

Beispiel, bei dem auch ASP.NET Core intern auf `9090` lauscht:

```dotenv
SESSAGE_HTTP_PORT=9080
SESSAGE_CONTAINER_PORT=9090
```

Der Host- und Container-Port dürfen gleich sein, müssen es aber nicht. Wenn `SESSAGE_HTTP_PORT` geändert wird und die Anwendung direkt ohne Reverse Proxy erreichbar ist, muss der Port auch in `APP_BASE_URL` angepasst werden.

## Initialer Administrator und API-Sicherheit

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `INITIAL_ADMIN_EMAIL` | kein sicherer Produktionsstandard | E-Mail-Adresse des Administrators, der bei einer leeren Datenbank angelegt wird. |
| `INITIAL_ADMIN_PASSWORD` | kein Standard | Mindestens 12 Zeichen sowie jeweils Großbuchstabe, Kleinbuchstabe, Ziffer und Sonderzeichen. Das Update-Skript lehnt `CHANGE_ME` ab. |
| `JWT_KEY` | kein Standard | Signaturschlüssel für mobile/API-Tokens, mindestens 32 zufällige Bytes. Änderungen melden mobile Clients ab. |
| `JWT_ISSUER` | `Sessage.Server` | Aussteller der JWTs. |
| `JWT_AUDIENCE` | `Sessage.App` | Zielgruppe der JWTs. |
| `JWT_EXPIRES_MINUTES` | `10080` | Gültigkeit eines Mobile-/API-JWTs in Minuten; der Standard entspricht sieben Tagen. |
| `PERSONAL_ACCESS_TOKEN_LIFETIME_DAYS` | `90` | Gültigkeit neu erstellter Personal Access Tokens; zulässig sind 1 bis 365 Tage. |
| `ALLOW_REGISTRATION` | `false` | Erlaubt oder verbietet die Selbstregistrierung. |

`INITIAL_ADMIN_PASSWORD` wird nur zum Erstellen des noch nicht vorhandenen initialen Kontos benötigt. Es ändert nicht automatisch das Kennwort eines bestehenden Administrators. Entfernen Sie die Variable nicht unüberlegt aus einer verwalteten Konfiguration, dokumentieren Sie aber den geregelten Kennwortwechsel.

Die geführten Enterprise-Installer prüfen diese Regeln vor dem Start. Automatisch erzeugte Kennwörter erfüllen sie garantiert. Bei einer manuellen `.env`-Konfiguration muss das Kennwort ebenfalls alle Regeln erfüllen; andernfalls kann das initiale Administratorkonto nicht angelegt werden.

## SMTP

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `SMTP_HOST` | leer | SMTP-Server. Ohne Host können keine Einladungs- und Benachrichtigungs-E-Mails versendet werden. |
| `SMTP_PORT` | `587` | SMTP-Port. |
| `SMTP_USE_SSL` | `true` | Aktiviert die vom Sessage-SMTP-Dienst verwendete TLS-Option. |
| `SMTP_USER` | leer | SMTP-Benutzer. |
| `SMTP_PASSWORD` | leer | SMTP-Kennwort. |
| `SMTP_FROM_ADDRESS` | leer | Absenderadresse. |
| `SMTP_FROM_NAME` | `Sessage` | Anzeigename des Absenders. |
| `EMAIL_IMPORT_INTERVAL_MINUTES` | `15` | Nur Enterprise: Abrufintervall des E-Mail-Imports. |
| `AUTOMATION_PLUGINS_ENABLED` | `true` | Nur Enterprise: Laden kundeneigener Automatisierungsplugins aktivieren. |
| `AUTOMATION_PLUGIN_TIMEOUT_SECONDS` | `30` | Nur Enterprise: maximales Zeitfenster einer Plugin-Aktion (1–300 Sekunden). |

Testen Sie nach der Einrichtung sowohl den Versand als auch Fehlerfälle. `APP_BASE_URL` muss auf die extern erreichbare Adresse zeigen. Sie wird auch für Bestätigungs- und Passwort-Reset-Links verwendet und darf deshalb nicht aus Request- oder Forwarded-Host-Headern abgeleitet werden. Bei aktiviertem SMTP oder aktivierter Selbstregistrierung verweigert eine Production-Instanz den Start, wenn keine gültige `APP_BASE_URL` gesetzt ist.

Das Enterprise-Compose bindet `storage/plugins/` als `/app/plugins` ein. Plugins werden nur beim
Anwendungsstart eingelesen; nach Änderungen ist der App-Container neu zu starten.

## Reverse Proxy und Mobile-Kompatibilität

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `FORWARDED_HEADERS_TRUST_ALL_PROXIES` | `false` | Vertraut weitergeleiteten Headern von jedem Proxy. Nur aktivieren, wenn die App ausschließlich über einen kontrollierten Proxy erreichbar ist. |
| `FORWARDED_HEADERS_KNOWN_PROXY` | leer | Einzelne vertrauenswürdige Proxy-IP, zum Beispiel `127.0.0.1`. Bevorzugt gegenüber `TRUST_ALL_PROXIES`. |
| `FORWARDED_HEADERS_KNOWN_NETWORK` | leer | Vertrauenswürdiges Proxy-Netz in CIDR-Schreibweise, zum Beispiel `10.20.0.0/16`. |
| `CLIENT_LATEST_VERSION` | `1.0.0` | Aktuell empfohlene Mobile-Version. |
| `CLIENT_MIN_SUPPORTED_VERSION` | `1.0.0` | Älteste noch zugelassene Mobile-Version. |
| `CLIENT_UPDATE_URL` | leer | Download- oder Store-Adresse für ein Client-Update. |

Ohne Reverse Proxy bleibt `FORWARDED_HEADERS_TRUST_ALL_PROXIES=false`; `KNOWN_PROXY` und `KNOWN_NETWORK` bleiben leer. Die Anwendung startet normal und verwendet die direkte Remote-IP sowie Scheme und Host der Verbindung. Eingehende `X-Forwarded-*`-Header werden in diesem Modus nicht als vertrauenswürdige Verbindungsdaten übernommen.

Hinter einem Reverse Proxy sollte dessen konkrete IP oder Netzadresse eingetragen werden. `TRUST_ALL_PROXIES=true` ist nur für einen abgeschotteten Netzwerkpfad vorgesehen, auf dem die Anwendung nicht direkt erreichbar ist.

## Enterprise Push Relay

Diese Variablen existieren im Enterprise-Paket. Sie werden nur verwendet, wenn die Lizenz `enterprise.push-notifications` freischaltet.

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `PUSH_RELAY_ENDPOINT` | `https://push.sessage.com` | Feste HTTPS-Basisadresse des zentralen Sessage Push Relay. |
| `PUSH_RELAY_TENANT_ID` | leer | Der Kundeninstallation zugewiesene Relay-Mandant. |
| `PUSH_RELAY_API_KEY` | leer | Geheimer, installationsbezogener Relay-Schlüssel. Nur in `.env` beziehungsweise einem Secret Store ablegen. |
| `PUSH_RELAY_TIMEOUT_SECONDS` | `10` | Zeitlimit pro Relay-Aufruf; zulässig sind intern 2 bis 60 Sekunden. |

Alle vier Werte werden in ASP.NET Core unter `PushRelay__...` abgebildet. Fehlen Mandant oder Schlüssel, meldet `GET /api/enterprise/push/status` Push als nicht konfiguriert. Der Server behandelt eine vorübergehende Relay-Störung als Best-Effort-Fehler: Der lokale In-App-Eintrag bleibt erhalten, die fachliche Änderung wird nicht zurückgerollt.

Erlauben Sie dem App-Container ausschließlich ausgehendes TCP/443 zu `push.sessage.com`. Die Mobile-Geräte kommunizieren für Registrierung und Einstellungen mit ihrer lokalen Sessage-Installation; native Zustellung erfolgt anschließend über APNs, Firebase Cloud Messaging beziehungsweise WNS.

## Active Directory und LDAP

AD/LDAP-Anmeldung ist in Community und Enterprise verfügbar. Die Auswahl von Verzeichnisbenutzern und -gruppen in Freigabedialogen ist eine Enterprise-Funktion.

Die vollständige Einrichtung mit sicheren AD-, LDAPS-, StartTLS- und OpenLDAP-Beispielen, Neustartbefehlen und Fehlerbehebung steht auf der eigenen Seite [AD-Anbindung](./ad-anbindung.md). Die folgende Tabelle dient als technische Variablenreferenz.

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `AD_ENABLED` | `false` | Aktiviert die AD/LDAP-Anmeldung. |
| `AD_PROVIDER` | `ActiveDirectory` | `ActiveDirectory` für AD-kompatible Standardwerte oder `Ldap` für generisches LDAP. |
| `AD_SERVER` | leer | Hostname eines Domain Controllers oder LDAP-Servers. |
| `AD_PORT` | `389` | LDAP-Port; LDAPS verwendet häufig `636`. |
| `AD_USE_SSL` | `false` | Verwendet LDAPS. Nicht gleichzeitig mit StartTLS aktivieren. |
| `AD_USE_STARTTLS` | `false` | Wertet eine LDAP-Verbindung mit StartTLS auf. |
| `AD_PINNED_CERTIFICATE_SHA256` | leer | Optionaler SHA-256-Fingerabdruck des erwarteten Serverzertifikats als 64 Hex-Zeichen; nur mit LDAPS oder StartTLS. |
| `AD_BIND_USER` | leer | Technisches Konto für Verzeichnissuchen; leer erlaubt einen anonymen Search-Bind, sofern der Server ihn zulässt. |
| `AD_BIND_PASSWORD` | leer | Kennwort des technischen Kontos. |
| `AD_BASE_DN` | leer | Suchbasis, zum Beispiel `DC=example,DC=local`. |
| `AD_REQUIRED_GROUP_CN` | leer | Optional erforderliche AD-Gruppe für die Anmeldung. |
| `AD_REQUIRED_GROUP_DN` | leer | Optionaler vollständiger DN einer erforderlichen Gruppe; hat Vorrang vor der CN-Prüfung. |
| `AD_USER_NAME_ATTRIBUTE` | Provider-Standard | Anmeldeattribut; `sAMAccountName` bei AD, `uid` bei LDAP. |
| `AD_ADDITIONAL_USER_NAME_ATTRIBUTES` | Provider-Standard | Kommagetrennte alternative Anmeldeattribute; bei AD standardmäßig `userPrincipalName`. |
| `AD_EMAIL_ATTRIBUTE` | `mail` | Attribut für die lokale E-Mail-/Kontozuordnung. |
| `AD_DISPLAY_NAME_ATTRIBUTE` | Provider-Standard | `displayName` bei AD, `cn` bei LDAP. |
| `AD_IDENTITY_ATTRIBUTE` | Provider-Standard | Lesbare stabile Kennung; bei AD standardmäßig `userPrincipalName`. |
| `AD_USER_OBJECT_CLASS` | Provider-Standard | `user` bei AD, `inetOrgPerson` bei LDAP. |
| `AD_GROUP_OBJECT_CLASS` | Provider-Standard | `group` bei AD, `groupOfNames` bei LDAP. Für POSIX meist `posixGroup`. |
| `AD_GROUP_NAME_ATTRIBUTE` | `cn` | Attribut für Gruppennamen. |
| `AD_GROUP_MEMBERSHIP_ATTRIBUTE` | `memberOf` | Attribut am Benutzer mit direkten Gruppen-DNs. |
| `AD_USER_SEARCH_FILTER` | automatisch | Optionaler eigener Filter mit dem Pflichtplatzhalter `{username}`. |
| `AD_GROUP_SEARCH_BASE_DN` | `AD_BASE_DN` | Optional abweichende Suchbasis für Gruppen. |
| `AD_GROUP_MEMBERSHIP_SEARCH_FILTER` | Provider-Standard | Optionaler Gruppenfilter mit `{userDn}` oder `{username}`. |
| `AD_FALLBACK_EMAIL_DOMAIN` | leer | Erzeugt bei fehlendem E-Mail-Attribut `benutzer@domain`; für LDAP explizit erforderlich. |
| `AD_TIMEOUT_SECONDS` | `15` | Netzwerk-Timeout einer LDAP-Anfrage. |
| `AD_ENABLE_AUTO_FALLBACK` | `false` | Probiert weitere LDAP-/TLS-Transportarten. Kann auf unverschlüsseltes LDAP zurückfallen und sollte in Produktion deaktiviert bleiben. |

Verwenden Sie in Produktion LDAPS oder StartTLS und ein technisches Konto mit minimalen Leserechten. `AD_USE_SSL` und `AD_USE_STARTTLS` dürfen nicht gleichzeitig aktiv sein. Der Abschnitt heißt aus Gründen der Rückwärtskompatibilität weiterhin `ActiveDirectory`; alle neuen Optionen funktionieren ebenso mit generischem LDAP.

Für private oder selbstsignierte Zertifikate kann statt einer systemweiten Vertrauensänderung ein Zertifikat-Pin gesetzt werden. Entfernen Sie Doppelpunkte aus dem SHA-256-Fingerabdruck und tragen Sie genau 64 Hex-Zeichen in `AD_PINNED_CERTIFICATE_SHA256` ein. Sessage akzeptiert die Verbindung dann nur, wenn das präsentierte Zertifikat exakt übereinstimmt. Planen Sie Zertifikatswechsel zusammen mit der Konfigurationsänderung; ein abweichender Pin wird abgewiesen und mit dem tatsächlich präsentierten öffentlichen Fingerabdruck protokolliert.

### Beispiele

Für klassisches Active Directory genügen die bisherigen Einstellungen. Ohne explizite Attribute sucht Sessage nach `sAMAccountName` oder `userPrincipalName`, liest `mail` und `displayName` und ermittelt verschachtelte Gruppen über die AD Matching Rule.

Ein typisches OpenLDAP mit `inetOrgPerson`, `uid` und `groupOfNames` kann so konfiguriert werden:

```dotenv
AD_ENABLED=true
AD_PROVIDER=Ldap
AD_SERVER=ldap.example.org
AD_PORT=636
AD_USE_SSL=true
AD_BIND_USER=cn=sessage,ou=services,dc=example,dc=org
AD_BIND_PASSWORD=CHANGE_ME
AD_BASE_DN=dc=example,dc=org
AD_USER_NAME_ATTRIBUTE=uid
AD_EMAIL_ATTRIBUTE=mail
AD_DISPLAY_NAME_ATTRIBUTE=cn
AD_USER_OBJECT_CLASS=inetOrgPerson
AD_GROUP_OBJECT_CLASS=groupOfNames
AD_GROUP_MEMBERSHIP_SEARCH_FILTER=(&(objectClass=groupOfNames)(member={userDn}))
```

Für POSIX-Gruppen werden typischerweise diese beiden Werte geändert:

```dotenv
AD_GROUP_OBJECT_CLASS=posixGroup
AD_GROUP_MEMBERSHIP_SEARCH_FILTER=(&(objectClass=posixGroup)(memberUid={username}))
```

Alle Platzhalterwerte werden vor dem Einsetzen als LDAP-Filterwerte escaped. Ein eigener `AD_USER_SEARCH_FILTER`, etwa `(&(objectClass=person)(uid={username}))`, muss `{username}` enthalten. Liefert die Benutzersuche mehr als einen Eintrag, wird die Anmeldung abgewiesen. Für generisches LDAP muss das konfigurierte E-Mail-Attribut einen Wert liefern; alternativ ist `AD_FALLBACK_EMAIL_DOMAIN` zu setzen.

### Automatisierte OpenLDAP-Tests

Das Repository enthält im Projekt `TodoSuite.Ldap.IntegrationTests` Ende-zu-Ende-Tests gegen ein echtes, kurzlebiges OpenLDAP. Die Suite startet ein digest-gepinntes Testimage auf einem zufälligen lokalen Port, spielt eigene Benutzer und `groupOfNames`-Gruppen ein und entfernt den Container anschließend wieder.

```powershell
$env:RUN_LDAP_INTEGRATION_TESTS='1'
dotnet test .\TodoSuite.Ldap.IntegrationTests\TodoSuite.Ldap.IntegrationTests.csproj
```

Abgedeckt sind Anmeldung über `uid` und ein alternatives `cn`, echte Passwort-Binds, fehlerhafte Kennwörter, LDAP-Filter-Injection, erforderliche Gruppen, Enterprise-Verzeichnissuche, Benutzer- und Gruppenfreigaben für Listen und Portfolios, Rollenänderungen sowie der automatische Rechteentzug nach Entfernung einer LDAP-Gruppenmitgliedschaft. Ohne die Umgebungsvariable wird die Docker-Suite übersprungen, sodass normale Builds keine lokale Docker-Installation voraussetzen. In GitHub Actions läuft sie bei relevanten Änderungen automatisch.

Zusätzlich enthält `SambaActiveDirectoryEndToEndTests` einen opt-in Test gegen einen vorhandenen Samba-AD-Container. Er prüft einen echten StartTLS-/LDAPS-Bind, optionales Zertifikat-Pinning, eine erfolgreiche Anmeldung und die Ablehnung eines falschen Kennworts. Die Zugangsdaten werden ausschließlich über `SAMBA_AD_*`-Umgebungsvariablen übergeben.

## Enterprise-Lizenzdateien

Die Pfade werden im Enterprise-Compose-Paket fest auf das persistente Verzeichnis `/app/App_Data` abgebildet:

```text
storage/app-data/installation.id
storage/app-data/todosuite.license.json
storage/app-data/license-signing-public.pem
```

`installation.id` darf bei Updates nicht ersetzt werden. Der private Signaturschlüssel gehört niemals in diese Installation.

## Geheimnisse erzeugen

Beispiele in PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(36))
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

Verwenden Sie getrennte Werte für Datenbank, Administrator und JWT. Die `.env` sollte nur für den Betriebsbenutzer lesbar sein.

## Effektive Konfiguration prüfen

Interne Datenbank:

```powershell
docker compose --env-file .env -f compose.yml --profile internal-db config
```

Externe Datenbank:

```powershell
docker compose --env-file .env -f compose.yml config
```

Die Ausgabe enthält aufgelöste Geheimnisse. Speichern oder versenden Sie sie nicht. Prüfen Sie anschließend die laufenden Dienste mit `docker compose ... ps` und die App-Logs mit `docker compose ... logs --tail 200 app`.
