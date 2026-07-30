# Benachrichtigungen

## Benachrichtigungszentrum

Sessage besitzt ein Benachrichtigungszentrum für relevante Hinweise. Ungelesene Einträge können geöffnet, gelesen markiert oder gelöscht werden.

## Auslöser für Benachrichtigungen

Benachrichtigungen können entstehen durch:

- Erinnerungen an Aufgaben,
- neue Zuweisungen,
- Beobachten einer Aufgabe,
- Enterprise-Automatisierungsaktion `Benachrichtigung senden`,
- Listen- oder Boardregeln,
- Echtzeitereignisse über SignalR.

## E-Mail-Benachrichtigungen

E-Mail-Versand ist möglich, wenn SMTP konfiguriert wurde. Das betrifft unter anderem Einladungen, Zuweisungen und Erinnerungen.

Für den produktiven Betrieb sollten Absenderadresse, Basis-URL und SMTP-Zugangsdaten korrekt gesetzt sein. Siehe [Installation und Inbetriebnahme](./installation.md).

## Push-Nachrichten in der Enterprise-App

Enterprise kann Benachrichtigungen über das zentrale Sessage Push Relay an die Android-, iOS- und Windows-App zustellen. Die Funktion benötigt die Capability `enterprise.push-notifications` und eine vom Administrator konfigurierte Relay-Anbindung. Community sendet keine Push-Nachrichten.

Aktivieren Sie Push in der App unter **Konto → Benachrichtigungen**. Dort entscheiden Sie auch, was auf Sperrbildschirm und System-Benachrichtigungsfläche sichtbar ist:

- **Anonym:** Es erscheint nur „Eine Benachrichtigung von Sessage ist eingegangen“.
- **Mit Inhalt:** Titel und Benachrichtigungstext werden angezeigt, zum Beispiel „Erinnerung: Test“.

Die Inhaltswahl gilt für alle registrierten Geräte des Kontos. Die eigentliche Gerätefreigabe wird je App-Installation erteilt. Ein Tipp oder Klick auf die Push-Nachricht öffnet das passende Serverprofil und direkt die betroffene Aufgabe. Ist das Profil nicht mehr vorhanden oder die Sitzung abgelaufen, werden keine Daten aus einem anderen Profil geöffnet.

Die lokale Sessage-Installation übermittelt an das Relay pseudonymisierte Benutzer- und Gerätekennungen, Plattform, Push-Kanal und das interne Öffnungsziel. Im anonymen Modus werden weder Aufgabentitel noch Benachrichtigungstext an das Relay gesendet. Im Modus **Mit Inhalt** werden genau die für die Systembenachrichtigung benötigten Texte übertragen. Die fachlichen Daten bleiben weiterhin auf der lokalen Installation.

## Gute Praxis

- Verwenden Sie Beobachten für gezielte Aufmerksamkeit.
- Setzen Sie Enterprise-Automatisierungsbenachrichtigungen nur bei wirklich relevanten Statuswechseln ein.
- Kombinieren Sie Labels und Spalten sowie in Enterprise benutzerdefinierte Felder, damit Benachrichtigungen nicht jede kleine Änderung melden müssen.



