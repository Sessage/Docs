# E-Mail-Import

Der E-Mail-Import ist ein Enterprise-Modul. Er überwacht konfigurierte IMAP-Postfächer und übernimmt neue Nachrichten als Aufgaben in eine Liste.

## Typische Nutzung

- Support- oder Serviceanfragen als Aufgaben anlegen
- zentrale Postfächer in einen nachvollziehbaren Teamprozess überführen
- E-Mail- und Formulareingänge in derselben Liste bearbeiten

## Konfiguration

Pro Liste werden Postfachverbindung, Zielspalte und Importverhalten konfiguriert. Vor der Aktivierung sollte die Verbindung getestet werden.

1. Öffnen Sie die Zielliste.
2. Klicken Sie oben rechts auf **Optionen** (`…`).
3. Wählen Sie **E-Mail**.
4. Tragen Sie IMAP-Server, Port, SSL/TLS, Benutzername und Passwort ein.
5. Testen Sie die Verbindung und wählen Sie anschließend Ordner und Zielspalte.
6. Aktivieren Sie den Import und speichern Sie die Konfiguration.

![Konfigurationsdialog für den Enterprise-E-Mail-Import](/images/enterprise/email-import.png)

*Die abgebildeten Server- und Kontodaten sind reine Beispiele. Verwenden Sie für den Betrieb ein eingeschränktes Postfachkonto und eine sichere Secret-Verwaltung.*

Der Hintergrunddienst prüft aktive Konfigurationen in einem global festgelegten Intervall. Das Standardintervall wird über `EmailImport__IntervalMinutes` gesetzt.

## Betrieb und Sicherheit

- Verwenden Sie nach Möglichkeit ein eigenes, eingeschränktes Postfachkonto.
- Hinterlegen Sie Zugangsdaten ausschließlich über sichere Konfiguration oder Secret-Verwaltung.
- Wählen Sie ein Intervall, das Mailserver und Anwendung nicht unnötig belastet.
- Prüfen Sie nach Änderungen zuerst den Verbindungstest und anschließend einen kontrollierten Import.
