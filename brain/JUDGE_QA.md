# Interviewer Q&A — Pokédex Explorer

**Q1. The list endpoint seems simple — what is the catch?**
It returns only a name and URL per Pokémon, so rendering one page of cards needs 24 detail calls — the classic N+1 problem. I batch them with `Promise.all` in chunks of 12 and cache every response permanently, so the cost is paid once per Pokémon, ever.

**Q2. Why cache in localStorage instead of just fetching fresh?**
PokéAPI's fair-use policy explicitly asks consumers to cache locally, and the data is immutable — a Pokémon's stats never change. The in-memory Map serves the session; localStorage serves repeat visits and doubles as an offline fallback.

**Q3. Walk me through the evolution chain.**
Species → `evolution_chain.url` → a nested tree of `evolves_to` children. I flatten it with DFS into display order, then reuse the same cached detail fetcher for each member's sprite. Branching chains like Eevee's work without special cases.

**Q4. How does the type filter work — is it server-side?**
No. The type endpoint returns every member's URL; I parse the ids into a Set, cache that list, and intersect it with the Pokédex's natural ordering, then paginate the result. It is a set intersection done client-side because the API has no combined query.

**Q5. What happens when I type a name that doesn't exist, or type very fast?**
Fast typing: the input is debounced 300 ms and each search carries an AbortController, so superseded requests are cancelled and can never render out of order. Non-existent name: PokéAPI returns 404, which maps to a dedicated empty state explaining the lowercase-hyphenated naming convention.
