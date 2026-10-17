# Import, Export und Papierkorb

Excel-Import, Export und Papierkorb gehören zum Community-Kern und stehen in beiden Editionen zur Verfügung. Benutzerdefinierte Importfelder benötigen das Enterprise-Modul **Formulare und benutzerdefinierte Felder**.

## Aufgaben aus Excel importieren

Öffnen Sie die gewünschte Liste und wählen Sie **Listenoptionen (⋯) → Import**. Sie benötigen Schreibrechte für die Liste. In der mobilen App ist zusätzlich eine Verbindung zu einem aktuellen Sessage-Server erforderlich; der Import wird nicht offline vorgemerkt.

1. Wählen Sie eine **XLSX-Datei** aus. Ältere `.xls`-Dateien müssen vorher als `.xlsx` gespeichert werden.
2. Wählen Sie das **Tabellenblatt** mit den Aufgaben. Pro Import wird ein Blatt übernommen.
3. Geben Sie unter **Zeile der Spaltenüberschriften** die tatsächliche Excel-Zeilennummer an. Bei Überschriften in **Zeile 5** beginnen die Aufgaben in **Zeile 6**. Vorherige Zeilen und leere Datenzeilen werden übersprungen. Blatt und Überschriftenzeile lassen sich ohne erneutes Hochladen ändern.
4. Prüfen Sie die **Spaltenzuordnung**. Passende Überschriften werden automatisch vorgeschlagen; jede Zuordnung kann geändert werden. Excel-Spalten ohne Zuordnung werden ignoriert.
5. Tragen Sie bei Bedarf **Standardwerte** ein. Ein Standardwert greift, wenn keine Excel-Spalte zugeordnet ist oder die jeweilige Zelle leer ist. Er überschreibt keine ausgefüllte Zelle.

![Excel-Import mit ausgewähltem Blatt Aufgaben, Überschriftenzeile 5 und Standardstatus In Arbeit](/images/community/excel-import-zuordnung.png)

*Die Liste „Produktlaunch“ erhält drei Aufgaben ab Excel-Zeile 6. Die Excel-Spalte „Status“ wird dem Listenfeld „Status / Listenspalte“ zugeordnet. Leere Statuszellen erhalten „In Arbeit“.*

### Statuswerte den Listenspalten zuordnen

Nach der Zuordnung einer Statusspalte erscheint **Statuswerte zuordnen**. Wählen Sie für jeden Excel-Status eine vorhandene Zielspalte Ihrer Liste, beispielsweise:

| Status aus Excel | Zielspalte in Sessage |
|---|---|
| Offen | Backlog |
| In Prüfung | In Arbeit |
| Leere Zelle | Standardwert, im Beispiel In Arbeit |

Ein unbekannter, ausgefüllter Status wird nicht durch den Standardwert ersetzt. Ordnen Sie ihn ausdrücklich einer Zielspalte zu. Ohne Statuszuordnung und ohne Standardwert wird die erste Listenspalte verwendet.

### Zuordnung prüfen und Import bestätigen

Klicken Sie auf **Zuordnung prüfen**. Sessage prüft alle Aufgaben und zeigt eine Importvorschau mit den ersten fünf Ergebnissen. Bis hierhin werden keine Aufgaben angelegt. Über **Excel-Vorschau** können Sie außerdem die ersten fünf Datenzeilen mit ihren ursprünglichen Excel-Zeilennummern ansehen.

![Geprüfte Importvorschau mit Statusübersetzung und drei Aufgaben vor dem Bestätigen](/images/community/excel-import-vorschau.png)

*„Offen“ und „In Prüfung“ sind vorhandenen Listenspalten zugeordnet. Die dritte Aufgabe verwendet wegen ihrer leeren Statuszelle den Standardwert „In Arbeit“.*

Mit **Import bestätigen** werden die geprüften Aufgaben in der geöffneten Liste angelegt. Bei einem Validierungsfehler wird der gesamte Import abgewiesen; die Fehlermeldung nennt die betroffene Excel-Zeile. Korrigieren Sie die Datei, Zuordnung oder Standardwerte und prüfen Sie erneut. Eine Änderung der Einstellungen erfordert eine neue Prüfung.

Die erneute Bestätigung desselben Importvorgangs legt die Aufgaben nicht doppelt an. Ein neu gestarteter Import derselben Datei ist dagegen ein neuer Vorgang und gleicht Aufgaben nicht mit früheren Importen ab.

### Felder und Eingabeformate

| Listenfeld | Erwarteter Inhalt |
|---|---|
| Titel | Pflichtfeld; Excel-Wert oder Standardwert |
| Beschreibung | Text |
| Status / Listenspalte | Vorhandene Listenspalte oder ausdrücklich zugeordneter Excel-Status |
| Startdatum, Fälligkeitsdatum | Beispielsweise `04.11.2026`, `2026-11-04` oder ein Excel-Datumswert |
| Erledigt, Wichtig | `Ja` / `Nein`, `true` / `false` oder `1` / `0` |
| Bearbeiter | Benutzer-ID oder E-Mail eines angenommenen Listenteilnehmers |
| Labels | Bereits vorhandene Labelnamen, mehrere mit `;` getrennt |
| Benutzerdefinierte Felder (Enterprise) | Bereits konfigurierte Listenfelder; Pflichtfelder und Auswahloptionen gelten auch beim Import |

