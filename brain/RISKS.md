# Risks — Pokédex Explorer

1. **Fair-use/IP ban from unbatched traffic** → Details are fetched in Promise.all chunks of 12 and cached permanently; repeat visits make zero detail calls.
2. **PokéAPI downtime** → Cached content keeps working; uncached views show an error state with retry instead of a blank page.
3. **localStorage quota exhaustion** (~1,351 mapped details ≈ a few MB over heavy use) → Writes are try/catch-guarded; on failure the app silently falls back to the in-memory cache.
4. **Artwork CDN (GitHub raw) unavailable** → Cards still render name/id/types; broken images degrade to alt text. Acceptable, documented.
