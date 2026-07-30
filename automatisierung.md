# Automatisierung

::: info Enterprise
Automatisierungsregeln und Webhooks sind ausschließlich in der Enterprise Edition verfügbar und benötigen die Capability `enterprise.automation`.
:::

## Grundprinzip

Automatisierungen bestehen aus drei Teilen:

1. Auslöser: Wann startet die Regel?
2. Bedingungen: Wann darf die Regel wirklich laufen?
3. Aktionen: Was soll Sessage tun?

Alle Bedingungen einer Regel müssen zutreffen. Aktionen laufen in der Reihenfolge, in der sie gespeichert sind.

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
- Benachrichtigung senden
- Ausgewählte Felder per POST an einen Webhook senden
- Wichtigkeit setzen

## Kartenfarbe per Regel setzen

Die Aktion `Kartenfarbe setzen` kann nur den oberen Farbbalken oder die gesamte Karte einfärben. Nutzen Sie die volle Kartenfarbe sparsam für starke Signale, zum Beispiel Eskalation, Blocker oder dringende Rückfrage.

## Webhooks

Webhook-Aktionen senden ausgewählte Aufgabendaten per HTTP POST an ein externes System. Sie können festlegen, welche Felder enthalten sind und optional einen Bearer-Token hinterlegen.

Webhook-Ziele müssen auf öffentliche IP-Adressen zeigen. Private, lokale, Link-Local-, reservierte und Multicast-Netze werden abgelehnt. Dieselbe Prüfung findet unmittelbar beim Aufbau der ausgehenden Verbindung statt; dadurch kann eine nachträgliche DNS-Umschaltung nicht auf interne Dienste umleiten. HTTP-Weiterleitungen werden nicht verfolgt.

Aus Sicherheitsgründen sind nur öffentliche HTTP- oder HTTPS-Ziele vorgesehen. Private, lokale und Loopback-Adressen werden blockiert. Redirects sind deaktiviert.

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



