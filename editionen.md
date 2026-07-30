# Community und Enterprise im Vergleich

## Kurzfassung

**Enterprise enthält den vollständigen Community-Funktionsumfang und ergänzt ihn um lizenzierte Module.** Der Datenkern und die mobile App sind gemeinsam; ein Enterprise-Server meldet den Clients, welche zusätzlichen Funktionen aktuell freigeschaltet sind.

## Funktionsvergleich

| Funktionsbereich | Community | Enterprise |
|---|:---:|:---:|
| **Listen und normale Navigationsgruppen**<br><small>strukturieren Listen in persönlichen Arbeitsbereichen und frei benennbaren Gruppen.</small> | ✓ | ✓ |
| **Aufgaben, Schritte, Kommentare und Anhänge**<br><small>erfassen Arbeit mit Unteraufgaben, Abstimmungen und zugehörigen Dateien.</small> | ✓ | ✓ |
| **Termine, Wichtigkeit und Kartenfarben**<br><small>kennzeichnen Dringlichkeit, Fälligkeit und visuelle Priorisierung einer Aufgabe.</small> | ✓ | ✓ |
| **Listen-, Kanban-, Tabellen- und Kalenderansicht**<br><small>stellen dieselben Aufgaben passend zum jeweiligen Arbeitsablauf dar.</small> | ✓ | ✓ |
| **Labels**<br><small>Ergänzen Aufgaben um farbige Kategorien.</small> | ✓ | ✓ |
| **Listenvorlagen, Kopieren und Sortierung**<br><small>beschleunigen wiederkehrende Strukturen und organisieren Listeninhalte.</small> | ✓ | ✓ |
| **Listenfreigabe per E-Mail**<br><small>lädt Personen gezielt als Admin, Mitglied oder Beobachter in eine Liste ein.</small> | ✓ | ✓ |
| **Listenfreigabe per Share-Link**<br><small>erstellt widerrufbare Einladungslinks mit einer festgelegten Rolle.</small> | ✓ | ✓ |
| **Zuweisungen, Beobachter und Benachrichtigungen**<br><small>verteilt Verantwortlichkeiten und informiert Beteiligte über Änderungen.</small> | ✓ | ✓ |
| **Suche, Export und Papierkorb**<br><small>findet Inhalte, exportiert Daten und ermöglicht die Wiederherstellung gelöschter Elemente.</small> | ✓ | ✓ |
| **Personal Access Tokens und API**<br><small>ermöglichen authentifizierte Integrationen und automatisierten Datenzugriff.</small> | ✓ | ✓ |
| **Mobile App**<br><small>stellt die freigeschalteten Funktionen auf unterstützten Mobilgeräten bereit.</small> | ✓ | ✓ |
| **Native Push-Nachrichten**<br><small>informieren auf Android, iOS und Windows; wahlweise anonym oder mit Benachrichtigungstext und direktem Sprung zur Aufgabe.</small> | – | ✓ |
| **Lokale Benutzerkonten**<br><small>verwalten Anmeldung und Zugriff direkt innerhalb der Installation.</small> | ✓ | ✓ |
| **AD/LDAP-Anmeldung**<br><small>authentifiziert Benutzer mit vorhandenen Zugangsdaten des Unternehmensverzeichnisses.</small> | ✓ | ✓ |
| **Portfolios**<br><small>fassen mehrere Listen mit gemeinsamer Mitgliedschaft und vererbten Rollen zusammen.</small> | – | ✓ |
| **Dauerhaftes Portfolio-Dashboard**<br><small>öffnet über den Portfolionamen eine feste Übersicht aller enthaltenen Listen.</small> | – | ✓ |
| **Konfigurierbare Dashboards**<br><small>visualisieren Kennzahlen, Statusverteilungen und Aufgabenübersichten.</small> | – | ✓ |
| **Formulare und benutzerdefinierte Felder**<br><small>erweitern Aufgaben um strukturierte Listenfelder und erzeugen Aufgaben aus internen oder öffentlichen Eingabemasken.</small> | – | ✓ |
| **Automatisierungsregeln**<br><small>führen bei definierten Auslösern und Bedingungen automatisch Aktionen aus.</small> | – | ✓ |
| **Webhook-Aktionen**<br><small>übermitteln Ereignisse sicher per HTTP oder HTTPS an externe Systeme.</small> | – | ✓ |
| **E-Mail-Import**<br><small>übernimmt Nachrichten aus IMAP-Postfächern automatisch als Aufgaben.</small> | – | ✓ |
| **AD-Benutzer im Teilen-Dialog**<br><small>sucht einzelne Verzeichnisbenutzer und weist ihnen direkt eine Rolle zu.</small> | – | ✓ |
| **AD-Gruppen im Teilen-Dialog**<br><small>berechtigt ganze Verzeichnisgruppen einschließlich verschachtelter Mitgliedschaften.</small> | – | ✓ |
| **Offline prüfbare, installationsgebundene Lizenz**<br><small>validiert signierte Enterprise-Lizenzen lokal für die jeweilige Installation.</small> | nicht benötigt | ✓ |

## Was Enterprise konkret ergänzt

### Listenübergreifende Steuerung

Portfolios fassen mehrere Listen verbindlich zusammen. Mitglieder sehen die Listen unterhalb des Portfolios; Rollen werden an die enthaltenen Listen vererbt. Dashboards liefern dazu eine dauerhafte Management- und Statussicht.

### Strukturierte Prozesseingänge

Benutzerdefinierte Felder, Formulare und E-Mail-Import bilden strukturierte Prozessdaten und standardisierte Eingänge ab. Dadurch müssen Anfragen nicht ausschließlich manuell erfasst werden.

### Automatisierung und Integration

Enterprise-Regeln reagieren auf Aufgabenereignisse, prüfen Bedingungen und führen Aktionen aus. Webhooks verbinden Listenprozesse mit externen Systemen.

### Verzeichnisgestützte Berechtigungen

Community kann Benutzer gegen AD/LDAP anmelden. Enterprise geht weiter und erlaubt Admins, einzelne AD-Benutzer oder ganze AD-Gruppen direkt für Listen und Portfolios zu berechtigen.

## Lizenzabhängige Module

Eine Enterprise-Installation muss nicht zwingend jede Enterprise-Funktion enthalten. Die ausgestellte Lizenz führt die freigeschalteten Feature-IDs auf. Webserver und Mobile-App richten ihre Oberfläche nach dieser Liste aus.

| Funktionsbereich | Funktions-ID |
|---|---|
| Portfolios | `enterprise.portfolios` |
| Dashboards | `enterprise.dashboards` |
| Formulare und benutzerdefinierte Felder | `enterprise.forms` |
| Automatisierung und Webhooks | `enterprise.automation` |
| E-Mail-Import | `enterprise.email-import` |
| Zentrale Administration | `enterprise.central-administration` |
| Identity Governance / Verzeichnisfreigaben | `enterprise.identity-governance` |
| Native Push-Nachrichten | `enterprise.push-notifications` |

## Entscheidungshilfe

Wählen Sie **Community**, wenn Listen- und Aufgabenmanagement, Zusammenarbeit, AD/LDAP-Anmeldung und mobile Nutzung ausreichen.

Wählen Sie **Enterprise**, wenn Sie Listen in Portfolios steuern, Management-Dashboards benötigen, Eingänge über Formulare oder E-Mail erfassen, Abläufe automatisieren oder Berechtigungen über AD-Benutzer und -Gruppen verwalten möchten.
