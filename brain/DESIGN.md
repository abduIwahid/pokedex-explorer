# Design — Pokédex Explorer

**Direction:** near-black on off-white, one accent (Pokédex red). Solid colours only — no gradients, no glassmorphism, no glow. Type chips carry small categorical colours because they encode data (the type), not decoration.

**Tokens (as used in styles.css):**
- `--bg: #FAFAF8` · `--surface: #FFFFFF` · `--surface-alt: #F1EFE9`
- `--text: #1A1A1A` · `--text-muted: #5A5A54` · `--border: #DDD9CF`
- `--accent: #C62828` · `--accent-dark: #8E1414` · `--accent-soft: #FBEAEA`
- `--danger: #B3261E` · `--focus: #1A56C4` · `--radius: 10px`

**Typography:** system stack — "Helvetica Neue", Helvetica, Arial, sans-serif. Headings bold, names capitalised via CSS.

**Component states:**
- Card: default / hover (accent border) / focus-visible (3px focus outline) — cards are real `<button>`s.
- Chip: default / hover / `aria-pressed=true` (inverted).
- Skeleton: alt-surface blocks while a page loads.
- Empty / error / offline: dedicated boxes + banner, each with a recovery action (reset / retry).
- Modal: dialog role, Escape and backdrop click close it.

**Responsive:** grid is `auto-fill minmax(150px, 1fr)` (132px under 480px); controls wrap; no fixed widths — verified layout intent at 360px.
