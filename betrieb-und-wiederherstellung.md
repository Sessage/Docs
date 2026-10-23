# Betrieb und Wiederherstellung

## Aktualisierung und Sicherung

Vor einem Versionswechsel Datenbank, `App_Data`, Attachment-Verzeichnis, Data-Protection-Schlüssel und Lizenz-/Signaturschlüssel gemeinsam sichern. Neue additive Migrationen ergänzen Importfortschritt, getrennte Erinnerungsmarker, Dashboardrevisionen und das Operator-Audit des Lizenzservers. Historischen Lizenzen wird kein unbekannter Akteur nachträglich zugeschrieben.

Migrationen zuerst auf einer wiederhergestellten Testdatenbank prüfen. Die Anwendung migriert beim regulären Start. EF-Werkzeuge besitzen zusätzlich eine Design-Time-Factory: Sie startet keinen Webhost und liest keine produktiven Konfigurationsdateien. Bei manuellen EF-Aufrufen muss `ConnectionStrings__DefaultConnection` deshalb ausdrücklich auf die beabsichtigte Datenbank zeigen. Ohne diese Variable verwenden die Werkzeuge einen lokalen Platzhalter. Community behält Npgsql-Zeitstempelbehandlung und Identity-Schemaversion bei. Ein Downgrade entfernt neue Fortschritts- und Auditdaten; für ein Rollback die zusammengehörige Sicherung verwenden.

## Mobile: lokale Speicherung und Bestätigung

„Lokal gespeichert“ bestätigt SQLite-Speicherung, „Synchronisiert“ eine Serverbestätigung. Nicht gespeicherte Eingaben, Übertragung, Konflikt und endgültiger Fehler werden davon unterschieden. Eine erreichbare Serveradresse bestätigt weder Anmeldung noch API-Kompatibilität oder vollständige Synchronisierung.

Neue Listen und Aufgaben speichern ihre wiederholbare Absicht vor dem Netzwerk gemeinsam mit der lokalen Projektion. Stabile IDs ermöglichen Wiederholung nach verlorenen Antworten. Abhängige Befehle warten; unabhängige Listen werden weiter aktualisiert. Profil und Sitzung sind während eines Vorgangs fest gebunden. Verspätete Antworten dürfen die neue Sitzung nicht abmelden.

Unter **Synchronisierung und Wiederherstellung** ausstehende Änderungen prüfen und erneut versuchen. Der Konfliktvergleich zeigt lokalen und aktuellen Serverstand. Nur ausgewählte bearbeitbare Felder werden übernommen; Identität, Berechtigungskontext und Versionsvorbedingungen stammen vom Server. Weitere zwischenzeitliche Änderungen erzeugen erneut einen Konflikt.

Vor einer Profiländerung oder -löschung ausstehende Arbeit exportieren oder bewusst verwerfen. Cache löschen ist keine Sicherung nicht übertragener Inhalte.

Aufgabenabschluss und Spaltenwechsel können im Editor kurzzeitig rückgängig gemacht werden, sofern keine Wiederholung ausgelöst wird. Externe Änderungen verwerfen diesen Undo-Stand. Nach einer Löschung im Workspace gibt es 30 Sekunden lang eine Wiederherstellungsaktion über den bestehenden Papierkorb. Mobile benötigt dafür eine Verbindung und wartet zuerst auf die Bestätigung einer ausstehenden Löschung; andernfalls könnte deren spätere Übertragung die wiederhergestellte Aufgabe erneut löschen. Nach Ablauf der kurzen Aktion bleibt die normale Papierkorbfunktion verfügbar.

### Beschädigte SQLite-Datei

Nur erkannte SQLite-Korruption rechtfertigt eine Quarantänekopie. Schreibschutz, voller Datenträger, Sperren und allgemeine I/O-Fehler dürfen eine gesunde Outbox nicht ersetzen. Die Wiederherstellungsansicht bietet Quarantänedateien einschließlich zugehöriger WAL-/SHM-Dateien als ZIP zum Export an.

