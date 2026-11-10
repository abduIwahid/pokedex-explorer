# API spec — PokéAPI (https://pokeapi.co/api/v2)

No authentication. No documented hard rate limit; the fair-use policy requires local caching and bans abusive traffic from an IP.

| Endpoint | Used for | Response fields consumed |
|---|---|---|
| `GET /pokemon?limit=24&offset=N` | Page reference list | `count`, `results[].name`, `results[].url` (id parsed from URL tail) |
| `GET /pokemon/{id or name}` | Card data + detail view | `id`, `name`, `types[].type.name` (+`slot`), `stats[].base_stat`, `stats[].stat.name`, `height`, `weight`, `abilities[].ability.name`, `abilities[].is_hidden`, `species.url` |
| `GET /type/{name}` | Type filter | `pokemon[].pokemon.url` → member id set |
| `GET /pokemon-species/{id}` | Evolution link | `evolution_chain.url` |
| `GET /evolution-chain/{id}` | Evolution view | `chain.species.name`, `chain.evolves_to[]` (recursive) |

Sprites are not fetched from the API: artwork URL is derived as `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`.

**Errors:** unknown Pokémon name → HTTP 404 with plain-text body (handled as the search empty state). Network failure → error state with retry.

**Verified live 2026-11-10:** list count 1351; detail field names confirmed against Pikachu; type/fire returns 109 members in `pokemon[].pokemon` shape.
