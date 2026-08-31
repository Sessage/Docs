# API und mobile App

## Authentifizierung

Die mobile API nutzt JWT Bearer Tokens, Identity-Cookies oder Personal Access Tokens. Für mobile Clients ist der Login über die mobile Authentifizierung vorgesehen.

JWT-Schlüssel, Issuer, Audience und Laufzeit werden einmalig beim Start normalisiert und sowohl für Ausstellung als auch Validierung verwendet. Unterstützt werden die hierarchischen .NET-Schlüssel wie `Jwt__Key` sowie die kompatiblen Variablen `JWT_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE` und `JWT_EXPIRES_MINUTES`. Die Laufzeit muss zwischen 1 und 43.200 Minuten liegen. Mobile JWTs werden bei Kontosperrung, einer Änderung des Security-Stamps oder einer geänderten Adminrolle sofort abgelehnt; die App entfernt das abgewiesene Token und verlangt eine erneute Anmeldung.

Eine erfolgreiche mobile Passwortänderung liefert unmittelbar einen neuen JWT und ersetzt den durch die Security-Stamp-Änderung ungültig gewordenen Token im geschützten Profilspeicher.

Personal Access Tokens werden ausschließlich als Hash gespeichert, sind bei gesperrtem Benutzerkonto nicht verwendbar und können getrennt mit Lese- oder Schreibrechten angelegt werden. Pro Benutzer sind höchstens 100 gleichzeitig aktive Personal Access Tokens zulässig.

Token-Endpunkte liefern Fehler strukturiert zurück. Die App unterscheidet deshalb einen leeren Tokenbestand von einem Authentifizierungs-, Netzwerk- oder Serverfehler. Beim Löschen eines Benutzerkontos werden persönliche Zugriffstoken und die Profilbilddatei nach erfolgreicher Identity-Löschung bereinigt.

Chunk-Uploads beginnen immer mit einer benutzer- und aufgabengebundenen Upload-Session. Pro Benutzer sind höchstens fünf parallele Sessions zulässig; Chunks ohne gültige Session werden abgelehnt.

Im Produktionsbetrieb muss `Jwt__Key` gesetzt sein und mindestens 32 Bytes haben. Der Entwicklungswert darf nicht verwendet werden.

## Mobile Funktionen

Die API unterstützt mobile Szenarien für:

- Listen,
- Aufgaben,
- Labels,
- benutzerdefinierte Felder (Enterprise Forms),
- Kommentare,
- Anhänge,
- Navigation,
- Teilen,
- Portfolios (Enterprise),
- Dashboards,
- Papierkorb,
- Benachrichtigungen,
- Enterprise-Push-Nachrichten auf Android, iOS und Windows,
- Suche,
- Profilbilder.

Die mobile App ist für beide Editionen identisch. Nach der Anmeldung lädt sie `GET /api/capabilities` und zeigt Enterprise-Oberflächen nur an, wenn der verbundene Server die jeweilige Capability meldet. Dadurch kann derselbe App-Build mit Community- und Enterprise-Servern verwendet werden.

Der mobile Papierkorb lädt gelöschte Listen über `GET /api/mobile/trash/lists` und wiederherstellbare Aufgaben aus aktiven Listen über `GET /api/mobile/trash/tasks`. Listen beziehungsweise Aufgaben werden über `POST /api/mobile/trash/lists/{listId}/restore` und `POST /api/mobile/trash/lists/{listId}/tasks/{taskId}/restore` wiederhergestellt. Diese Operationen benötigen eine Online-Verbindung und die serverseitig erforderliche Admin- beziehungsweise Schreibberechtigung.

Enterprise ergänzt mobile Endpunkte und Oberflächen insbesondere für Portfolios, Dashboards, Formulare einschließlich benutzerdefinierter Felder, Automatisierung, E-Mail-Import und Verzeichnisfreigaben. Zugriffe auf benutzerdefinierte Felder benötigen serverseitig `enterprise.forms`; die App blendet die zugehörigen Bereiche ohne diese Capability aus.

Dashboard- und Portfolio-Endpunkte arbeiten servergebunden und benötigen eine Online-Verbindung. Der Client unterscheidet dabei einen tatsächlich leeren Bestand von Authentifizierungs-, Berechtigungs- und Serverfehlern. Portfolio-Dashboards übernehmen ihre Listen serverseitig aus der Portfoliozuordnung; nur Portfolio-Owner und -Admins dürfen ihre gespeicherte Darstellung ändern.