Der Export kann Daten mehrerer Profile enthalten. Es gibt keine automatische Rückschreibung einer beschädigten Datenbank. Vor manueller Analyse die App schließen und zusammengehörige Dateien sichern; eine unveränderte Kopie aufbewahren und nur autorisierten Ansprechpartnern geben.

## E-Mail-Import

| Einstellung unter `EmailImport` | Standard | Zulässiger Bereich |
|---|---:|---:|
| `MaxMessagesPerRun` | 100 | 1–1.000 |
| `MaxMessageSizeBytes` | 10.485.760 | 1.024–52.428.800 |
| `MaxMessageAttempts` | 5 | 1–20 |

Die Größe wird vor dem Download anhand der IMAP-Metadaten und während des Downloads geprüft. UIDVALIDITY und UID identifizieren eine Nachricht. Reservierte Aufgaben-ID, allgemeine Erstellungsautomation und E-Mail-Automation besitzen gespeicherte Fortschrittsmarker. Ein Fehler beendet nur die betreffende Nachricht. Nach dem Versuchslimit überspringen automatische Läufe die Nachricht, ohne sie zu löschen oder als gelesen zu markieren.

Listenadministratoren sehen unvollständige Nachrichten, Versuche und Fehler im E-Mail-Konfigurationsdialog. **Erneut versuchen** gibt eine Nachricht für einen folgenden Import frei. Zuvor Ursache prüfen, etwa Betrefflänge, Größenlimit oder Automation. Erfolgreiche Stufen werden nicht absichtlich erneut ausgeführt.

Die Marker garantieren keine transaktionsübergreifende Exactly-once-Ausführung externer Systeme: Nach einem Absturz zwischen externer Wirkung und lokalem Marker ist eine Wiederholung möglich. Empfänger sollten fachlich idempotent arbeiten.

## Administration und Webhooks

Die Administration zeigt Beobachtungen dieser Serverinstanz zu Push, Webhooks und Verzeichnisabgleich. „—“ bedeutet noch keine Beobachtung. Ein Neustart setzt diese Diagnosedaten zurück; bei mehreren Instanzen jede Instanz betrachten. Vollständige und unvollständige Gruppenabgleiche werden getrennt angezeigt. Bei unvollständigem LDAP-Lesen bleiben bisherige Zugriffe erhalten; deshalb auch das Alter des letzten vollständigen Abgleichs überwachen.

Administratoren können die Daten authentifiziert über `GET /api/enterprise/administration/operations` und `GET /api/enterprise/push/diagnostics` abrufen. Sie enthalten keine Aufgabeninhalte, Empfängeradressen oder Zugangsdaten und ersetzen kein externes Monitoring.

Webhooks bleiben nach der fachlichen Speicherung im aufrufenden Ablauf. Fehler erscheinen in Logs und Metriken. Eine erfolgreiche Antwort bedeutet Annahme beim Empfänger. Es gibt keine dauerhafte serverweite Zustell-Outbox oder nachträgliche automatische Zustellgarantie; dieser größere Umbau gehört nicht zur Änderung.

`EnterpriseAdministration:AuditRetentionDays` legt die Audit-Aufbewahrung fest: Standard 365 Tage, zulässig 1–3.650. Die frühere Grenze von 500 Einträgen entfällt. Beim Schreiben werden alte Einträge entfernt; Anzeige und Export verwenden dieselbe Zeitgrenze. Für langfristige Archivierung rechtzeitig `GET /api/enterprise/administration/audit/export` abrufen. Schreibzugriffe auf `App_Data/enterprise-administration.json` werden über eine exklusive `.lock`-Datei serialisiert. Das gemeinsame Dateisystem muss Dateisperren unterstützen.

Plugins bleiben vertrauenswürdiger Code mit Serverrechten. Das Teams-Beispiel nutzt einen eigenen HTTP-Client: Seine HTTPS-Prüfung übernimmt nicht automatisch DNS-, Redirect- und SSRF-Regeln des eingebauten Webhooks. Nur geprüfte Plugins installieren und Netzwerkziele betrieblich begrenzen. Cancellation ist keine Prozessisolation.

