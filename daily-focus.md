# Mein Tag: persönliche Tagesplanung

**Mein Tag** bündelt Ihre persönliche Auswahl aus allen zugänglichen Listen. Aufgaben bleiben in ihrer Ursprungsliste und behalten dort Zuständigkeit, Termine und Freigaben.

![Mein Tag mit ausgewählter Aufgabe und sichtbarer Listenherkunft](/images/community/mein-tag.png)

Unter jedem Aufgabentitel zeigt **Aus Liste: …** die Herkunft an. Das Sonnensymbol fügt eine einzelne Aufgabe zum Tagesplan hinzu oder entfernt sie wieder; der Stern markiert weiterhin die Wichtigkeit.

## Aufgaben für heute auswählen

- **Vorschläge für heute** priorisiert offene, überfällige, heute fällige und wichtige Aufgaben.
- **Aufgaben auswählen** durchsucht die zugänglichen Ursprungslisten.
- **Mehrfachauswahl** fügt mehrere Aufgaben gemeinsam hinzu oder entfernt sie gemeinsam.
- Die Auswahlaktionen stehen auch in **Aufgaben** sowie in Listen-, Tabellen-, Kanban- und Zeitleistenansichten zur Verfügung.

Sessage empfiehlt 3 bis 7 Aufgaben, erlaubt aber eine größere persönliche Auswahl. Pro Mehrfachänderung können bis zu 500 Aufgaben verarbeitet werden.

![Listenübergreifende Ansicht Aufgaben mit Mein-Tag-Symbol und Listenherkunft](/images/community/aufgaben.png)

## Was sich täglich ändert

Die Auswahl gilt für das angezeigte lokale Kalenderdatum. Am nächsten Tag beginnt **Mein Tag** leer; die Aufgaben selbst bleiben unverändert in ihren Listen. Das Datum und der Tageswechsel berücksichtigen die im Konto gespeicherte Zeitzone einschließlich Sommerzeit.

Beim ersten Einsatz übernimmt Sessage die Gerätezeitzone für das Konto. Weitere Geräte verwenden anschließend dieselbe Einstellung. Verspätete Antworten eines vorherigen Tages werden nicht auf den neuen Tagesplan übertragen.

## Zusammenarbeit und Synchronisierung

Ändert eine andere Person eine freigegebene Aufgabe, aktualisieren sich **Mein Tag** und **Aufgaben** automatisch. Das gilt auch für Umbenennen, Termine, Wichtigkeit, Kommentare, Anhänge, Verschieben und Löschen. Ein geöffneter Aufgabendialog schützt nicht gespeicherte Eingaben und übernimmt externe Änderungen erst, wenn dadurch kein lokaler Entwurf überschrieben wird.

Ihre Mein-Tag-Auswahl wird kontoübergreifend zwischen Web und Mobile synchronisiert. Nach einer unterbrochenen Verbindung wird der bestätigte Serverstand erneut geladen. Fehlgeschlagene Aktionen bleiben sichtbar und können wiederholt werden; eine Mehrfachauswahl wird dabei nicht vorschnell verworfen.

Wird Ihnen der Zugriff auf eine Liste entzogen oder eine Aufgabe gelöscht, verschwindet die Aufgabe aus dem Tagesplan. Bei einer nur lesbaren Liste dürfen Sie die persönliche Mein-Tag-Auswahl weiterhin ändern, nicht jedoch die Aufgabe selbst.

## Mobile Darstellung

Auf Smartphones werden die Aktionsschaltflächen umgebrochen und die Karten einspaltig dargestellt. Über **Menü** öffnen Sie die Navigation; **Mein Tag** und **Aufgaben** verwenden dieselben Daten und Berechtigungen wie die Weboberfläche.

![Mein Tag auf einem schmalen mobilen Bildschirm](/images/community/mein-tag-mobile.png)

![Zugewiesene Aufgaben mit Listenherkunft in der mobilen Darstellung](/images/community/aufgaben-mobile.png)

## API

- `GET /api/my-day?timeZoneId=Europe%2FBerlin`
- `PUT /api/my-day/tasks/{taskId}` mit `date` (YYYY-MM-DD) und `selected`
- `PUT /api/my-day/tasks` mit `date`, `selected` und `taskIds` (1–500 IDs)

Der Benutzer wird ausschließlich aus der Anmeldung bestimmt. Jede Anfrage prüft die Leserechte auf alle betroffenen Aufgaben. Mehrfachänderungen sind atomar und idempotent: Ist eine Aufgabe nicht zugänglich, wird keine Aufgabe aus diesem Auftrag verändert.
