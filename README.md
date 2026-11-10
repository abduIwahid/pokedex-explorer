# Pokédex Explorer

A fast, dependency-free Pokédex that browses, searches and filters all 1,300+ Pokémon with live data from PokéAPI — and demonstrates the engineering habits that separate a portfolio project from a tutorial follow-along: batching, caching, request cancellation and a real data-mapper layer.

**Live demo:** _TBD — deploy pending owner decision (GitHub Pages or Vercel static)._
Run it locally: open `index.html` in a browser, or `python3 -m http.server` in this folder and visit `http://localhost:8000`.

## Features

- **Paginated grid** — 24 Pokémon per page with official artwork, Pokédex number and type chips; Previous/Next with a page indicator.
- **Search by name** — debounced (300 ms) with `AbortController` cancellation, so fast typing never renders a stale result. Unknown names get a proper empty state that explains PokéAPI's lowercase-hyphenated naming (`mr-mime`, `ho-oh`).
- **Type filter chips** — selecting a type fetches the type endpoint once, caches its member list, and intersects it with the Pokédex ordering (set intersection) before paginating.
- **Detail view** — base stats as bars, height/weight converted to metric, abilities (hidden ones marked), and the full evolution chain rendered with sprites.
- **Full UI states** — loading skeletons, error state with retry, empty state with reset, and an offline banner.

## Engineering decisions

- **N+1 problem, handled.** The list endpoint returns only `name` + `url` per Pokémon, so a page of cards needs 24 detail calls. They are batched with `Promise.all` in chunks of 12 — never 1,000 requests at once, never one-at-a-time waterfalls.
- **Two-level caching.** Detail responses are cached in an in-memory `Map` and in `localStorage`. PokéAPI's data is immutable, so repeat visits render instantly and the API is spared repeat traffic — exactly what its fair-use policy asks for.
- **Evolution chains are trees.** The chain endpoint returns a nested tree; a small DFS flattens it into the linear order shown in the UI.
- **Mapper layer.** Raw API payloads never reach the DOM. `mapPokemon()` converts decimetres → metres, hectograms → kilograms, sorts types by slot, and derives the artwork URL from the id.
- **Request lifecycle.** Search and page loads each own an `AbortController`; starting a new request aborts the previous one, eliminating race conditions.
- **No build step, no dependencies.** Three static files. View source and everything is there.

## Attribution

Data from [PokéAPI](https://pokeapi.co) (free, no API key; local caching follows its fair-use policy). Pokémon and all Pokémon character names are trademarks of Nintendo. This is a non-commercial portfolio project.

## Trade-offs

- Card data requires one detail call per Pokémon (PokéAPI offers no bulk-detail endpoint) — mitigated by batching + permanent local caching rather than eliminated.
- Type filtering loads the type's full member list (up to ~240 ids) instead of filtering server-side; acceptable at this scale and cacheable forever.
- GraphQL endpoint intentionally not used: it is beta, rate-limited to 100 calls/hour per IP, and may change without notice.
