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

![Portfolio-Teilen-Dialog im Tab Per Link](/images/enterprise/portfolio-teilen-link.png)

Im Enterprise-Produkt steht zusätzlich der Tab **Verzeichnis** zur Verfügung. Dort suchen Sie einzelne AD-Benutzer oder AD-Gruppen und weisen ihnen eine Portfolio-Rolle zu. Die Rolle wird wie andere Portfoliofreigaben an die enthaltenen Listen vererbt.

![Portfolio-Teilen-Dialog im Tab Verzeichnis](/images/enterprise/verzeichnisfreigabe-portfolio.png)

## Dashboards

Dashboards stellen Listen- oder Portfolioinformationen als KPI-Kacheln, Status- und Prioritätsdiagramme sowie Aufgabenübersichten dar. Ein Portfolio besitzt eine dauerhafte Dashboard-Seite, die über seinen Namen in der Navigation geöffnet wird.

![Portfolio-Dashboard mit Kennzahlen, Diagrammen und Aufgaben aus den enthaltenen Listen](/images/enterprise/portfolio-dashboard.png)

*Klicken Sie auf den Portfolionamen, um diese Übersicht zu öffnen. **Filter**, **Sortierung**, **Widgets anpassen** und **Export** befinden sich in der oberen Aktionsleiste.*

Über den Navigationspunkt **Dashboards** erreichen Sie zusätzlich frei konfigurierbare Dashboards außerhalb eines Portfolios.

![Konfigurierbares Enterprise-Dashboard](/images/enterprise/dashboards-uebersicht.png)

Mit **Widgets anpassen** blenden Sie Bausteine ein oder aus und verändern deren Reihenfolge.

![Dialog zum Anpassen der Dashboard-Widgets](/images/enterprise/dashboard-widgets.png)

Typische Einsatzfälle sind Projektportfolios, Bereichsübersichten, Statusberichte und listenübergreifende Arbeitsvorräte.
