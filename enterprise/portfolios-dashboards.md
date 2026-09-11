# Portfolios und Dashboards

## Portfolios

Ein Portfolio ist eine dauerhafte, listenübergreifende Sammlung. Es erscheint in der Navigation ähnlich wie eine Gruppe: Die enthaltenen Listen können ein- und ausgeklappt werden, während ein Klick auf den Portfolionamen das zugehörige Dashboard öffnet.

### Portfolio anlegen

1. Klicken Sie in der Navigation links neben **Neue Liste** auf das Gruppensymbol.
2. Geben Sie einen Namen ein.
3. Aktivieren Sie **Als Portfolio mit Dashboard erstellen**.
4. Bestätigen Sie mit **Anlegen**.

![Dialog zum Anlegen einer Gruppe als Portfolio](/images/enterprise/portfolio-anlegen.png)

*Ohne aktivierte Option entsteht eine normale Navigationsgruppe. Ein Portfolio erhält zusätzlich eine dauerhaft erreichbare Dashboard-Seite.*

Listen werden fachlich einem Portfolio zugeordnet. Dadurch erscheinen sie bei freigegebenen Portfolio-Mitgliedern unterhalb des Portfolios und nicht zusätzlich als lose geteilte Listen.

Öffnen Sie am Portfolio das Menü **Optionen** und wählen Sie **Listen hinzufügen/entfernen**. Markieren Sie vorhandene Listen oder legen Sie über das Eingabefeld direkt eine neue Liste im Portfolio an.

![Dialog zum Hinzufügen und Entfernen von Listen in einem Portfolio](/images/enterprise/portfolio-listen-verwalten.png)

*Mit **Fertig** schließen Sie die Zuordnung ab. Die Listen erscheinen anschließend eingerückt unterhalb des Portfolios.*

![Portfolio mit aufgeklappten Listen in der Navigation](/images/enterprise/portfolio-navigation.png)

## Rollen und Vererbung

Portfoliofreigaben verwenden dieselben Rollen wie Listen:

- **Admin:** verwaltet Portfolio, Mitglieder und enthaltene Listen.
- **Mitglied:** arbeitet aktiv in den enthaltenen Listen.
- **Beobachter:** erhält lesenden beziehungsweise eingeschränkten Zugriff.

Die Portfolio-Rolle wird an die enthaltenen Listen vererbt. Eine davon unabhängige direkte Listenfreigabe bleibt erhalten. Treffen mehrere Freigabequellen zusammen, gilt die jeweils stärkste Rolle.

Auch Verzeichnis- und Direktfreigaben bleiben beim Entfernen einer Portfoliofreigabe erhalten. Wird ein bereits aktives Mitglied erneut eingeladen, behält es seinen bisherigen Zugriff, bis es die neue Einladung annimmt.

Vor einer Portfoliofreigabe prüft Sessage, ob der Portfolio-Owner bei allen enthaltenen Listen Admin ist. So kann ein Portfolio keine Liste weitergeben, für die der Portfolio-Owner selbst keine ausreichende Berechtigung besitzt.

## Portfolio teilen

Portfolios können – abhängig von den lizenzierten Modulen – geteilt werden über:

- E-Mail-Einladung,
- Share-Link,
- AD-Benutzer oder AD-Gruppe im Tab **Verzeichnis**.

Direkte Freigaben einzelner Listen bleiben davon unberührt.

Klicken Sie oben im Portfolio-Dashboard auf **Portfolio teilen**. Im Tab **Per E-Mail** wählen Sie Empfänger und Rolle aus.

![Portfolio-Teilen-Dialog im Tab Per E-Mail](/images/enterprise/portfolio-teilen-email.png)

Alternativ erzeugen Sie im Tab **Per Link** einen widerrufbaren Share-Link mit festgelegter Rolle und optionalem Kommentar.

E-Mail-Einladungen und Share-Links sind 30 Tage gültig. Kann eine bereits gespeicherte Einladung vorübergehend nicht per E-Mail versendet werden, zeigt Sessage den gespeicherten Link an, damit kein zweiter, doppelter Einladungsdatensatz erforderlich ist.

![Portfolio-Teilen-Dialog im Tab Per Link](/images/enterprise/portfolio-teilen-link.png)

Im Enterprise-Produkt steht zusätzlich der Tab **Verzeichnis** zur Verfügung. Dort suchen Sie einzelne AD-Benutzer oder AD-Gruppen und weisen ihnen eine Portfolio-Rolle zu. Die Rolle wird wie andere Portfoliofreigaben an die enthaltenen Listen vererbt.

![Portfolio-Teilen-Dialog im Tab Verzeichnis](/images/enterprise/verzeichnisfreigabe-portfolio.png)

## Dashboards

Dashboards stellen Listen- oder Portfolioinformationen als KPI-Kacheln, Status- und Prioritätsdiagramme sowie Aufgabenübersichten dar. Ein Portfolio besitzt eine dauerhafte Dashboard-Seite, die über seinen Namen in der Navigation geöffnet wird. Über die Ansichtsauswahl wechseln Sie zwischen **Aufgaben**, **Kalender**, **Zeitleiste** und **Prioritäten-Matrix**; Filter und Sortierung gelten dabei weiterhin für denselben Datenbestand.

![Portfolio-Dashboard mit Kennzahlen, Diagrammen und Aufgaben aus den enthaltenen Listen](/images/enterprise/portfolio-dashboard.png)

*Klicken Sie auf den Portfolionamen, um diese Übersicht zu öffnen. **Filter**, **Sortierung**, **Widgets anpassen** und **Export** befinden sich in der oberen Aktionsleiste.*

