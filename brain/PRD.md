# PRD — Pokédex Explorer

**Core feature (one sentence):** Browse, search and filter every Pokémon from PokéAPI in a fast static app whose detail views (stats, evolution chain) are cached permanently on the visitor's device.

**Problem:** Most beginner Pokédex demos fetch one Pokémon or render a static list. They break on real usage: slow typing races, 24 unbatched detail calls per page, zero caching against a free community API, and no handling for names that don't exist.

**Target user:** Recruiters and interviewers opening the live demo and trying searches/filters; fellow developers reading the code.

## Scope
**MUST** — paginated grid (24/page) with artwork + types; debounced search with AbortController; 404 empty state; type filter via type-endpoint intersection; detail view with stat bars, abilities, evolution chain; Map + localStorage caching; loading/error/empty/offline states.
**SHOULD** — favourites (localStorage), stat radar chart. (Phase 2, not built yet.)
**COULD** — team builder with type-weakness coverage from `damage_relations`; GraphQL variant. (Stretch, not planned.)

## Success criteria
- First page renders from cache on a repeat visit with zero detail requests.
- Typing a full name quickly never shows a result for a shorter prefix afterwards.
- An interviewer can be walked through the N+1 batching and DFS evolution flattening in the code in under two minutes.