## Push

Registrierung und Zustellung besitzen getrennte Budgets von jeweils 300 Anfragen pro Minute und bestehender Mandanten-/Quellpartition. Eine 429 enthält `Retry-After`. Mobile wiederholt idempotente Registrierungs-PUTs höchstens zweimal mit Zufallsabstand und beachtet die Mindestwartezeit. Wartezeiten über 30 Sekunden bleiben als Fehler sichtbar. Profilwechsel und Abmeldung verhindern weitere Wiederholungen.

Letzte Registrierung, Providerannahme und letzter Fehler werden getrennt angezeigt. Providerannahme bestätigt keine Geräteanzeige. Der In-App-Posteingang bleibt maßgeblich. FCM, APNs und WNS vor Freigabe mit echten Testgeräten auf Registrierung, Rotation, Abmeldung, anonymen Inhalt und sicheren Aufgabenklick prüfen. Diese Abnahme benötigt Betreiberzugänge und Geräte.

## Attachments und Kontaktformular

Uploads verwenden eine temporäre Stagingdatei und ersetzen keine vorhandene Zieldatei. Die tägliche Bereinigung entfernt passende, unreferenzierte Dateien, die älter als einen Tag sind, in begrenzten Batches. Referenzierte, frische und fremde Dateien bleiben erhalten. Datenbank und Attachment-Verzeichnis gemeinsam sichern.

Das Kontaktformular benötigt PHP mit `mbstring` und eingerichteten Mailtransport. Ein HTTP-Erfolg bestätigt die Annahme durch diesen Transport. Überlange Eingaben werden abgewiesen, nicht gekürzt. JSON und normales HTML-POST werden unterstützt. Bei Browser-Timeout bleiben Eingaben erhalten.

Pro Quelladresse gilt ein Fenster von fünf Versandversuchen in 15 Minuten. Bereits angenommene gleiche Inhalte werden in diesem Zeitraum nicht erneut versandt. Die gesperrten Hashdateien liegen in einem privaten Unterordner des beschreibbaren PHP-Tempverzeichnisses. Bei mehreren Webinstanzen mit getrennten Tempverzeichnissen gilt die Begrenzung pro Instanz; vorgeschaltetes Rate-Limiting kann sie installationsweit ergänzen.

## Performance messen

Der normale lokale Task-Save ersetzt den betroffenen JSON-Eintrag direkt in SQLite. Dadurch muss .NET beim Speichern nicht mehr das gesamte Board materialisieren. SQLite schreibt das JSON-Dokument weiterhin neu; vollständige Downloads und Bestätigungsabgleiche bleiben bestehen. Dieser begrenzte Eingriff führt weder normalisierte Tasktabellen noch Delta-Sync ein.

Die Meter `Sessage.WorkspaceSync`, `Sessage.EnterprisePush` und `Sessage.Enterprise.Operations` liefern Snapshotdauer/-größe/-Aufgabenzahl, Push-Ergebnis/-Dauer und Webhook-Ergebnis/-Dauer. Mit dem verwendeten .NET-Monitoring erfassen. Aufgabeninhalte werden nicht als Metriklabels geschrieben.

Für belastbare Vergleiche dieselben Datenmengen (100/1.000/10.000 Aufgaben und 5/20 Zusatzfelder), Buildmodus, Browser, Netzwerkzustand und Geräte verwenden. Kaltstart und warmen Reload getrennt messen; Filtertippen, Spaltenwechsel, SQLite-Schreibzeit, DOM-Knoten, Eingabelatenz und Serverallokationen erfassen. Die Änderungen reduzieren unnötige Projektionen und Lizenzabfragemengen. Eine prozentuale Gesamtbeschleunigung oder ein bereits gemessener Gewinn auf langsamen Geräten wird nicht behauptet.
