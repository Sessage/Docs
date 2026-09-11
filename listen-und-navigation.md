# Listen und Navigation

## Listen

Listen sind die wichtigsten Container in Sessage. Sie bündeln Aufgaben und bestimmen, welche Spalten, Labels und Teilnehmer für diese Arbeit gelten. Enterprise Forms ergänzt listenbezogene benutzerdefinierte Felder und Formulare; weitere Module ergänzen Automatisierungen und E-Mail-Import.

Typische Listen sind:

- Projektlisten für zeitlich begrenzte Vorhaben.
- Prozesslisten für wiederkehrende Abläufe.
- Teamlisten für gemeinsame Arbeit einer Abteilung.
- Eingangslisten für manuelle Anfragen sowie in Enterprise für Formular- oder E-Mail-Eingänge.

![Geöffnete Liste Produktlaunch mit Aufgaben und Listenaktionen](/images/community/listenansicht.png)

*Oben finden Sie Ansicht, Filter, Sortierung, weitere Listenoptionen und **Teilen**. Neue Aufgaben werden am unteren Ende der Liste eingetragen.*

## Listen verwalten

Je nach Berechtigung können Sie Listen:

- anlegen und umbenennen,
- farblich kennzeichnen,
- kopieren,
- als Vorlage speichern,
- aus Vorlagen neu erstellen,
- beobachten,
- in Gruppen organisieren,
- sortieren,
- löschen und aus dem Papierkorb wiederherstellen,
- an andere Besitzer übergeben.

Beim Speichern als Vorlage werden nur die Listenstruktur, Spalten, Erledigt-Spalten, Labels,
Darstellung und benutzerdefinierten Felder übernommen; Aufgaben gehören nicht zur Vorlage.
Eine auf Aufgaben derselben Liste verweisende Feldauswahl wird beim Kopieren oder Erzeugen aus
einer Vorlage automatisch auf die neu entstandene Liste umgebogen. Das Erzeugen einer Liste aus
einer Vorlage benötigt in der mobilen App eine Serververbindung, da die vollständige Vorlage nicht
Teil des Offline-Arbeitsbereichs ist.

## Gruppen und Reihenfolge

Navigationsgruppen helfen, viele Listen übersichtlich zu halten. Sie können Listen in Gruppen verschieben und per Drag-and-drop sortieren. Die Sortierung betrifft die Navigation, nicht automatisch die Aufgaben innerhalb einer Liste.

Mit der Schaltfläche links neben **Neue Liste** erstellen Sie eine Gruppe. Listen lassen sich anschließend per Drag-and-drop oder über **Optionen → Listen hinzufügen/entfernen** zuordnen. In diesem Dialog kann eine neue Liste auch direkt in der Gruppe angelegt werden; sie erscheint dabei ohne zwischenzeitliche Ablage auf der obersten Navigationsebene am Ende der Gruppe.

## Standardansicht und Sortierung

Eine Liste kann mit einer bevorzugten Ansicht geöffnet werden:

- Liste
- Kanban
- Kalender
- Tabelle
- Formulare und benutzerdefinierte Felder (Enterprise Forms)

Zusätzlich kann die Sortierung angepasst werden. Verfügbare Sortierlogiken sind manuelle Reihenfolge, Wichtigkeit, Fälligkeit, Alphabet und Erstellzeitpunkt.

Ansicht sowie Listen- und Kanban-Sortierung werden pro Benutzer und Liste gespeichert. In der mobilen App bleibt die Auswahl auch offline und nach einem Neustart erhalten; ausstehende Änderungen werden bei der nächsten Verbindung mit dem Server abgeglichen. Die Tabellenansicht besitzt zusätzlich eine eigene Spaltensortierung und Spaltenfilter. Datumsfelder werden dabei chronologisch sortiert.

Der Aufgabenfilter gilt einheitlich für Liste, Kanban, Tabelle, Kalender und Zeitleiste. Optionen innerhalb derselben Gruppe – beispielsweise mehrere Fälligkeitszeiträume, Labels oder **ohne Mitglieder** zusammen mit ausgewählten Mitgliedern – werden als Alternativen behandelt. Unterschiedliche Filtergruppen werden miteinander kombiniert. Nicht mehr vorhandene Labels oder Teilnehmer werden bei einer Aktualisierung aus dem Filter entfernt.

Die Mehrfachauswahl steht Benutzern mit Schreibrecht in Liste, Kanban und Tabelle zur Verfügung. Die Aktion **Verschieben** kann die gewählten Aufgaben entweder in eine andere Spalte derselben Liste oder in eine beschreibbare andere Liste verschieben. Für die Zielliste wird anschließend eine ihrer Spalten gewählt; deren Konfiguration bestimmt auch den Offen-/Erledigt-Status. Beim Filtern bleiben nur noch sichtbare Aufgaben ausgewählt. Ein Ansichtswechsel beendet die Auswahl; die bereits aktive Ansicht erneut anzuklicken verändert dagegen weder Auswahl noch geöffneten Task.

## Suche

Die globale Suche berücksichtigt zugängliche Listen sowie Titel, Beschreibungen und Teilschritte nicht gelöschter Aufgaben. Exakte Treffer und Treffer am Textanfang werden zuerst angezeigt; Listen- und Aufgabentreffer teilen sich das Ergebnislimit, damit keine Gruppe die andere verdrängt. In der mobilen App wird bei fehlender Serververbindung im profilbezogenen Workspace-Cache gesucht und dieser Offline-Stand sichtbar gekennzeichnet.

## Spalten

Spalten bilden Prozessschritte ab, zum Beispiel `Backlog`, `In Arbeit`, `Wartet`, `Fertig`. Sie werden vor allem in der Kanban-Ansicht genutzt, sind aber auch für Automatisierungen und Tabellen relevant.

Eine gut gepflegte Spaltenstruktur ist wichtig, wenn Aufgaben in Enterprise automatisch verschoben, nach Status ausgewertet oder in Dashboards gruppiert werden sollen.



