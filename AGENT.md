# Pokédex Explorer — agent entry
Summary: Static Pokédex on PokéAPI (no key). Browse/search/filter Pokémon, detail view with stats and evolution chains. Vanilla HTML/CSS/JS, no build step.
Core feature: A paginated, searchable, type-filterable Pokédex with cached detail views and evolution chains.
Read first: `brain/00-START-HERE.md`, then `brain/PRD.md` and `brain/ARCHITECTURE.md`.
Hard rules: design tokens only (see brain/DESIGN.md); no API keys anywhere (the API is keyless); every change is logged in `brain/changes/` (changelog + session file).
Commands: open `index.html`, or `python3 -m http.server` then visit http://localhost:8000 . Syntax check: `node --check app.js`.