Benutzerdefinierte Felder können ebenfalls einen Standardwert erhalten. Zahlenfelder akzeptieren beispielsweise `1250,50`; mehrere Werte eines Mehrfachauswahlfeldes werden mit `;` getrennt. Eine Aufgabenauswahl benötigt die ID einer vorhandenen Aufgabe aus der verknüpften Liste. Neue Felder, Labelnamen oder Listenspalten werden durch den Import nicht automatisch angelegt.

### Formeln, Makros und Dateigrenzen

**Formeln sind erlaubt.** Importiert wird ihr zuletzt in der Datei gespeichertes Ergebnis. Sessage berechnet keine Excel-Formeln neu. Öffnen Sie die Datei daher vor dem Upload in Excel, berechnen Sie sie neu und speichern Sie sie. Fehlende gespeicherte Ergebnisse und Excel-Fehlerwerte müssen vor dem Import behoben werden.

**Makros, eingebettete Objekte und externe Verknüpfungen werden abgewiesen.** Entfernen Sie diese Inhalte vor dem Upload; ein bloßes Umbenennen der Dateiendung genügt nicht. Hochgeladene Inhalte werden als Daten geprüft und nicht als SQL, HTML-Code oder ausführbare Formeln übernommen. Der Server prüft zusätzlich Berechtigungen, Feldtypen und erlaubte Zielwerte, bevor er Aufgaben speichert.

Es gelten maximal **10 MB pro Datei**, **10 Tabellenblätter**, **128 Spalten**, **1000 Aufgaben im ausgewählten Blatt** und **10.000 Zeichen pro Zelle**. Zusätzliche Grenzen für die entpackten Dateiinhalte schützen vor übermäßig großen oder manipulierten XLSX-Dateien.

### Beispieldatei und häufige Fehler

Laden Sie die <a href="/examples/excel-import-beispiel.xlsx" download>Excel-Beispieldatei</a> herunter. Wählen Sie das Blatt **Aufgaben** und die Überschriftenzeile **5**. Ordnen Sie **Status** dem Feld **Status / Listenspalte** zu und verwenden Sie die Statuszuordnung aus der Tabelle oben. Die drei Aufgaben enthalten ausschließlich Beispieldaten. Die zusätzliche Spalte **Budget** enthält auch eine Formel mit gespeichertem Ergebnis; **Projekt** ist für einen eigenen Standardwert vorgesehen. Beide Spalten können ohne passende benutzerdefinierte Listenfelder ignoriert werden.

| Meldung oder Verhalten | Lösung |
|---|---|
| „Die Aufgabe verweist auf eine unbekannte Spalte“ | Excel-Status unter **Statuswerte zuordnen** einer vorhandenen Listenspalte zuordnen; ein Standardwert ersetzt nur leere Zellen. |
| Falsche Überschriften oder zu viele Aufgaben | Tabellenblatt und Überschriftenzeile kontrollieren. Die Aufgaben beginnen in der Folgezeile. |
| Formel ohne gespeichertes Ergebnis | Datei in Excel neu berechnen, speichern und erneut hochladen. |
| Bearbeiter, Label oder Auswahlwert unbekannt | Vorhandenen, zulässigen Wert verwenden; Bearbeiter muss die Listeneinladung angenommen haben. |
| Mobile App meldet fehlende Verbindung oder fehlende Serverunterstützung | Verbindung herstellen beziehungsweise Sessage-Server aktualisieren; Import anschließend erneut öffnen. |

## Exporte

Sessage unterstützt Exporte für Dokumentation, Auswertung und Weiterverarbeitung:

- JSON für strukturierte Sicherung oder technische Weitergabe
- CSV für Tabellenkalkulation und Reporting
- PDF für Statusberichte und Ablage

Enterprise-Dashboards können zusätzlich als Grundlage für Reporting und listenübergreifende Übersichten dienen.

## Papierkorb

Gelöschte Aufgaben und Listen landen für 14 Tage im Papierkorb. Der globale Papierkorb zeigt wiederherstellbare Listen und Aufgaben aus noch aktiven Listen. Zusätzlich können gelöschte Aufgaben direkt über die Listenoption **Gelöschte Aufgaben wiederherstellen** zurückgeholt werden. Listen können nur von Listenadministratoren, Aufgaben von Benutzern mit Schreibrecht wiederhergestellt werden.

Eine wiederhergestellte Aufgabe wird am Ende der Liste und ihrer Kanban-Spalte einsortiert. Existiert ihre frühere Spalte nicht mehr, verwendet Sessage eine passende vorhandene Spalte. Aufgaben in einer gelöschten Liste erscheinen erst wieder separat, nachdem die Liste wiederhergestellt wurde. Abgelaufene Einträge können auch dann nicht mehr wiederhergestellt werden, wenn der tägliche Bereinigungslauf noch nicht stattgefunden hat.

Der Server besitzt einen täglichen Bereinigungsdienst. Löschungen sollten deshalb nicht als dauerhafte Archivierung verstanden werden. Für langfristige Nachweise nutzen Sie Exporte oder eine externe Archivierung.

## Enterprise-Prozesseingänge

Der Import eingehender Nachrichten ist separat unter [Enterprise-E-Mail-Import](./enterprise/email-import.md) dokumentiert. Formulare werden unter [Enterprise-Formulare](./enterprise/formulare.md) beschrieben.
