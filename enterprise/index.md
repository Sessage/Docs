# Enterprise Edition

Die Enterprise Edition erweitert den vollständigen Community-Kern um lizenzierte Module. Sie ist kein separater Fork: Listen, Aufgaben, Berechtigungen und mobile Verträge stammen aus demselben Kern und bleiben dadurch zwischen beiden Editionen kompatibel.

## Zusätzliche Module

- **Portfolios:** verbindliche Zusammenfassung mehrerer Listen mit gemeinsamer Navigation und vererbten Rollen
- **Dashboards:** KPI-Kacheln, Diagramme und Aufgabenübersichten, einschließlich dauerhafter Portfolio-Dashboards
- **Forms:** benutzerdefinierte Listenfelder sowie interne oder öffentliche Aufgabenerfassung mit Layout, Validierung und Schutzmechanismen
- **Automatisierung:** Auslöser, Bedingungen, Aktionen und abgesicherte Webhooks
- **E-Mail-Import:** Übernahme von Nachrichten aus IMAP-Postfächern in Listen
- **Identity Governance:** Freigaben an einzelne AD-Benutzer und AD-Gruppen
- **Zentrale Administration:** lizenzierbare Capability für unternehmensweite Governance- und Verwaltungsfunktionen

Welche Module tatsächlich aktiv sind, bestimmt die signierte Lizenzdatei. Fehlende oder ungültige Enterprise-Lizenzen deaktivieren die Enterprise-Capabilities; die Community-Daten und Community-Funktionen bleiben erhalten.

## Architektur

```text
TodoSuite.Enterprise.Server
  └─ TodoSuite.Enterprise.Modules
       └─ Community
            └─ TodoSuite.Community.Shared
```

Der Enterprise-Host enthält nur die Produktkomposition. Fachliche Erweiterungen liegen in den Enterprise-Modulen, während Community keine Enterprise-Implementierungen referenziert.

## Weiterführende Seiten

- [Community vs. Enterprise](../editionen.md)
- [Portfolios und Dashboards](./portfolios-dashboards.md)
- [Formulare](./formulare.md)
- [Automatisierung und Webhooks](../automatisierung.md)
- [E-Mail-Import](./email-import.md)
- [AD-Verzeichnisfreigaben](./verzeichnisfreigaben.md)
- [Enterprise installieren und lizenzieren](./installation.md)
