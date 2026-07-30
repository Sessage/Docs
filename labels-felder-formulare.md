# Labels und benutzerdefinierte Felder

Labels gehören zum Community-Kern. **Benutzerdefinierte Felder sind Bestandteil von Enterprise Forms** und benötigen die Capability `enterprise.forms`. Damit liegen Formularaufbau und die dazugehörigen strukturierten Aufgabendaten in einem gemeinsamen Enterprise-Modul.

## Labels

Labels sind farbige Markierungen pro Liste. Sie strukturieren Aufgaben nach Themen, Typen oder Prioritäten.

Gute Labels sind kurz und eindeutig. Vermeiden Sie zu viele ähnliche Labels, damit Filter und Tabellen übersichtlich bleiben.

## Benutzerdefinierte Felder (Enterprise)

Benutzerdefinierte Felder erweitern Aufgaben um strukturierte Daten. Sie gelten pro Liste und können in Aufgaben, Tabellen und Formularen genutzt werden. Ohne aktive Forms-Capability werden Definitionen und Werte weder in der Oberfläche angeboten noch über die Mobile-API verändert.

Verfügbare Feldtypen:

- Text
- Zahl
- Dropdown
- Datum
- Checkbox
- Aufgaben-Auswahl aus einer Quellliste
- Mehrfachauswahl

Ein Feld kann als Pflichtfeld markiert werden. Dropdowns und Mehrfachauswahlen verwenden gepflegte Optionen. Aufgaben-Auswahlfelder können Titel aus einer anderen Liste beziehen, beispielsweise für Kunden, Projekte oder Standorte.

## Wann benutzerdefinierte Felder sinnvoll sind

Nutzen Sie benutzerdefinierte Felder, wenn Informationen wiederholt gleichartig gepflegt werden:

- Kundennummer
- Aufwand
- Prioritätsklasse
- Standort
- Freigabedatum
- Rechnung gestellt
- Kategorie

Freitext gehört eher in Beschreibung oder Kommentare. Wiederverwendbare Prozessdaten gehören in benutzerdefinierte Felder.

## Zusammenspiel mit Formularen und Automatisierungen

[Formulare](./enterprise/formulare.md) können Standardfelder und benutzerdefinierte Listenfelder als Eingabefelder verwenden. [Automatisierungen](./automatisierung.md) können Werte prüfen, setzen oder leeren.

::: info Wechsel zwischen Editionen
Das gemeinsame Datenmodell bewahrt vorhandene Felddefinitionen und Werte, wenn eine Enterprise-Lizenz vorübergehend fehlt oder eine Installation als Community gestartet wird. Die Daten werden dabei nicht gelöscht; bearbeiten und anzeigen lassen sie sich wieder, sobald `enterprise.forms` aktiviert ist.
:::
