# Formulare

Enterprise Forms umfasst **Formulare und benutzerdefinierte Listenfelder**. Das Modul erfasst strukturierte Daten direkt an Aufgaben oder über interne und öffentliche Eingabemasken. Es benötigt die Capability `enterprise.forms`. Mögliche Einsatzfälle sind Anfragen, Störungsmeldungen, Bestellungen oder interne Freigabeprozesse.

## Benutzerdefinierte Felder verwalten

Öffnen Sie in einer Liste das Menü für benutzerdefinierte Felder. Dort können Sie Text-, Zahlen-, Dropdown-, Datums-, Checkbox-, Mehrfachauswahl- und Aufgaben-Auswahlfelder anlegen. Pflichtfelder und Optionen gelten listenweit; die Werte erscheinen in der Aufgabendetail- und Tabellenansicht sowie in der gemeinsamen mobilen App.

Eine Community-Installation oder eine Enterprise-Installation ohne Forms-Capability zeigt diese Bereiche nicht an und akzeptiert keine Feldänderungen über die API. Bereits gespeicherte Definitionen und Werte bleiben für eine spätere Reaktivierung erhalten.

## Formular öffnen und anlegen

1. Öffnen Sie die gewünschte Liste.
2. Öffnen Sie oben die Ansichtsauswahl und wählen Sie **Formulare**.
3. Klicken Sie auf **Neues Formular**.
4. Vergeben Sie einen Namen und wählen Sie den Veröffentlichungsstatus.
5. Ergänzen Sie die benötigten Felder und speichern Sie das Formular.

![Formulareditor mit Feldliste, Veröffentlichungsstatus und Formular-Designer](/images/enterprise/formulare-editor.png)

*Der aktuelle Enterprise-Formulareditor: Links werden die Formulare der Liste angezeigt. In der Mitte konfigurieren Sie Name, Status, Farben und Veröffentlichungslink; rechts beziehungsweise darunter stellen Sie Standardfelder und benutzerdefinierte Listenfelder zusammen.*

## Eigenschaften

Ein Formular kann enthalten:

- Name, Beschreibung und eindeutigen URL-Slug,
- Veröffentlichungsstatus und optionale Passwortsicherung,
- Standardfelder und eigene Listenfelder,
- Pflichtfelder und Validierungsregeln,
- unterschiedliche Feldbreiten und Layouts,
- Erfolgsmeldung und optionales Einreichungslimit,
- konfigurierbare Farben und Anhänge.

## Validierungen

Unterstützt werden unter anderem Zahl, Ganzzahl, E-Mail, IBAN, Datumsgrenzen, Mindest- und Maximallänge sowie reguläre Ausdrücke.

## Sicherheit

Öffentliche Formulare verwenden Schutzmechanismen wie Submission-Keys, Honeypot-Felder und Rate-Limits für Passwortversuche. Erlaubte Anhangstypen sollten bewusst eingeschränkt werden.

Formulare können mit [Automatisierungen](../automatisierung.md) und dem [E-Mail-Import](./email-import.md) kombiniert werden, um unterschiedliche Eingänge in einem gemeinsamen Listenprozess zu verarbeiten.
