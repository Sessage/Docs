# AD-Anbindung

Sessage kann Benutzer gegen Microsoft Active Directory oder ein generisches LDAP-Verzeichnis authentifizieren. Die AD-/LDAP-Anmeldung ist in Community und Enterprise enthalten. Enterprise ergänzt Verzeichnisfreigaben, mit denen einzelne Verzeichnisbenutzer oder ganze Gruppen direkt für Listen und Portfolios berechtigt werden können.

Bei der ersten erfolgreichen Verzeichnisanmeldung legt Sessage automatisch ein lokales Benutzerkonto an und synchronisiert die Verzeichnisidentität sowie Gruppenmitgliedschaften. Das AD-Kennwort wird nicht in Sessage gespeichert.

## Voraussetzungen

Vor der Konfiguration müssen folgende Angaben verfügbar sein:

- DNS-Name eines Domain Controllers oder LDAP-Servers, der aus dem App-Container erreichbar ist;
- LDAPS auf Port 636 oder StartTLS auf Port 389;
- Basis-DN für die Benutzersuche, beispielsweise `DC=example,DC=local`;
- technisches Suchkonto mit möglichst geringen Leserechten;
- optional eine Gruppe, deren Mitglieder Sessage verwenden dürfen;
- ein nutzbares E-Mail-Attribut wie `mail` oder eine konfigurierte Fallback-Domain.

::: warning Verschlüsselung ist für den Produktivbetrieb erforderlich
Verwenden Sie LDAPS oder StartTLS. Aktivieren Sie nicht beide Verfahren gleichzeitig. `AD_ENABLE_AUTO_FALLBACK` bleibt in Produktion `false`, damit ein Verbindungsproblem nicht zu einem unverschlüsselten LDAP-Fallback führt.
:::

## Docker-Konfiguration öffnen

Die Einstellungen stehen auf dem Docker-Server in `.env`:

```bash
cd /var/www/sessage
sudo nano .env
```

Die Datei enthält Kennwörter und andere Geheimnisse. Sie darf nicht veröffentlicht oder ungeschützt kopiert werden. Auch `docker compose config` gibt aufgelöste Geheimnisse aus und gehört nicht in Supporttickets oder Protokolle.

## Lokale Selbstregistrierung festlegen

Mit `ALLOW_REGISTRATION` wird gesteuert, ob Benutzer selbst lokale Sessage-Konten anlegen dürfen:

```dotenv
ALLOW_REGISTRATION=false
```

Für Installationen mit AD-Anmeldung wird `false` empfohlen. AD-Benutzer können sich trotzdem anmelden und werden nach erfolgreicher Verzeichnisprüfung automatisch lokal angelegt. Bereits vorhandene lokale Konten bleiben unverändert.

Soll zusätzlich eine lokale Selbstregistrierung angeboten werden, setzen Sie:

```dotenv
ALLOW_REGISTRATION=true
```

## Microsoft Active Directory mit LDAPS

Ein typisches AD-Beispiel:

```dotenv
AD_ENABLED=true
AD_PROVIDER=ActiveDirectory

AD_SERVER=dc01.example.local
AD_PORT=636
AD_USE_SSL=true
AD_USE_STARTTLS=false

AD_BIND_USER=svc-sessage@example.local
AD_BIND_PASSWORD=<kennwort-des-dienstkontos>
AD_BASE_DN=DC=example,DC=local

# Optional: Anmeldung auf diese Gruppe beschränken
AD_REQUIRED_GROUP_DN=CN=Sessage-Users,OU=Groups,DC=example,DC=local
AD_REQUIRED_GROUP_CN=

# Sichere Standardwerte beibehalten
AD_TIMEOUT_SECONDS=15
AD_ENABLE_AUTO_FALLBACK=false
```

Das technische Konto kann je nach AD auch als vollständiger DN oder im Format `DOMAIN\benutzer` angegeben werden. Es benötigt nur Leserechte für die konfigurierten Benutzer-, Attribut- und Gruppenbereiche.

Ohne weitere Attributangaben sucht Sessage bei Active Directory nach `sAMAccountName` und `userPrincipalName`, liest `mail` und `displayName` und ermittelt verschachtelte Gruppen über die rekursive AD Matching Rule.

## Microsoft Active Directory mit StartTLS

Für StartTLS werden ausschließlich die Transportwerte geändert:

```dotenv
AD_PORT=389
AD_USE_SSL=false
AD_USE_STARTTLS=true
```

