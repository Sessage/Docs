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

- einzelne Verzeichnisbenutzer über Anzeigename, Common Name (`cn`), `name`, E-Mail, Identitäts- oder Anmeldeattribute,
- Verzeichnisgruppen über Common Name (`cn`), `name` und Anzeigenamen.

Für jeden Treffer wird eine Rolle als Beobachter, Mitglied oder Admin gewählt. Beim Speichern liest Sessage den Benutzer beziehungsweise alle Gruppenmitglieder erneut aus dem Verzeichnis und provisioniert sie anhand ihres kanonisch normalisierten Distinguished Name. Die Benutzer erhalten dadurch sofort Zugriff und können unmittelbar als Bearbeiter ausgewählt werden; eine vorherige Anmeldung oder Annahme ist nicht erforderlich.

Vorprovisionierte Konten werden nicht allein anhand einer E-Mail-Adresse mit lokalen Konten verbunden. Erst eine erfolgreiche AD-/LDAP-Anmeldung bestätigt die persönliche Bindung. Besteht für dieselbe Ressource bereits ein nicht bestätigter lokaler Teilnehmer mit derselben E-Mail-Adresse, wird die Freigabe mit einem eindeutigen Konflikthinweis abgebrochen, anstatt möglicherweise dem falschen Konto Zugriff zu geben.

Wenn SMTP konfiguriert und `ActiveDirectory__SendSharingNotifications=true` ist, erhält jeder neu berechtigte Benutzer einmalig eine Informationsmail mit einem Link zur Ressource. Versandfehler nehmen die bereits erteilte Berechtigung nicht zurück; sie werden persistent gespeichert und beim nächsten Gruppenabgleich erneut versucht. Ohne SMTP weist die Erfolgsmeldung ausdrücklich darauf hin, dass der Zugriff aktiv ist, aber keine E-Mail versendet wurde.

## Gruppenmitgliedschaften

Beim Hinzufügen einer Gruppe löst Sessage deren Mitglieder sofort auf. Active Directory verwendet dafür die rekursive Matching Rule und berücksichtigt damit auch verschachtelte Gruppen. Generisches LDAP unterstützt `member`, `uniqueMember`, `memberUid` und benutzerseitiges `memberOf`; verschachtelte DN-Gruppen werden rekursiv verfolgt.

Änderungen an Gruppenmitgliedschaften werden sowohl bei einer AD-Anmeldung als auch regelmäßig im Hintergrund synchronisiert. Das Standardintervall beträgt 15 Minuten. Hinzugekommene Rechte werden erteilt und nicht mehr zutreffende Rechte einschließlich abgeleiteter Portfolio-Listenrechte entfernt. Schlägt eine vollständige Verzeichnisabfrage fehl, bleiben die zuletzt bekannten Berechtigungen erhalten; ein vorübergehender LDAP-Ausfall führt damit nicht zu einem unbeabsichtigten Massenentzug.

Für sehr große Gruppen begrenzt `ActiveDirectory__MaxProvisionedGroupMembers` die Verarbeitung standardmäßig auf 5.000 Benutzer. Wird die Grenze überschritten, wird die Freigabe nicht teilweise angelegt. `ActiveDirectory__GroupSynchronizationIntervalMinutes=0` deaktiviert den Hintergrundabgleich; der Abgleich bei Anmeldung bleibt erhalten.

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
- optional `ActiveDirectory__GroupSearchBaseDn`, wenn Gruppen außerhalb der Benutzer-Suchbasis liegen

Die grundlegende Verbindung wird unter [AD-Anbindung](../ad-anbindung.md) eingerichtet. Attribute, Objektklassen und Suchfilter entsprechen der ergänzenden Referenz unter [Docker-Konfiguration](../docker-konfiguration.md#active-directory-und-ldap). Dadurch nutzt auch der Enterprise-Verzeichnis-Tab bei OpenLDAP beispielsweise `uid` und `inetOrgPerson` statt der AD-spezifischen Felder.

Das Dienstkonto benötigt Leserechte auf die Benutzer- und Gruppenobjekte im Suchbereich.

## Upgrade und Datenintegrität

Beim Upgrade werden bereits gespeicherte Benutzer-, Gruppen- und Freigabe-DNs automatisch kanonisch normalisiert. Eine Verzeichnisidentität darf aus Sicherheitsgründen nur genau einem lokalen Konto zugeordnet sein. Erkennt die Migration eine ältere, mehrdeutige Doppelzuordnung, bricht sie mit einem ausdrücklichen Diagnosehinweis ab, statt willkürlich Konten oder Berechtigungen zusammenzuführen. Die betroffenen Zuordnungen müssen dann vor dem erneuten Start fachlich geprüft und bereinigt werden.
