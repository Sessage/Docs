# API und mobile App

## Authentifizierung

Die mobile API nutzt JWT Bearer Tokens, Identity-Cookies oder Personal Access Tokens. Für mobile Clients ist der Login über die mobile Authentifizierung vorgesehen.

JWT-Schlüssel, Issuer, Audience und Laufzeit werden einmalig beim Start normalisiert und sowohl für Ausstellung als auch Validierung verwendet. Unterstützt werden die hierarchischen .NET-Schlüssel wie `Jwt__Key` sowie die kompatiblen Variablen `JWT_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE` und `JWT_EXPIRES_MINUTES`.

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

Enterprise ergänzt mobile Endpunkte und Oberflächen insbesondere für Portfolios, Dashboards, Formulare einschließlich benutzerdefinierter Felder, Automatisierung, E-Mail-Import und Verzeichnisfreigaben. Zugriffe auf benutzerdefinierte Felder benötigen serverseitig `enterprise.forms`; die App blendet die zugehörigen Bereiche ohne diese Capability aus.

Push verwendet die Capability `enterprise.push-notifications`. Geräte registrieren sich ausschließlich am verbundenen Enterprise-Server; dieser pseudonymisiert Benutzer- und Installationskennung, bevor er das zentrale Relay anspricht. Eine stabile Kennung pro App-Installation und Serverprofil verhindert, dass sich mehrere Konten auf demselben Server oder mehrere Geräte gegenseitig überschreiben. Token-Erneuerungen werden automatisch nachregistriert. Push-Öffnungsziele werden auf interne Listen-/Aufgabenrouten begrenzt und wechseln nur in ein lokal bekanntes, authentifizierbares Serverprofil.

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

Die maximale Request-Größe ist serverseitig begrenzt. In der aktuellen Konfiguration sind mobile Attachment-Anfragen bis 51 MB vorgesehen.

## Client-Kompatibilität

Sessage kann mobile Clients anhand der App-Version prüfen. Der Server kann folgende Informationen liefern:

- aktuelle Version,
- minimal unterstützte Version,
- Update-URL,
- Meldung für veraltete Clients.

Wenn eine Version nicht mehr unterstützt wird, kann die API mit `426 Upgrade Required` antworten.

## Swagger

In der Entwicklungsumgebung stellt der Server eine Swagger-Oberfläche unter `/swagger` bereit. In Produktion ist Swagger deaktiviert.