Die bevorzugte Listenansicht und die getrennten Sortierungen für Listen- und Kanban-Ansicht werden über `GET` und `PUT /api/mobile/lists/{listId}/view-preference` synchronisiert. Die App speichert diese Präferenz zusätzlich profilgetrennt in SQLite und legt Offline-Änderungen in die dauerhafte Sync-Warteschlange.

Administratoren erhalten bei aktiver Capability `enterprise.central-administration` zusätzlich zentrale, dauerhaft gespeicherte Richtlinien für Selbstregistrierung, Export persönlicher Daten und Selbstlöschung von Konten. Das zugehörige Audit-Protokoll erfasst Richtlinienänderungen, Benutzerverwaltung sowie Datenschutzexporte und Kontolöschungen. Beide Bereiche sind in der mobilen Administration verfügbar und serverseitig durch die Admin-Richtlinie geschützt. Der Client unterscheidet leere Benutzer- und Auditlisten von Netzwerk-, Authentifizierungs- und Serverfehlern. Die API verhindert außerdem das Löschen des eigenen Administratorkontos und das Entfernen der eigenen Administratorrolle.

Der mobile Login kann einen Passwort-Reset-Link anfordern, ohne offenzulegen, ob ein Konto existiert. Angemeldete Benutzer können ihre persönlichen Kontodaten in der App als JSON exportieren oder ihr Konto nach erneuter Passwortbestätigung dauerhaft löschen, sofern die zentralen Richtlinien dies erlauben.

Push verwendet die Capability `enterprise.push-notifications`. Geräte registrieren sich ausschließlich am verbundenen Enterprise-Server; dieser pseudonymisiert Benutzer- und Installationskennung, bevor er das zentrale Relay anspricht. Eine stabile Kennung pro App-Installation und Serverprofil verhindert, dass sich mehrere Konten auf demselben Server oder mehrere Geräte gegenseitig überschreiben. Token-Erneuerungen werden automatisch nachregistriert. Push-Öffnungsziele werden auf interne Listen-/Aufgabenrouten begrenzt und wechseln nur in ein lokal bekanntes, authentifizierbares Serverprofil.

Das mobile Benachrichtigungszentrum verwendet `GET /api/mobile/notifications` und `GET /api/mobile/notifications/unread-count`. `POST /api/mobile/notifications/{notificationId}/mark-read` markiert genau den geöffneten Eintrag, während `POST /api/mobile/notifications/mark-read` alle Einträge als gelesen markiert. Einzelne oder alle Einträge werden über `DELETE /api/mobile/notifications/{notificationId}` beziehungsweise `DELETE /api/mobile/notifications` entfernt. Sämtliche Operationen sind an den authentifizierten Benutzer gebunden.

Einladungs-QR-Codes für Listen und Portfolios können direkt in der App gescannt und angenommen werden. Das Annehmen wird stets vom Server gegen den angemeldeten Benutzer und den Einladungstoken geprüft; Enterprise-Funktionen bleiben zusätzlich an die gemeldete Capability gebunden.

## Uploads

Mobile Uploads können als Multipart, Raw, Base64 oder Chunk-Upload erfolgen. Chunk-Uploads sind an Benutzer, Liste und Aufgabe gebunden.

Die mobile App legt neue Anhänge zunächst dauerhaft im lokalen Ausgang ab. Der Base64-Endpunkt akzeptiert dafür im Request neben `fileName` und `contentBase64` eine optionale stabile `id`. Wiederholungen mit derselben ID und Aufgabe sind idempotent; die lokale Datei wird erst nach bestätigter Synchronisierung entfernt. Dadurch bleiben Uploads auch nach App-Neustart oder Verbindungsabbruch erhalten.

## Profile, Offline-Daten und Tokens

Jedes Serverprofil besitzt eine dauerhaft gespeicherte interne ID. Token, Benutzerpräferenzen, Cache und Offline-Ausgang werden damit nach Profil **und normalisierter Serveradresse** getrennt. Zwei Profile mit gleicher Bezeichnung oder demselben Benutzernamen können deshalb keine Daten miteinander teilen.

