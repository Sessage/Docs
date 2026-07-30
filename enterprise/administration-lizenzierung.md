# Administration und Lizenzierung

## Administration in beiden Editionen

Die grundlegende Administration gehört zum Community-Kern. Dazu zählen lokale Benutzerkonten, die Adminrolle, Registrierungseinstellungen, SMTP, AD/LDAP-Anmeldung, Personal Access Tokens sowie die Kompatibilitätsvorgaben für mobile Clients.

Enterprise ergänzt diese Basis um lizenzierte Governance-Capabilities. Die Capability `enterprise.central-administration` kennzeichnet zentrale, unternehmensweite Verwaltungs- und Richtlinienfunktionen. Welche Verwaltungsoberflächen in einer Kundeninstallation verfügbar sind, richtet sich nach der ausgelieferten Produktversion und der ausgestellten Lizenz.

## Getrennte Lizenzverwaltung

Die interne Kunden- und Lizenzverwaltung läuft als separates Produkt:

```text
TodoSuite.Licensing.Server
```

Sie verwaltet:

- Kunden,
- Kundeninstallationen,
- deren Installation-IDs,
- lizenzierte Enterprise-Capabilities,
- Laufzeiten und Limits,
- ausgestellte oder widerrufene Lizenzen.

Die Lizenzverwaltung gehört nicht in das Kundennetz und verwendet eine eigene Datenbank. Insbesondere der private ECDSA-Signaturschlüssel darf die Lizenzverwaltung nicht verlassen.

## Offline-Lizenzprüfung

Der Enterprise-Server benötigt für die Prüfung keine dauerhafte Verbindung zur Lizenzverwaltung. Er validiert lokal:

- die digitale Signatur,
- die gebundene Installation-ID,
- den Gültigkeitszeitraum,
- die freigeschalteten Feature-IDs und Limits.

Beim Austausch einer Lizenzdatei erkennt der Server den geänderten Dateizeitstempel und lädt den Lizenzstatus erneut.

## Statuswerte und Fehlersuche

Typische Ursachen deaktivierter Enterprise-Module sind:

| Status | Bedeutung |
|---|---|
| `license-missing` | Lizenzdatei fehlt |
| `public-key-missing` | öffentlicher Prüfschlüssel fehlt |
| `invalid-license` | Lizenzdokument ist ungültig |
| `license-unavailable` | Datei kann nicht gelesen oder geprüft werden |

Weitere Validierungszustände können aus Signatur, Installation-ID oder Laufzeit folgen. Prüfen Sie den authentifizierten Endpunkt `GET /api/enterprise/status` und die Serverlogs, ohne Lizenzinhalte oder Schlüssel in Supporttickets zu veröffentlichen.

## Sichere Kundenbereitstellung

An einen Kunden werden nur diese Artefakte ausgeliefert:

1. Enterprise-Anwendung beziehungsweise Containerimage,
2. öffentliche Dokumentation und Konfigurationsvorlage,
3. kundenspezifische `todosuite.license.json`,
4. `license-signing-public.pem`.

Nicht ausgeliefert werden die Lizenzverwaltungsdatenbank und der private Signaturschlüssel.
