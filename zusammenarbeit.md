# Zusammenarbeit und Teilen

## Rollen

Sessage unterscheidet Listenrollen:

- Admin: verwaltet Liste, Einstellungen, Teilnehmer und Struktur.
- Member: arbeitet aktiv mit Aufgaben.
- Observer: liest und verfolgt Arbeit mit eingeschränkten Bearbeitungsrechten.

Die konkrete Sichtbarkeit und Bearbeitbarkeit richtet sich nach Rolle und Listenberechtigung.

## Gemeinsames Arbeiten in Echtzeit

Änderungen an freigegebenen Listen werden über eine geschützte Echtzeitverbindung verteilt. Das umfasst Aufgaben, Spalten, Labels, Kommentare, Anhänge und relevante Listenänderungen. Aktualisiert eine andere Person eine Aufgabe, erscheint der bestätigte Stand ohne manuelles Neuladen in:

- Liste, Kanban, Tabelle, Kalender und Zeitleiste,
- **Aufgaben** und **Mein Tag**,
- persönlichen Dashboards,
- Portfolio-Dashboards einschließlich Zeitleiste und Prioritäten-Matrix.

Die Verbindung abonniert nur Listen, für die das angemeldete Konto Leserechte besitzt. Nach einem Verbindungsabbruch stellt Sessage die Verbindung und die erforderlichen Abonnements automatisch wieder her. Die mobile App verwendet dabei stets das aktuelle Zugriffstoken des aktiven Profils.

Ein geöffneter Aufgabendialog überschreibt keine noch nicht gespeicherten Eingaben. Sobald der lokale Speichervorgang abgeschlossen oder der Dialog geschlossen ist, wird ein zurückgestellter externer Stand nachgeladen. Wird eine Freigabe entzogen oder die Eigentümerschaft übertragen, aktualisieren sich Navigation und listenübergreifende Ansichten ebenfalls.

## Liste teilen

Eine Liste kann mit anderen Personen geteilt werden. Dafür gibt es Einladungen und Share-Links. Einladungen können angenommen oder widerrufen werden.

Klicken Sie innerhalb der Liste oben rechts auf **Teilen**. Im Tab **Per E-Mail** tragen Sie die Adresse ein, wählen die Rolle und bestätigen mit **Einladen**.

![Teilen-Dialog einer Liste im Tab Per E-Mail](/images/community/liste-teilen-email.png)

*Die Teilnehmerübersicht zeigt anschließend alle direkten Freigaben und deren Rollen.*

Für einen widerrufbaren Einladungslink wechseln Sie zu **Per Link**, wählen die Rolle und ergänzen optional einen internen Kommentar.

![Teilen-Dialog einer Liste im Tab Per Link](/images/community/liste-teilen-link.png)

*Mit **Link zum Teilen erstellen** erzeugen Sie den Link. Aktive Links können später in demselben Dialog verwaltet und entfernt werden.*

E-Mail-Einladungen und Share-Links gehören zum Community-Kern. Enterprise ergänzt im gemeinsamen Tab **Verzeichnis** die Suche nach einzelnen AD-Benutzern und AD-Gruppen.

Beim Teilen sollten Sie festlegen:

- welche Rolle die Person erhalten soll,
- ob die Einladung zeitlich oder organisatorisch begrenzt ist,
- ob die Person nur beobachten oder aktiv mitarbeiten soll.

## Portfolios teilen

::: info Enterprise
Portfolios und deren gemeinsame Freigaben sind ein Enterprise-Modul.
:::

Eine Portfoliofreigabe erteilt Zugriff auf das Portfolio und vererbt die gewählte Rolle an seine enthaltenen Listen. Direkte Listenfreigaben bleiben daneben bestehen. Details finden Sie unter [Portfolios und Dashboards](./enterprise/portfolios-dashboards.md).

## AD-Benutzer und AD-Gruppen

::: info Enterprise
Verzeichnisfreigaben benötigen die Capability `enterprise.identity-governance` und eine aktive AD-Konfiguration.
:::

Admins können im Teilen-Dialog nach Verzeichniseinträgen suchen und ihnen eine Rolle zuweisen. Gruppenmitgliedschaften werden bei der AD-Anmeldung synchronisiert. Weitere Hinweise stehen unter [AD-Verzeichnisfreigaben](./enterprise/verzeichnisfreigaben.md).

## Aufgaben zuweisen

Aufgaben können einer verantwortlichen Person zugewiesen werden. Zusätzlich können weitere Mitglieder an einer Aufgabe beteiligt sein.

Zuweisungen helfen bei:

- persönlichen Aufgabenübersichten,
- Benachrichtigungen,
- Teamverantwortung,
- Automatisierungsregeln.

Die Startseite **Meine zugewiesenen Aufgaben** fasst die Aufgaben aus allen zugänglichen Listen zusammen und sortiert sie nach Fälligkeit. **Aus Liste: …** kennzeichnet die Herkunft. Dabei werden die kanonische Benutzer-ID und hinterlegte E-Mail-Adresse zusammengeführt; gleichlautende Anzeigenamen gelten nicht als Identitätsnachweis. In der mobilen App wird dieselbe Auswertung auch auf dem profilbezogenen Offline-Cache ausgeführt. Wird eine geöffnete Aufgabe verschoben oder die Zuweisung entfernt, aktualisiert sich die Übersicht und verwendet anschließend die Daten der tatsächlichen Zielliste.

## Beobachten

Beobachten ist sinnvoll, wenn Sie über Änderungen informiert bleiben wollen, ohne selbst Hauptverantwortliche Person zu sein.

## Kommentare als Verlauf

Kommentare halten Entscheidungen und Rückfragen direkt an der Aufgabe fest. Das reduziert Kontextverlust und macht später nachvollziehbar, warum eine Aufgabe geändert wurde.

## Benachrichtigungen im Team

Benachrichtigungen können durch Zuweisungen, Erinnerungen, Automatisierungen oder relevante Änderungen entstehen. Im Team sollten Regeln bewusst eingesetzt werden, damit wichtige Hinweise ankommen, ohne zu überfrachten.



