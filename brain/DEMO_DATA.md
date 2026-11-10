# Demo data — Pokédex Explorer

- **Search:** `pikachu` (instant, cached demo favourite), `charizard`, `mr-mime` (shows hyphenated-name handling), `missingno` (shows the 404 empty state).
- **Type filter:** `fire` (109 members — note explains the endpoint fetch + intersection), `electric`.
- **Detail view:** open Bulbasaur or Charmander to show a 3-stage evolution chain; open Eevee for a branching chain (DFS order).
- **Pagination:** jump a few pages to show skeletons, then revisit page 1 to show the cache making it instant.
- **Offline demo:** load a page, toggle the browser offline, revisit — cached Pokémon still open; banner explains the state.
