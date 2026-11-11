# Session 2026-11-10-02 — Personal pass: Seen collection + About

## Goal / request
Owner: fix the 5 repos one by one so each reads like his own
worked-on project. Second repo in the series: Pokédex Explorer.

## What was done
- app.js: Seen collection — a persisted Set of opened Pokémon ids
  (localStorage `pokedex:seen`); opening a detail marks it, its card
  gains a "Seen" badge (updated in place, no re-render), and the
  header shows "Seen N of {total}". Evolution-chain navigation also
  marks, since it routes through openDetail().
- index.html: header counter element + an "About this project"
  section in first person (the N+1/batch discipline story) with the
  author's signature.
- styles.css: counter pill, badge, about panel, and the header
  flex row (.header-inner) the markup already referenced.
- README.md: author byline; Seen collection added to Features.

## Verification
- node --check app.js: OK. Aggregation/mapper logic exercised
  against live PokéAPI payloads during the original build; the new
  code paths are DOM/localStorage only and were reviewed line by
  line (badge selector, hidden attribute handling, total fallback
  before the first list load).
