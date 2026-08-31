# Automatisierung

::: info Enterprise
Automatisierungsregeln und Webhooks sind ausschließlich in der Enterprise Edition verfügbar und benötigen die Capability `enterprise.automation`.
:::

## Grundprinzip

Automatisierungen bestehen aus drei Teilen:

1. Auslöser: Wann startet die Regel?
2. Bedingungen: Wann darf die Regel wirklich laufen?
3. Aktionen: Was soll Sessage tun?

Alle Bedingungen einer Regel müssen zutreffen. Aktionen laufen von oben nach unten. Mit den Pfeilen im Regeleditor kann ihre Reihenfolge gezielt geändert werden. Pro Regel sind bis zu 100 Bedingungen und 100 Aktionen möglich.

## Automatisierung öffnen

1. Öffnen Sie die gewünschte Liste.
2. Klicken Sie oben rechts auf **Optionen** (`…`).
3. Wählen Sie **Automatisierung**.
4. Klicken Sie auf **Neue Regel**.

Im Regeleditor vergeben Sie einen Namen und konfigurieren Auslöser, optionale Bedingungen und mindestens eine Aktion.

![Editor für eine Enterprise-Automatisierungsregel](/images/enterprise/automatisierung-regel.png)

*Die nummerierten Bereiche führen von oben nach unten durch Auslöser, Bedingungen und Aktionen.*

Nach dem Speichern erscheint die Regel in der Übersicht. Dort können Sie sie aktivieren, deaktivieren, bearbeiten oder löschen.

![Übersicht gespeicherter Automatisierungsregeln](/images/enterprise/automatisierung-uebersicht.png)

## Auslöser

Verfügbare Auslöser:

- Aufgabe wurde erstellt
- Aufgabe wurde geändert
- Aufgabe wurde in eine andere Spalte verschoben
- Aufgabe wurde fertiggestellt
- Aufgabe wurde erneut geöffnet
- Bearbeiter wurde geändert
- Aufgabe wurde über ein öffentliches Formular erstellt
- Aufgabe wurde über den E-Mail-Import erstellt
- Genehmigung wurde erteilt
- Genehmigung wurde abgelehnt

## Bedingungen

Bedingungen grenzen eine Regel ein:

- Ausgangsspalte ist ein bestimmter Wert
- Zielspalte ist ein bestimmter Wert
- Aufgabe ist fertig
- Aufgabe ist offen
- Bearbeiter entspricht einem Wert
- Eigenes Feld entspricht einem Wert
- Eigenes Feld ist leer
- Titel enthält Text

Wenn keine Bedingung gesetzt ist, gilt die Regel für jede Aufgabe, die den Auslöser erfüllt.

Bearbeiter und Genehmiger werden aus dem Listeneigentümer und den angenommenen Listenteilnehmern gewählt. Auswahlfelder, Mehrfachauswahlen, Datums-, Zahlen- und Kontrollkästchenfelder werden ihrem Feldtyp entsprechend bearbeitet und verglichen. Bei Mehrfachauswahlen spielt die Reihenfolge der gewählten Werte keine Rolle.

## Aktionen

Eine Regel kann mehrere Aktionen ausführen:

- Kartenfarbe setzen
- Eigenes Feld befüllen
- Eigenes Feld leeren
- Kommentar hinzufügen
- Label hinzufügen
- Aufgabe als fertig markieren
- Aufgabe als offen markieren
- Aufgabe in eine Spalte verschieben
- Bearbeiter setzen
- Bearbeiter entfernen
- Genehmiger setzen
- Genehmigung anfordern
- Benachrichtigung senden
- Ausgewählte Felder per POST an einen Webhook senden
- Wichtigkeit setzen

## Kartenfarbe per Regel setzen

Die Aktion `Kartenfarbe setzen` kann nur den oberen Farbbalken oder die gesamte Karte einfärben. Nutzen Sie die volle Kartenfarbe sparsam für starke Signale, zum Beispiel Eskalation, Blocker oder dringende Rückfrage.

## Webhooks

Webhook-Aktionen senden ausgewählte Aufgabendaten per HTTP POST an ein externes System. Sie können festlegen, welche Felder enthalten sind und optional einen Bearer-Token hinterlegen.

Webhook-Ziele müssen HTTP oder HTTPS verwenden und auf öffentliche IP-Adressen zeigen. Private, lokale, Loopback-, Link-Local-, reservierte und Multicast-Netze werden abgelehnt. Dieselbe Prüfung findet unmittelbar beim Aufbau der ausgehenden Verbindung statt; dadurch kann eine nachträgliche DNS-Umschaltung nicht auf interne Dienste umleiten. HTTP-Weiterleitungen werden nicht verfolgt. Im Editor können nur unterstützte Aufgaben- und benutzerdefinierte Felder ausgewählt werden.

Ein optionaler Bearer-Token wird geschützt gespeichert und nach dem Speichern nicht wieder im Klartext an Browser oder App übertragen. Beim Bearbeiten kann er unverändert beibehalten, ersetzt oder ausdrücklich entfernt werden.

## Kundeneigene Plugin-Aktionen

Enterprise-Installationen können zusätzliche Aktionen beim Serverstart aus einem Plugin-Verzeichnis laden. Die Aktionen und ihre Eingabefelder werden durch das jeweilige Plugin beschrieben und erscheinen im Regeleditor in der Gruppe **Plugins**. Entwicklung, Installation und Sicherheitsmodell beschreibt [Automatisierungsplugins entwickeln](./enterprise/automatisierungsplugins.md).

Nicht mehr vorhandene Ziele, etwa gelöschte Labels, Felder oder entfernte Teilnehmer, werden bei der Ausführung sicher übersprungen. Die übrigen gültigen Aktionen der Regel laufen weiter. Unveränderte Werte erzeugen keine künstlichen Aufgabenänderungen oder wiederholten Genehmigungsbenachrichtigungen. Eine gemeinsame Ausführungsgrenze verhindert außerdem ausufernde Ketten, wenn mehrere Regeln gegenseitig Folgeauslöser erzeugen.

Der Automatisierungseditor ist im Web und in der mobilen App verfügbar. Beide Oberflächen verwenden dieselben Regeln und dieselbe serverseitige Validierung. Mobile Serverfehler werden als verständliche Meldung angezeigt; ein Verbindungs- oder Berechtigungsfehler wird nicht als leere Regelliste dargestellt.

## Beispiele

### Eingang farbig markieren

- Auslöser: Aufgabe wurde erstellt
- Bedingungen: keine
- Aktionen: Kartenfarbe auf Blau setzen, Kommentar `Neue Anfrage eingegangen` hinzufügen

### Fertig-Spalte erledigt markieren

- Auslöser: Aufgabe wurde in eine andere Spalte verschoben
- Bedingung: Zielspalte ist `Fertig`
- Aktion: Aufgabe als fertig markieren

### Rückfrage an Team melden

- Auslöser: Aufgabe wurde geändert
- Bedingung: Titel enthält `Rückfrage`
- Aktionen: Label `Rückfrage` hinzufügen, Benachrichtigung senden