Ein Domain Controller muss StartTLS auf diesem Port tatsächlich anbieten. Ein normaler unverschlüsselter LDAP-Bind auf Port 389 ist kein Ersatz für StartTLS.

## Zertifikat prüfen oder anheften

Das Zertifikat des LDAP-Servers sollte von einer im Container vertrauenswürdigen Zertifizierungsstelle stammen. Bei einer privaten oder selbstsignierten Infrastruktur kann stattdessen der erwartete SHA-256-Fingerabdruck eingetragen werden:

```dotenv
AD_PINNED_CERTIFICATE_SHA256=<64-HEX-ZEICHEN-OHNE-DOPPELPUNKTE>
```

Der Pin funktioniert nur zusammen mit LDAPS oder StartTLS. Planen Sie Zertifikatswechsel gemeinsam mit einer Aktualisierung des Pins; ein abweichendes Zertifikat wird abgewiesen.

## Anmeldung auf eine Gruppe beschränken

Die robusteste Einstellung ist der vollständige Gruppen-DN:

```dotenv
AD_REQUIRED_GROUP_DN=CN=Sessage-Users,OU=Groups,DC=example,DC=local
AD_REQUIRED_GROUP_CN=
```

Alternativ kann nur der CN verwendet werden:

```dotenv
AD_REQUIRED_GROUP_DN=
AD_REQUIRED_GROUP_CN=Sessage-Users
```

`AD_REQUIRED_GROUP_DN` hat Vorrang und vermeidet Mehrdeutigkeiten bei gleichnamigen Gruppen in verschiedenen Organisationseinheiten.

## Generisches LDAP oder OpenLDAP

Für ein typisches OpenLDAP mit `inetOrgPerson`, `uid` und `groupOfNames`:

```dotenv
AD_ENABLED=true
AD_PROVIDER=Ldap
AD_SERVER=ldap.example.org
AD_PORT=636
AD_USE_SSL=true
AD_USE_STARTTLS=false
AD_BIND_USER=cn=sessage,ou=services,dc=example,dc=org
AD_BIND_PASSWORD=<kennwort-des-dienstkontos>
AD_BASE_DN=dc=example,dc=org
AD_USER_NAME_ATTRIBUTE=uid
AD_EMAIL_ATTRIBUTE=mail
AD_DISPLAY_NAME_ATTRIBUTE=cn
AD_USER_OBJECT_CLASS=inetOrgPerson
AD_GROUP_OBJECT_CLASS=groupOfNames
AD_GROUP_MEMBERSHIP_SEARCH_FILTER=(&(objectClass=groupOfNames)(member={userDn}))
AD_ENABLE_AUTO_FALLBACK=false
```

Für POSIX-Gruppen sind häufig folgende Werte passend:

```dotenv
AD_GROUP_OBJECT_CLASS=posixGroup
AD_GROUP_MEMBERSHIP_SEARCH_FILTER=(&(objectClass=posixGroup)(memberUid={username}))
```

Falls das Verzeichnis kein E-Mail-Attribut liefert, muss für LDAP eine Fallback-Domain gesetzt werden:

```dotenv
AD_FALLBACK_EMAIL_DOMAIN=example.org
```

## Änderungen anwenden

Eine Änderung an `.env` wird nicht durch einen einfachen Containerneustart übernommen. Der App-Container muss neu erstellt werden. Bei interner Datenbank:

```bash
cd /var/www/sessage
docker compose --env-file .env -f compose.yml \
  --profile internal-db up -d \
  --no-deps --force-recreate \
  --wait --wait-timeout 180 app
```

Bei einer externen Datenbank entfällt `--profile internal-db`:

```bash
docker compose --env-file .env -f compose.yml \
  up -d --no-deps --force-recreate \
  --wait --wait-timeout 180 app
```

Alternativ führt `./update.sh` zusätzlich Image-Build, Datenbankprüfung und bei interner Datenbank ein Backup aus.

## Verbindung und Anmeldung testen

Zuerst muss der Servername im App-Container auflösbar sein:

```bash
docker compose --env-file .env -f compose.yml \
  --profile internal-db exec app getent hosts dc01.example.local
```

Anschließend die App-Logs während eines Anmeldeversuchs beobachten:

```bash
docker compose --env-file .env -f compose.yml \
  --profile internal-db logs --tail 200 --follow app
```

Bei Active Directory können Benutzer sich standardmäßig beispielsweise so anmelden:

