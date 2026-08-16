# LDAP-/AD-Verzeichnisfreigaben

Die Anmeldung gegen Active Directory/LDAP gehört bereits zur Community Edition. Das Enterprise-Modul **Identity Governance** ergänzt die Möglichkeit, Verzeichnisobjekte direkt in den Teilen-Dialogen zu berechtigen.

## Verzeichnis-Tab

Admins einer Liste oder eines Portfolios sehen den Tab **Verzeichnis**, wenn:

1. der Enterprise-Server verwendet wird,
2. die Lizenz `enterprise.identity-governance` freischaltet und
3. `ActiveDirectory__Enabled=true` konfiguriert ist.

Die Suche ist serverseitig an die konkrete Liste oder das konkrete Portfolio gebunden. Benutzer ohne Adminrolle können das AD nicht über diesen Endpunkt durchsuchen.

Öffnen Sie in einer Liste oben rechts **Teilen** und wechseln Sie zu **Verzeichnis**. Geben Sie mindestens zwei Zeichen ein und starten Sie die Suche mit **Suchen**.

![Verzeichnis-Tab im Teilen-Dialog einer Liste](/images/enterprise/verzeichnisfreigabe-liste.png)

*Der Tab erscheint nur bei gültiger Enterprise-Lizenz und aktiver AD-Konfiguration. Unterhalb der Suche werden bestehende Verzeichnisfreigaben angezeigt.*

Bei Portfolios öffnen Sie zunächst das Portfolio-Dashboard und klicken dort auf **Portfolio teilen**. Der Tab **Verzeichnis** funktioniert anschließend nach demselben Prinzip.

![Verzeichnis-Tab im Teilen-Dialog eines Portfolios](/images/enterprise/verzeichnisfreigabe-portfolio.png)

## Benutzer und Gruppen berechtigen

Die Suche verwendet die konfigurierten LDAP-/AD-Attribute und findet:

- einzelne Verzeichnisbenutzer über Anzeigename, E-Mail, Identitäts- oder Anmeldeattribute,
- Verzeichnisgruppen über Namen und Anzeigenamen.

Für jeden Treffer wird eine Rolle als Beobachter, Mitglied oder Admin gewählt. Die Freigabe wird persistent gespeichert. Bereits bekannte AD-Benutzer erhalten die Berechtigung unmittelbar; ansonsten wird sie bei der nächsten AD-Anmeldung des Benutzers wirksam.

## Gruppenmitgliedschaften

Bei einer Verzeichnisanmeldung speichert Sessage eine aktuelle Verzeichnisidentität. In AD werden verschachtelte Gruppen über die rekursive Matching Rule ermittelt. Generisches LDAP verwendet standardmäßig direkte `memberOf`-Mitgliedschaften. Für `groupOfNames`, `groupOfUniqueNames` oder `posixGroup` wird `ActiveDirectory__GroupMembershipSearchFilter` mit `{userDn}` beziehungsweise `{username}` konfiguriert.

Änderungen an Gruppenmitgliedschaften werden beim nächsten AD-Login des betroffenen Benutzers synchronisiert. Dabei werden hinzugekommene Rechte erteilt und nicht mehr zutreffende Rechte einschließlich abgeleiteter Portfolio-Listenrechte entfernt.

## Zusammenspiel mehrerer Freigaben

Direkte E-Mail-/Linkfreigaben, Portfoliofreigaben und Verzeichnisfreigaben können gleichzeitig bestehen. Sessage berechnet daraus die stärkste wirksame Rolle. Das Entfernen einer Verzeichnisfreigabe löscht daher keine weiterhin gültige direkte oder über ein Portfolio geerbte Berechtigung.

## Erforderliche LDAP-/AD-Konfiguration

Die Verzeichnissuche verwendet das konfigurierte Dienstkonto:

- `ActiveDirectory__Server`
- `ActiveDirectory__Port`
- `ActiveDirectory__UseSSL` oder `ActiveDirectory__UseStartTls`
- `ActiveDirectory__BindUser`
- `ActiveDirectory__BindPassword`
- `ActiveDirectory__BaseDn`

Die grundlegende Verbindung wird unter [AD-Anbindung](../ad-anbindung.md) eingerichtet. Attribute, Objektklassen und Suchfilter entsprechen der ergänzenden Referenz unter [Docker-Konfiguration](../docker-konfiguration.md#active-directory-und-ldap). Dadurch nutzt auch der Enterprise-Verzeichnis-Tab bei OpenLDAP beispielsweise `uid` und `inetOrgPerson` statt der AD-spezifischen Felder.

Das Dienstkonto benötigt Leserechte auf die Benutzer- und Gruppenobjekte im Suchbereich.