Ändern sich Serveradresse, E-Mail-Adresse oder Anmeldemodus eines Profils, entfernt die App die bisherige Authentifizierung und die zugehörigen lokalen Cache-/Ausgangsdaten. Beim Löschen eines Profils geschieht dies ebenfalls, bevor der Profileintrag entfernt wird. Noch nicht synchronisierte Änderungen müssen deshalb vor einem Profilwechsel übertragen werden.

Bearer-Tokens werden ausschließlich im geschützten Speicher des Betriebssystems abgelegt. Ist dieser vorübergehend nicht verfügbar, bleibt der Token nur für die laufende Sitzung im Arbeitsspeicher; die App schreibt ihn nicht als Klartext in SQLite. Alte Klartext-Tokens werden beim Upgrade entfernt.

Ein HTTP-401 entfernt den Token nur aus dem betroffenen Profil. Eine vom Benutzer ausgelöste Abbruchanforderung wird als Abbruch behandelt und nicht fälschlich als Serverfehler angezeigt.

## Mehrere Geräte und Konflikte

Listen und Aufgaben tragen einen serverseitigen Inhaltsstand und einen daraus abgeleiteten Synchronisationstoken. Eine Offline-Aktualisierung sendet den zuletzt bekannten Token mit. Wurde derselbe Datensatz inzwischen auf einem anderen Gerät geändert, antwortet der Server mit `409 Conflict`, statt die neuere Änderung still zu überschreiben.

Der Konflikt bleibt im Bereich **Synchronisationsänderungen** sichtbar. Dort kann der Benutzer entweder den Serverstand übernehmen und die lokale Änderung verwerfen oder den lokalen Stand bewusst erzwingen. Erzwungenes Überschreiben entfernt den alten Token und ist deshalb eine ausdrückliche Entscheidung, kein automatischer Retry. Normale temporäre Netzwerkfehler verbleiben dagegen im Ausgang und werden später erneut versucht.

Neue Offline-Entitäten und Anhänge verwenden stabile IDs. Wiederholte Übertragungen nach einem Verbindungsabbruch sind dadurch idempotent und erzeugen keine Duplikate.

Ist der Suchendpunkt nicht erreichbar, durchsucht die App die zum aktiven Profil gehörenden zwischengespeicherten Listen, Aufgabenbeschreibungen und Teilschritte. Offline-Treffer werden in der Oberfläche als Cache-Stand gekennzeichnet; ein Transportfehler erscheint daher nicht fälschlich als leeres Online-Suchergebnis.

Normale Listen können offline angelegt und bearbeitet werden. Das Erzeugen einer Liste aus einer
Vorlage erfordert dagegen eine aktive Serververbindung, weil Vorlagen bewusst nicht im normalen
Workspace-Cache gespeichert werden. Die App meldet diesen Zustand, statt ersatzweise eine leere
Liste anzulegen.

Beim Offline-Anlegen von Listen und Gruppen werden stabile IDs und die lokale Navigationsposition
gespeichert. Nur vorübergehende Transport- und Serverfehler verbleiben für einen späteren Versuch
im Ausgang. Dauerhafte Antworten wie ungültige Daten, fehlende Berechtigungen oder Konflikte werden
direkt angezeigt und nicht als vermeintlich erfolgreiche Offline-Erstellung zwischengespeichert.

Die maximale Request-Größe ist serverseitig begrenzt. In der aktuellen Konfiguration sind mobile Attachment-Anfragen bis 51 MB vorgesehen.

## Client-Kompatibilität

Sessage kann mobile Clients anhand der App-Version prüfen. Der Server kann folgende Informationen liefern:

- aktuelle Version,
- minimal unterstützte Version,
- Update-URL,
- Meldung für veraltete Clients.

Wenn eine Version nicht mehr unterstützt wird, kann die API mit `426 Upgrade Required` antworten.

## Swagger

In der Entwicklungsumgebung stellt der Server eine Swagger-Oberfläche unter `/swagger` bereit. In Produktion ist Swagger deaktiviert. Die Anleitung [Swagger und OpenAPI](./swagger.md) beschreibt den lokalen Start, die Anmeldung mit JWT oder persönlichem Zugriffstoken, das Ausführen von Anfragen und die häufigsten Fehlerbilder.



