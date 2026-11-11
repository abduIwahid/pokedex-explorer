# Changelog — Pokédex Explorer

Format: Change → Reason → Affected Area → Impact → Status.

## 2026-11-10 — Project initialized + Phase 1 MVP built
- **Change:** Created the full static app (index.html, styles.css, app.js), README, AGENT.md and this brain.
- **Reason:** Portfolio project #1 from the "5 Free APIs → 5 Portfolio Projects" guide; demonstrates batching, caching and request cancellation against a real keyless API.
- **Affected Area:** Entire repo (new).
- **Impact:** Paginated/searchable/filterable Pokédex with detail + evolution views runs from static files; not yet deployed.
- **Status:** Verified — `node --check app.js` passes; API field names confirmed against live PokéAPI responses.

- **Change:** Seen collection — opening a Pokémon's detail marks it Seen (badge on its card, "Seen N of total" counter in the header, persisted in localStorage) → **Reason:** owner asked for the repos to look genuinely worked on; a collection mechanic is the Pokédex's natural signature feature → **Affected Area:** `app.js`, `index.html`, `styles.css` → **Status:** Verified locally (node --check; logic exercised against live PokéAPI mapper output).
- **Change:** First-person About section in the app + README author byline and Seen feature entry → **Reason:** the repo should read as its author's own project → **Affected Area:** `index.html`, `styles.css`, `README.md` → **Status:** Verified locally.