```text
max.mustermann
max.mustermann@example.local
```

Nach erfolgreicher Anmeldung erscheint der Benutzer in der lokalen Benutzerverwaltung. Das lokale Konto dient Rollen, Einstellungen und Berechtigungen; die Kennwortprüfung bleibt beim Verzeichnis.

## Wichtige Variablen

| Variable | Bedeutung |
| --- | --- |
| `AD_ENABLED` | Aktiviert die AD-/LDAP-Anmeldung. |
| `AD_PROVIDER` | `ActiveDirectory` oder `Ldap`. |
| `AD_SERVER`, `AD_PORT` | Aus dem App-Container erreichbarer Verzeichnisserver. |
| `AD_USE_SSL` | Aktiviert LDAPS. |
| `AD_USE_STARTTLS` | Aktiviert StartTLS. |
| `AD_PINNED_CERTIFICATE_SHA256` | Optionaler SHA-256-Zertifikat-Pin. |
| `AD_BIND_USER`, `AD_BIND_PASSWORD` | Technisches Konto für die Verzeichnissuche. |
| `AD_BASE_DN` | Suchbasis für Benutzer. |
| `AD_REQUIRED_GROUP_DN` | Optionaler vollständiger DN der zugelassenen Gruppe. |
| `AD_REQUIRED_GROUP_CN` | Alternative Gruppenbeschränkung über den CN. |
| `AD_USER_NAME_ATTRIBUTE` | Primäres Anmeldeattribut; AD-Standard `sAMAccountName`, LDAP-Standard `uid`. |
| `AD_ADDITIONAL_USER_NAME_ATTRIBUTES` | Kommagetrennte zusätzliche Anmeldeattribute; AD-Standard `userPrincipalName`. |
| `AD_EMAIL_ATTRIBUTE` | Attribut für die lokale E-Mail-Zuordnung; Standard `mail`. |
| `AD_DISPLAY_NAME_ATTRIBUTE` | AD-Standard `displayName`, LDAP-Standard `cn`. |
| `AD_USER_SEARCH_FILTER` | Optionaler Filter mit dem Pflichtplatzhalter `{username}`. |
| `AD_GROUP_SEARCH_BASE_DN` | Optional abweichende Suchbasis für Gruppen. |
| `AD_GROUP_MEMBERSHIP_SEARCH_FILTER` | Gruppenfilter mit `{userDn}` oder `{username}`. |
| `AD_FALLBACK_EMAIL_DOMAIN` | Ersatzdomain, wenn kein E-Mail-Attribut vorhanden ist. |
| `AD_TIMEOUT_SECONDS` | Timeout pro LDAP-Anfrage; Standard 15 Sekunden. |
| `AD_ENABLE_AUTO_FALLBACK` | Transport-Fallback; produktiv deaktiviert lassen. |

Die vollständige technische Variablenreferenz steht unter [Docker-Konfiguration](./docker-konfiguration.md#active-directory-und-ldap).

## Häufige Fehler

| Fehlerbild | Prüfung |
| --- | --- |
| AD-Anmeldung wird nicht angezeigt | `AD_ENABLED=true` setzen und App-Container neu erstellen. |
| Servername nicht gefunden | DNS-Auflösung im App-Container mit `getent hosts` prüfen. |
| Verbindung abgelehnt oder Timeout | Firewall, Port, LDAPS/StartTLS und `AD_TIMEOUT_SECONDS` prüfen. |
| Bind des technischen Kontos schlägt fehl | Benutzerformat, Kennwort und Leserechte prüfen. |
| Benutzer wird nicht gefunden | `AD_BASE_DN`, Anmeldeattribute und optionalen Suchfilter prüfen. |
| Benutzer besitzt keine E-Mail-Adresse | `AD_EMAIL_ATTRIBUTE` oder `AD_FALLBACK_EMAIL_DOMAIN` konfigurieren. |
| Benutzer ist angeblich nicht in der Gruppe | vollständigen `AD_REQUIRED_GROUP_DN` und Gruppenverschachtelung prüfen. |
| Zertifikat wird abgewiesen | Vertrauenskette, Servernamen und optionalen SHA-256-Pin prüfen. |
| Änderungen wirken nicht | App mit `--force-recreate` neu erstellen; `restart` genügt nicht. |

Für Enterprise-Verzeichnisberechtigungen siehe [AD-Verzeichnisfreigaben](./enterprise/verzeichnisfreigaben.md).
