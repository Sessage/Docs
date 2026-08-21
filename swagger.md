# Swagger und OpenAPI

Das Server-Projekt stellt in der Entwicklungsumgebung eine interaktive Swagger-Oberfläche für die REST-API bereit. Sie zeigt die verfügbaren Endpunkte, Parameter, Request- und Response-Schemas und kann Anfragen direkt an den laufenden Server senden. Community und Enterprise verwenden dieselbe Swagger-Konfiguration; Enterprise ergänzt die API abhängig von den lizenzierten Capabilities.

## Veröffentlichte API-Referenz

Die folgende Referenz wird zusammen mit dieser Dokumentation veröffentlicht. Sie enthält Routen, Parameter und Datenmodelle der gemeinsamen Server-API. Die Ansicht ist absichtlich schreibgeschützt und sendet keine Anfragen. Zum Testen verwenden Sie einen lokal gestarteten Community- oder Enterprise-Server wie im nächsten Abschnitt beschrieben.

<SwaggerViewer />

::: warning Nur für Entwicklung
Swagger wird ausschließlich bei `ASPNETCORE_ENVIRONMENT=Development` registriert. In Produktion sind sowohl die Oberfläche als auch das OpenAPI-Dokument deaktiviert. Aktivieren Sie die Entwicklungsumgebung nicht auf einem öffentlich erreichbaren Produktivsystem, nur um Swagger verfügbar zu machen.
:::

## Server mit Swagger starten

Starten Sie aus dem Stamm des Monorepos die gewünschte Edition:

::: code-group

```powershell [Community]
dotnet run --project .\Community\TodoSuite.Community.csproj --launch-profile https
```

```powershell [Enterprise]
dotnet run --project .\TodoSuite.Enterprise.Server\TodoSuite.Enterprise.Server.csproj --launch-profile "Enterprise (lokales PostgreSQL)"
```

:::

Die Startprofile setzen `ASPNETCORE_ENVIRONMENT` auf `Development`. **Enterprise (lokales PostgreSQL)** verwendet `localhost:5432`; für den vorbereiteten Container auf Port `55432` wählen Sie stattdessen **Enterprise (Docker PostgreSQL)**. Die tatsächlich gebundenen Adressen gibt der Server beim Start im Terminal aus.

Öffnen Sie anschließend die passende Adresse:

| Edition | Swagger UI | OpenAPI-Dokument |
| --- | --- | --- |
| Community | `https://localhost:7000/swagger` | `https://localhost:7000/swagger/v1/swagger.json` |
| Enterprise | `https://localhost:7285/swagger` | `https://localhost:7285/swagger/v1/swagger.json` |

Alternativ funktionieren die HTTP-Adressen `http://localhost:5262/swagger` für Community und `http://localhost:5285/swagger` für Enterprise. Bei HTTPS kann der Browser beim ersten lokalen Start eine Warnung zum .NET-Entwicklungszertifikat anzeigen.

## Einen Endpunkt ausführen

1. Klappen Sie in Swagger UI einen Endpunkt auf.
2. Wählen Sie **Try it out**.
3. Tragen Sie Pfad-, Query- oder Body-Werte ein.
4. Wählen Sie **Execute**.
5. Prüfen Sie unter **Responses** den Statuscode, die Response-Header und den Response-Body. Swagger zeigt außerdem einen entsprechenden `curl`-Aufruf an.

Die in Swagger dargestellten Models werden aus den .NET-Typen und den XML-Kommentaren des Debug-Builds erzeugt. Das OpenAPI-Dokument unter `/swagger/v1/swagger.json` kann auch von API-Clients oder Generatoren eingelesen werden.

Die mit dieser Dokumentation veröffentlichte statische Fassung ist unter [`/openapi/sessage-v1.json`](/openapi/sessage-v1.json) verfügbar. Sie beschreibt die gemeinsame API-Oberfläche, enthält aber weder Enterprise-Implementierungscode noch Zugangsdaten oder Serverkonfigurationen.

## Authentifizierung mit einem JWT

Die meisten Endpunkte erfordern eine Anmeldung. Ein JWT kann direkt über Swagger angefordert werden:

1. Öffnen Sie `POST /api/mobile/auth/login`.
2. Wählen Sie **Try it out** und senden Sie beispielsweise:

   ```json
   {
     "email": "benutzer@example.com",
     "password": "ihr-passwort",
     "useAd": false
   }
   ```

   Setzen Sie `useAd` auf `true`, wenn die Anmeldung über das konfigurierte AD/LDAP erfolgen soll. In diesem Fall enthält `email` den konfigurierten Verzeichnis-Anmeldenamen.

3. Kopieren Sie aus der erfolgreichen Antwort den Wert von `token`.
4. Wählen Sie oben in Swagger **Authorize**.
5. Tragen Sie nur den Token ein. Swagger erzeugt daraus den Header `Authorization: Bearer <token>`.
6. Schließen Sie den Dialog. Geschützte Endpunkte können nun über **Try it out** aufgerufen werden.

