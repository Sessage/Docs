# Dokumentation lokal starten

Im eigenständigen Repository `Sessage/Docs` installieren Sie nach einem frischen Checkout die exakt gesperrten Abhängigkeiten und starten anschließend VitePress:

```powershell
npm ci
npm run dev
```

Im zentralen Sessage-Monorepo können dieselben Befehle aus dessen Stamm ausgeführt werden:

```powershell
npm --prefix docs ci
npm run dev
```

Alternativ wechseln Sie im Monorepo direkt in den Dokumentationsordner:

```powershell
Set-Location docs
npm run dev
```

VitePress ist anschließend standardmäßig unter `http://127.0.0.1:5173` erreichbar. Falls der Port belegt ist, wählt Vite automatisch den nächsten freien Port und zeigt die tatsächliche Adresse im Terminal an.

Weitere Befehle aus dem Monorepo-Stamm:

```powershell
npm run docs:build
npm run docs:preview
```

Im eigenständigen Docs-Repository heißen die entsprechenden Befehle `npm run build` und `npm run preview`.

## Automatische Veröffentlichung

Die produktive Nutzerdokumentation ist unter `https://docs.sessage.com` erreichbar. Der Ordner `docs/` im zentralen Monorepo ist die einzige Quelle:

1. Eine freigegebene Änderung auf `main` wird geprüft und in das öffentliche Repository `Sessage/Docs` gespiegelt.
2. Ein Workflow in `Sessage/Docs` installiert die gesperrten npm-Abhängigkeiten, baut VitePress und lädt `.vitepress/dist` als GitHub-Pages-Artefakt hoch.
3. GitHub Pages veröffentlicht das Artefakt unter der konfigurierten eigenen Domain.

Direkte Änderungen in `Sessage/Docs` sind nicht dauerhaft und können beim nächsten Spiegelungslauf überschrieben werden. Die interne Administrationsdokumentation aus `admindocs/` ist nicht Bestandteil des öffentlichen Repositorys und wird nicht auf dieser Pages-Site veröffentlicht.

## Screenshots pflegen

Im Monorepo liegen Screenshots getrennt nach Edition unter `docs/public/images/`; im eigenständigen Docs-Repository beginnt derselbe Pfad direkt mit `public/images/`:

- `docs/public/images/community/`
- `docs/public/images/enterprise/`

Verwenden Sie ausschließlich anonymisierte Beispieldaten. Zugangsdaten, Share-Link-Tokens, API-Tokens und produktive E-Mail-Adressen dürfen nicht abgebildet werden. Neue Bilder sollten direkt bei dem beschriebenen Arbeitsschritt eingebunden werden und einen aussagekräftigen Alternativtext erhalten.

Nach Änderungen an Oberfläche oder Screenshots muss `npm run docs:build` ausgeführt werden. So werden fehlende Bildpfade und fehlerhaftes Markdown frühzeitig erkannt.

## YouTube-Videos einbetten

Verwenden Sie in Markdown die globale Komponente `YouTubeVideo`. Sie lädt den Player im erweiterten Datenschutzmodus erst nach einer ausdrücklichen Einwilligung; vorher wird auch kein externes Vorschaubild abgerufen.

```md
<YouTubeVideo
  video-id="dQw4w9WgXcQ"
  title="Sessage im Überblick"
  caption="Eine kurze Einführung"
/>
```

Tragen Sie als `video-id` nur die elfstellige ID aus der YouTube-URL ein. Mit `:start="90"` kann optional eine Startzeit in Sekunden gesetzt werden. Die Einwilligung gilt für alle Videos der Dokumentationsseite und lässt sich am Seitenende über „Cookie-Einstellungen“ widerrufen.

## Sprachen

Die Dokumentation verwendet die VitePress-Sprachumschaltung für Deutsch und Englisch. Beim ersten Aufruf der Startseite wird die bevorzugte Browsersprache ausgewertet: Deutsch bleibt auf `/`, andere Sprachen werden auf `/en/` geleitet. Eine danach im Sprachmenü getroffene Auswahl wird im Browser gespeichert und hat Vorrang.

Englische Seiten liegen unter `docs/en/`. Die englische Navigation enthält die übersetzten Einstiegs- und Überblickskapitel; die vollständige technische Detailreferenz bleibt bis zu ihrer Übersetzung über die deutsche Sprachfassung erreichbar.