Über den Navigationspunkt **Dashboards** erreichen Sie zusätzlich frei konfigurierbare Dashboards außerhalb eines Portfolios.

![Konfigurierbares Enterprise-Dashboard](/images/enterprise/dashboards-uebersicht.png)

Mit **Widgets anpassen** blenden Sie Bausteine ein oder aus und verändern deren Reihenfolge.

![Dialog zum Anpassen der Dashboard-Widgets](/images/enterprise/dashboard-widgets.png)

Persönliche Dashboards speichern Name, Listenauswahl, Gruppierung, Sortierung, Filter und Widgetreihenfolge automatisch. Das Portfolio-Dashboard übernimmt Name und Listen fest aus dem Portfolio; Portfolio-Admins können dessen Filter, Gruppierung, Sortierung und Widgets konfigurieren. Mehrere ausgewählte Fälligkeitszeiträume werden als Alternativen kombiniert, beispielsweise **Überfällig oder nächste Woche**.

### Zeitleiste

Die Zeitleiste verbindet die Aufgaben aus allen ausgewählten beziehungsweise im Portfolio enthaltenen Listen. Zeiträume werden als Balken, einzelne Termine als Meilensteine dargestellt. Sie können nach Aufgaben oder Bearbeitern gruppieren, zu **Heute** springen und zwischen Tagen, Wochen und Monaten wechseln.

![Listenübergreifende Dashboard-Zeitleiste im Wochenmaßstab](/images/enterprise/dashboard-zeitleiste.png)

Aufgaben mit Schreibrecht können direkt in der Zeitleiste verschoben, am Anfang oder Ende verlängert und zwischen Zeitraum und Meilenstein umgewandelt werden. Die Dashboard-Ansicht legt keine Aufgabe ohne eindeutige Ursprungsliste neu an und verändert auch nicht deren Reihenfolge. Aufgaben aus nur lesbaren Listen bleiben sichtbar, ihre Termine sind jedoch geschützt.

### Prioritäten-Matrix

Die Eisenhower-Matrix ordnet ausschließlich offene Aufgaben nach Wichtigkeit und Fälligkeit ein:

1. **Dringend und wichtig – Sofort erledigen:** wichtig und heute fällig oder überfällig.
2. **Wichtig, nicht dringend – Einplanen:** wichtig und erst später fällig oder ohne Fälligkeit.
3. **Dringend, nicht wichtig – Delegieren:** nicht wichtig und heute fällig oder überfällig.
4. **Nicht dringend und nicht wichtig – Eliminieren:** nicht wichtig und später fällig oder ohne Fälligkeit.

![Interaktive Prioritäten-Matrix eines Dashboards](/images/enterprise/dashboard-prioritaeten-matrix.png)

Ziehen Sie eine Aufgabe auf einen Quadranten oder wählen Sie die Zielaktion in der Karte. Sessage passt Wichtigkeit und Termin konsistent an:

- **Sofort erledigen** setzt den Stern und bei Bedarf die Fälligkeit auf heute.
- **Einplanen** setzt den Stern und bei Bedarf die Fälligkeit auf heute plus sieben Tage.
- **Delegieren** entfernt den Stern und setzt bei Bedarf die Fälligkeit auf heute.
- **Eliminieren** entfernt Stern, Startdatum und Fälligkeit. Die Aufgabe wird dadurch nicht gelöscht.

Vorhandene passende Termine bleiben erhalten. Falls ein Startdatum nach dem neu gesetzten Fälligkeitsdatum liegen würde, wird es auf einen gültigen Wert korrigiert. Erledigte Aufgaben erscheinen nicht in der Matrix. Beobachter sehen Aufgaben weiterhin, können sie aber weder ziehen noch über die Auswahl verschieben.

Im Portfolio-Dashboard funktioniert dieselbe Matrix für alle enthaltenen Listen. Die Karten zeigen mit **Aus Liste: …** eindeutig ihre Herkunft.

![Prioritäten-Matrix eines Portfolio-Dashboards](/images/enterprise/portfolio-prioritaeten-matrix.png)

Auf schmalen Bildschirmen werden die vier Quadranten untereinander angeordnet. Auswahlfelder bleiben als Alternative zu Drag-and-drop verfügbar.

![Prioritäten-Matrix in der mobilen Darstellung](/images/enterprise/dashboard-prioritaeten-matrix-mobile.png)

### Gemeinsame Aktualisierung

Aufgabenänderungen aus anderen Browsern oder der mobilen App werden in Aufgabenansicht, Kalender, Zeitleiste und Prioritäten-Matrix automatisch übernommen. Während ein Aufgabendialog oder eine lokale Dashboard-Konfiguration gespeichert wird, schützt Sessage den lokalen Bearbeitungsstand und holt zurückgestellte Aktualisierungen anschließend nach.

Ändert ein Portfolio-Admin Filter, Gruppierung, Sortierung oder Widgets, erhalten andere Portfolio-Mitglieder den neuen Stand ebenfalls. Entzogene Listen- oder Portfoliofreigaben verschwinden nach der Aktualisierung aus Navigation und Dashboard.

Dashboard- und Portfolioverwaltung benötigen in der mobilen App eine Online-Verbindung. Verbindungs- und Serverfehler werden angezeigt und können erneut geladen werden, statt als leeres Dashboard interpretiert zu werden.

Typische Einsatzfälle sind Projektportfolios, Bereichsübersichten, Statusberichte und listenübergreifende Arbeitsvorräte.
