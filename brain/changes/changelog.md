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

- **Change:** Frontend v2 — warm-ink header + hero ("Every Pokémon. One clean dex."), Poké-ball SVG brand mark + favicon, Sora/Inter/JetBrains Mono type system, Seen counter promoted to a red mono pill, staggered card entrances, card hover lift + artwork zoom, modal fade/rise with growing stat bars, SVG evolution arrow (was a → glyph), designed dark footer, fluid clamp() spacing, radius 14/18px → **Reason:** owner's frontend-improvement round, one repo at a time, same premium bar as DevMetric v2/v3 but this app's own playful identity → **Affected Area:** `index.html`, `styles.css`, `app.js` (render hooks only), `README.md` → **Status:** Verified rendered at 1280 + 414 with real PokéAPI payloads via network-layer mocks (24 cards, 19 filter chips, "Seen 0 of 1351", no overflow); Pages confirmed ON for this repo (200) — owner has apparently enabled it as well. PUSH STATUS: the v2 push's approval card expired while the owner was away (~08:25); the action was NOT performed — repo still at 01816f1; retry pending his tap.
- **Change:** Real bug fixed — global `[hidden] { display: none !important; }`: the detail overlay's `display:flex` defeated the `hidden` attribute, so an empty modal shell + Close button sat over the page from first load → **Reason:** found in the v2 verification render; latent since v1 → **Affected Area:** `styles.css` → **Status:** Fixed before push; re-render confirms a clean page.
- **Change:** README live-demo line — TBD replaced with the real Pages URL → **Affected Area:** `README.md`.
