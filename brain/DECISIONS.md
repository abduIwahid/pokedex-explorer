# Decisions — Pokédex Explorer

## ADR-1 — Vanilla JS, no build step (2026-11-10)
Options: React/Vite SPA vs three static files. Chose static files: the app is a single view with local state; a framework adds a toolchain without adding capability, and "view source" transparency is itself a portfolio signal. Trade-off: manual DOM code is longer.

## ADR-2 — No API key strategy needed (2026-11-10)
PokéAPI is keyless. The security-relevant decision is the opposite one: never proxy or hide anything — there is nothing to hide. If a keyed API is ever added, the rule is runtime entry + localStorage, never a hardcoded key.

## ADR-3 — Permanent two-level caching (2026-11-10)
Options: no cache, memory-only, memory + localStorage. Chose memory + localStorage because PokéAPI data is immutable and its fair-use policy explicitly asks for local caching. localStorage writes are wrapped in try/catch so a full quota degrades to session caching instead of an error.
