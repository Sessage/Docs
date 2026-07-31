# Dokumentation beitragen

`Sessage/Docs` ist ein automatisch erzeugter Veröffentlichungsspiegel des Ordners `docs/` aus dem zentralen Sessage-Monorepo. Direkte Änderungen können beim nächsten Abgleich überschrieben werden.

Dokumentationsänderungen werden deshalb im Monorepo vorgenommen, dort zusammen mit der zugehörigen Produktversion geprüft und anschließend automatisiert gespiegelt. Jeder neue Stand auf `main` wird in diesem Repository erneut mit VitePress gebaut und über GitHub Pages unter `https://docs.sessage.com` veröffentlicht.

Der Pages-Workflow ist ebenfalls Teil des erzeugten Spiegels. Korrekturen an Dokumentation oder Veröffentlichung erfolgen daher immer im Monorepo und nicht direkt in `Sessage/Docs`.
