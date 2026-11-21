# Design — Pokédex Explorer

**Direction (v2, 2026-11-11):** the playful sibling of the series — warm
ink (#12100E) header + hero over the warm off-white data surface, Pokédex
red as the one accent, Poké-ball as the brand mark (drawn in SVG: red top,
white bottom, centre button — the most recognisable silhouette in the
franchise, no image asset needed). Solid colours only: no gradients, no
glassmorphism, no glow. Type chips keep their small categorical colours
because they encode data (the type), not decoration.

**Tokens (as used in styles.css):**
- `--bg: #FAFAF8` · `--surface: #FFFFFF` · `--surface-alt: #F1EFE9`
- `--ink: #12100E` · `--text: #1A1A1A` · `--text-muted: #5A5A54`
- `--border: #DDD9CF` · `--border-strong: #C9C4B4`
- `--accent: #C62828` · `--accent-dark: #8E1414` · `--accent-soft: #FBEAEA`
- `--danger: #B3261E` · `--focus: #1A56C4`
- `--radius: 14px` · `--radius-lg: 18px` · soft layered shadows

**Typography:** Sora (display: brand name, hero, headings) · Inter (UI) ·
JetBrains Mono (Pokédex numbers: #id, Seen counter). Fluid clamp()
sizes; headers never wrap.

**Motion (v2):** hero entrance (title, sub — staggered); cards rise-in
with a per-card stagger (capped at 15) on every page render; hover —
cards lift −4px with a deeper shadow and the artwork scales 1.07;
chips lift on hover; the ball mark tilts on brand hover; the detail
modal fades + rises in, and its stat bars grow (scaleX) with a small
per-stat stagger; evolution arrow is an SVG icon. Everything is
disabled under prefers-reduced-motion.

**Seen collection (signature):** the header counter is now a red pill in
JetBrains Mono ("Seen N of 1,351") — the collection is visible from the
first pixel, not a footnote. Card badge unchanged in behaviour.

**Footer (v2):** designed dark band in the site ink — Poké-ball mark +
wordmark, the PokéAPI attribution note (unchanged wording), GitHub /
site / source links, and a base line. Replaces the one-line footer.

**Component states:**
- Card: default / hover (lift + accent border + artwork zoom) /
  focus-visible (3px focus outline) — cards are real `<button>`s.
- Chip: default / hover / `aria-pressed=true` (inverted ink).
- Skeleton: alt-surface blocks while a page loads.
- Empty / error / offline: dedicated boxes + banner, each with a
  recovery action (reset / retry).
- Modal: dialog role, Escape and backdrop click close it.
- Global `[hidden] { display: none !important; }` guard (v2 fix): the
  overlay's `display:flex` used to defeat the `hidden` attribute, a
  latent bug the v1 stylesheet carried; now structural.

**Responsive:** grid is `auto-fill minmax(150px, 1fr)` (132px under
480px); controls wrap; fluid spacing; verified rendered at 1280 + 414
against real PokéAPI payloads (mocked at the network layer in the
sandbox, which cannot reach pokeapi.co directly).
