# Konto und Administration

## Profil

Im Profil können Sie persönliche Angaben und das Profilbild verwalten. Profilbilder können hochgeladen, zugeschnitten und gelöscht werden.

## Konto

Im Kontobereich können je nach Einrichtung Passwort, E-Mail-Adresse und Sicherheitsoptionen verwaltet werden. E-Mail-Adressen sind eindeutig und können verifiziert werden.

Klicken Sie unten links auf Ihren Avatar, um Konto, Profilbild, API-Zugriffstoken und – mit entsprechender Rolle – den Adminbereich zu öffnen.

![Geöffnetes Kontomenü mit Konto, Profilbild, API-Zugriffstoken und Adminbereich](/images/community/konto-menue.png)

## Personal Access Tokens

Personal Access Tokens ermöglichen API-Zugriff ohne interaktives Browser-Login. Sie sind für Integrationen und Automatisierungen gedacht.

Neue Tokens laufen standardmäßig nach 90 Tagen ab. Der Betreiber kann die Laufzeit über `PersonalAccessTokens:LifetimeDays` beziehungsweise `PERSONAL_ACCESS_TOKEN_LIFETIME_DAYS` zwischen 1 und 365 Tagen festlegen. Bei Einführung der Ablaufzeit vorhandene Tokens erhalten durch die Datenbankmigration eine neue Frist von 90 Tagen. Abgelaufene Tokens werden bei der Authentifizierung abgelehnt und sollten anschließend gelöscht oder ersetzt werden.

Beim Erstellen kann **Nur Lesezugriff** gewählt werden. Solche Tokens dürfen GET- und HEAD-Anfragen an die API ausführen, aber keine schreibenden API-Anfragen senden. Bestehende Tokens und neue Tokens ohne diese Option behalten Lese- und Schreibrechte, damit vorhandene Integrationen kompatibel bleiben.

Behandeln Sie Tokens wie Passwörter:

- nur für konkrete Zwecke erstellen,
- sicher speichern,
- bei Verdacht sofort widerrufen,
- nicht in Screenshots oder Tickets einfügen.

## Administration

Administratoren können Benutzer und Rollen verwalten. Beim ersten Start kann Sessage einen initialen Admin-Benutzer anlegen.

![Community-Adminbereich mit Benutzeranlage und Benutzerübersicht](/images/community/administration.png)

*Im Adminbereich legen Sie Benutzer an, vergeben die Administratorrolle und verwalten bestehende Konten.*

Wichtige Admin-Themen:

- Benutzerverwaltung,
- Admin-Rolle,
- Registrierung erlauben oder sperren,
- SMTP für Mails,
- Active Directory/LDAP,
- Client-Kompatibilität für mobile Apps,
- Forwarded Headers für Reverse-Proxy-Betrieb.

## Active Directory und LDAP

Sessage kann gegen Active Directory und generische LDAP-Verzeichnisse prüfen. AD bleibt ohne weitere Angaben rückwärtskompatibel: Anmeldungen werden über `sAMAccountName` oder `userPrincipalName` gesucht. Für LDAP können unter anderem `uid`, `cn` oder ein eigener sicher parametrisierter Suchfilter verwendet werden. Auch Benutzer-/Gruppenobjektklassen, E-Mail- und Anzeigename sowie `memberOf`, `member`, `uniqueMember` oder `memberUid` lassen sich abbilden.

Die vollständigen Optionen und Beispiele für AD, OpenLDAP und POSIX-Gruppen stehen unter [Docker-Konfiguration](./docker-konfiguration.md#active-directory-und-ldap). Das technische Suchkonto benötigt nur Leserechte. Nutzen Sie in Produktion LDAPS oder StartTLS und lassen Sie den Transport-Fallback deaktiviert.

Die **AD/LDAP-Anmeldung ist in Community und Enterprise enthalten**. Nur das direkte Berechtigen von AD-Benutzern und AD-Gruppen im Teilen-Dialog benötigt Enterprise Identity Governance. Siehe [AD-Verzeichnisfreigaben](./enterprise/verzeichnisfreigaben.md).

Wenn Auto-Fallback aktiviert ist, kann die Anwendung bei Bedarf auf alternative Anmeldung zurückfallen. Diese Entscheidung sollte bewusst und passend zur Sicherheitsrichtlinie getroffen werden.