Wenn die Zwei-Faktor-Authentifizierung aktiv ist, liefert der erste Login keinen JWT, sondern `requiresTwoFactor: true` und einen `twoFactorChallenge`-Wert. Senden Sie diesen zusammen mit dem aktuellen Authenticator-Code an `POST /api/mobile/auth/login-2fa`. Verwenden Sie anschließend den `token` aus dieser Antwort im **Authorize**-Dialog.

## Authentifizierung mit einem persönlichen Zugriffstoken

Für wiederholbare Tests und Integrationen kann statt eines kurzlebigen JWT ein persönlicher Zugriffstoken verwendet werden:

1. Melden Sie sich in der Webanwendung an.
2. Öffnen Sie `/access-tokens` auf derselben Serveradresse.
3. Erstellen Sie einen getrennten Token für den vorgesehenen Zweck und wählen Sie **Nur Lesen**, wenn keine Änderungen erforderlich sind.
4. Kopieren Sie den Token sofort. Er wird nur einmal vollständig angezeigt.
5. Tragen Sie ihn in Swagger über **Authorize** genauso wie einen JWT ein.

Persönliche Zugriffstoken beginnen mit `tsa_`, laufen nach der serverseitig konfigurierten Gültigkeitsdauer ab und besitzen dieselben fachlichen Berechtigungen wie das zugehörige Benutzerkonto. Ein schreibgeschützter Token erhält bei `POST`-, `PUT`-, `PATCH`- und `DELETE`-Anfragen an `/api` den Status `403 Forbidden`.

::: danger Token schützen
JWTs und persönliche Zugriffstoken sind Zugangsdaten. Übernehmen Sie echte Tokens nicht in Quellcode, Screenshots, Tickets oder Logs. Verwenden Sie für Integrationen einen eigenen Token pro Zweck und widerrufen Sie ihn, sobald er nicht mehr benötigt wird.
:::

## Statuscodes einordnen

| Status | Bedeutung im typischen API-Aufruf |
| --- | --- |
| `200 OK` / `201 Created` / `204 No Content` | Die Anfrage wurde erfolgreich verarbeitet. Nicht jede erfolgreiche Antwort enthält einen Body. |
| `400 Bad Request` | Request-Body oder Parameter sind ungültig. Beachten Sie die Validierungsdetails in der Antwort. |
| `401 Unauthorized` | Token fehlt, ist ungültig oder abgelaufen. Melden Sie sich erneut an oder ersetzen Sie den Token. |
| `403 Forbidden` | Die Anmeldung ist gültig, aber Rolle, Listenberechtigung, Capability oder Schreibrecht fehlen. |
| `404 Not Found` | Route oder angeforderte Ressource wurde nicht gefunden beziehungsweise ist für das Konto nicht sichtbar. |
| `409 Conflict` | Der gesendete Synchronisationsstand ist veraltet. Laden Sie den aktuellen Serverstand und lösen Sie den Konflikt bewusst. |
| `426 Upgrade Required` | Die angegebene mobile Client-Version wird nicht mehr unterstützt. |
| `429 Too Many Requests` | Das Rate-Limit wurde überschritten, beispielsweise durch wiederholte Anmeldeversuche. Warten Sie entsprechend dem `Retry-After`-Header. |

## Häufige Probleme

### `/swagger` liefert 404

Prüfen Sie die Ausgabe beim Serverstart und den Wert von `ASPNETCORE_ENVIRONMENT`. Swagger existiert nur bei `Development`. Achten Sie außerdem darauf, Port und Protokoll des tatsächlich gestarteten Profils zu verwenden.

### Der Browser meldet ein ungültiges Zertifikat

Vertrauen Sie für lokale Entwicklung dem .NET-Entwicklungszertifikat:

```powershell
dotnet dev-certs https --trust
```

Alternativ können Sie lokal die oben genannte HTTP-Adresse verwenden. Produktive Zertifikatsfehler dürfen nicht auf diese Weise umgangen werden.

### Ein geschützter Endpunkt antwortet mit 401

Öffnen Sie **Authorize** erneut und prüfen Sie, ob der reine Tokenwert ohne Anführungszeichen eingetragen wurde. Fordern Sie bei einem abgelaufenen JWT über den Login-Endpunkt einen neuen Token an.

### Ein Endpunkt antwortet mit 403

Prüfen Sie die Berechtigungen des Benutzerkontos, die Mitgliedschaft in der betroffenen Liste und bei Enterprise-Endpunkten die erforderliche Capability. Bei einem persönlichen Zugriffstoken muss für schreibende Anfragen außerdem **Lesen und Schreiben** erlaubt sein.

### Enterprise-Endpunkte fehlen oder sind nicht verfügbar

Community und Enterprise teilen sich die Kern-API. Enterprise-Funktionen sind zusätzlich von geladenen Modulen und der Lizenz abhängig. Mit `GET /api/capabilities` können Sie nach der Anmeldung prüfen, welche Funktionen der laufende Server meldet.
