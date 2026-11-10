'use strict';
/*
 * Pokédex Explorer — vanilla JS, no build step.
 * Flow: API response -> mapper (mapPokemon) -> state -> render.
 * Caching: detail responses live in an in-memory Map AND localStorage
 * (PokéAPI's fair-use policy asks consumers to cache locally).
 */
const API = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 24;
const BATCH = 12; // Promise.all chunk size for detail fetches
const LS_DETAIL = 'pokedex:detail:';
const LS_TYPE = 'pokedex:type:';

const TYPE_LIST = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

const state = {
  page: 0,
  total: 0,
  listCache: new Map(),   // page -> [{id, name}]
  detailCache: new Map(), // id -> mapped pokemon
  activeType: null,
  typeMembers: null,      // Set of ids for the active type
  mode: 'browse',         // 'browse' | 'search'
  searchResult: null,     // mapped pokemon in search mode
};

const el = {
  grid: document.getElementById('grid'),
  status: document.getElementById('status-region'),
  empty: document.getElementById('empty-state'),
  emptyText: document.getElementById('empty-text'),
  error: document.getElementById('error-state'),
  errorText: document.getElementById('error-text'),
  prev: document.getElementById('prev-page'),
  next: document.getElementById('next-page'),
  pageIndicator: document.getElementById('page-indicator'),
  search: document.getElementById('search-input'),
  clearSearch: document.getElementById('clear-search'),
  typeFilters: document.getElementById('type-filters'),
  filterNote: document.getElementById('filter-note'),
  overlay: document.getElementById('detail-overlay'),
  detailBody: document.getElementById('detail-body'),
  offline: document.getElementById('offline-banner'),
};

/* ---------- helpers ---------- */
function idFromUrl(url) {
  return Number(url.split('/').filter(Boolean).pop());
}
function artworkUrl(id) {
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + id + '.png';
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ---------- mapper layer ---------- */
function mapPokemon(raw) {
  return {
    id: raw.id,
    name: raw.name,
    types: raw.types.slice().sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    heightM: raw.height / 10,          // decimetres -> metres
    weightKg: raw.weight / 10,         // hectograms -> kilograms
    abilities: raw.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    artwork: artworkUrl(raw.id),
    speciesUrl: raw.species.url,
  };
}

/* ---------- cache ---------- */
function cacheGet(id) {
  if (state.detailCache.has(id)) return state.detailCache.get(id);
  try {
    const raw = localStorage.getItem(LS_DETAIL + id);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.detailCache.set(id, parsed);
      return parsed;
    }
  } catch (e) { /* storage full/blocked — memory cache still works */ }
  return null;
}
function cacheSet(pokemon) {
  state.detailCache.set(pokemon.id, pokemon);
  try { localStorage.setItem(LS_DETAIL + pokemon.id, JSON.stringify(pokemon)); }
  catch (e) { /* quota exceeded — ignore, memory cache covers the session */ }
}

/* ---------- fetch ---------- */
async function fetchJson(url, signal) {
  const res = await fetch(url, signal ? { signal } : undefined);
  if (!res.ok) {
    const err = new Error('HTTP ' + res.status);
    err.status = res.status;
    throw err;
  }
  return res.json();
}
async function fetchDetail(idOrName, signal) {
  if (typeof idOrName === 'number') {
    const hit = cacheGet(idOrName);
    if (hit) return hit;
  }
  const raw = await fetchJson(API + '/pokemon/' + idOrName, signal);
  const mapped = mapPokemon(raw);
  cacheSet(mapped);
  return mapped;
}
async function fetchDetailsBatched(items, signal) {
  const out = [];
  for (let i = 0; i < items.length; i += BATCH) {
    const chunk = items.slice(i, i + BATCH);
    const part = await Promise.all(chunk.map((it) => fetchDetail(it.id, signal)));
    out.push(...part);
  }
  return out;
}

/* ---------- render ---------- */
function showSkeletons(n) {
  el.grid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'skeleton';
    d.innerHTML = '<div class="skel-block skel-img"></div><div class="skel-block skel-line"></div><div class="skel-block skel-line short"></div>';
    el.grid.appendChild(d);
  }
}
function setStatus(msg) { el.status.textContent = msg; }
function hideStates() { el.empty.hidden = true; el.error.hidden = true; }
function showError(msg) {
  hideStates();
  el.grid.innerHTML = '';
  el.errorText.textContent = msg;
  el.error.hidden = false;
  setStatus('');
}
function showEmpty(msg) {
  hideStates();
  el.grid.innerHTML = '';
  if (msg) el.emptyText.textContent = msg;
  el.empty.hidden = false;
  setStatus('');
}
function cardHtml(p) {
  const chips = p.types.map((t) => '<span class="type-chip type-' + esc(t) + '">' + esc(t) + '</span>').join('');
  return '<img src="' + p.artwork + '" alt="' + esc(p.name) + ' artwork" loading="lazy">' +
    '<span class="pname">' + esc(p.name) + '</span>' +
    '<span class="pid">#' + p.id + '</span>' +
    '<span class="type-row">' + chips + '</span>';
}
function renderCards(list) {
  hideStates();
  el.grid.innerHTML = '';
  for (const p of list) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.innerHTML = cardHtml(p);
    b.setAttribute('aria-label', 'View details for ' + p.name);
    b.addEventListener('click', () => openDetail(p.id));
    el.grid.appendChild(b);
  }
}
function updatePagination() {
  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
  el.pageIndicator.textContent = 'Page ' + (state.page + 1) + ' of ' + totalPages;
  el.prev.disabled = state.page <= 0 || state.mode === 'search';
  el.next.disabled = state.page >= totalPages - 1 || state.mode === 'search';
}

/* ---------- browse / filter ---------- */
let pageController = null;
async function loadPage() {
  if (pageController) pageController.abort();
  pageController = new AbortController();
  const signal = pageController.signal;
  hideStates();
  showSkeletons(PAGE_SIZE);
  setStatus('Loading Pokémon…');
  try {
    let items;
    if (state.activeType && state.typeMembers) {
      const ids = Array.from(state.typeMembers).sort((a, b) => a - b);
      state.total = ids.length;
      const pageIds = ids.slice(state.page * PAGE_SIZE, state.page * PAGE_SIZE + PAGE_SIZE);
      items = pageIds.map((id) => ({ id }));
      if (items.length === 0) { showEmpty('No Pokémon of this type on this page.'); updatePagination(); return; }
    } else {
      if (!state.listCache.has(state.page)) {
        const data = await fetchJson(API + '/pokemon?limit=' + PAGE_SIZE + '&offset=' + state.page * PAGE_SIZE, signal);
        state.total = data.count;
        state.listCache.set(state.page, data.results.map((r) => ({ id: idFromUrl(r.url), name: r.name })));
      }
      items = state.listCache.get(state.page);
    }
    const details = await fetchDetailsBatched(items, signal);
    renderCards(details);
    setStatus(details.length + ' Pokémon shown.');
    updatePagination();
  } catch (err) {
    if (err.name === 'AbortError') return;
    showError('Could not load Pokémon from PokéAPI. Check your connection and try again.');
    updatePagination();
  }
}

async function applyTypeFilter(type) {
  state.activeType = type;
  state.page = 0;
  state.typeMembers = null;
  document.querySelectorAll('#type-filters .chip').forEach((c) => {
    c.setAttribute('aria-pressed', c.dataset.type === type ? 'true' : 'false');
  });
  if (!type) {
    el.filterNote.textContent = '';
    loadPage();
    return;
  }
  el.filterNote.textContent = 'Fetching the "' + type + '" type list from PokéAPI to intersect it with the Pokédex…';
  try {
    let members = null;
    try {
      const cached = localStorage.getItem(LS_TYPE + type);
      if (cached) members = JSON.parse(cached);
    } catch (e) { /* ignore */ }
    if (!members) {
      const data = await fetchJson(API + '/type/' + type);
      members = data.pokemon.map((p) => idFromUrl(p.pokemon.url));
      try { localStorage.setItem(LS_TYPE + type, JSON.stringify(members)); } catch (e) { /* ignore */ }
    }
    state.typeMembers = new Set(members);
    el.filterNote.textContent = members.length + ' Pokémon have the ' + type + ' type. Showing them in Pokédex order.';
    loadPage();
  } catch (err) {
    el.filterNote.textContent = '';
    showError('Could not load the type filter. Try again.');
  }
}

/* ---------- search ---------- */
let searchController = null;
async function runSearch(query) {
  const q = query.trim().toLowerCase().replace(/\s+/g, '-');
  if (searchController) searchController.abort();
  if (!q) {
    state.mode = 'browse';
    state.searchResult = null;
    el.clearSearch.hidden = true;
    loadPage();
    return;
  }
  searchController = new AbortController();
  state.mode = 'search';
  el.clearSearch.hidden = false;
  hideStates();
  showSkeletons(1);
  setStatus('Searching for "' + q + '"…');
  try {
    const p = await fetchDetail(q, searchController.signal);
    state.searchResult = p;
    renderCards([p]);
    setStatus('Found ' + p.name + '.');
    updatePagination();
  } catch (err) {
    if (err.name === 'AbortError') return;
    if (err.status === 404) {
      showEmpty('No Pokémon named "' + q + '" exists in PokéAPI. Names are lowercase and hyphenated — try "mr-mime" or "ho-oh".');
    } else {
      showError('Search failed. Check your connection and try again.');
    }
    updatePagination();
  }
}
const debouncedSearch = debounce((v) => runSearch(v), 300);

/* ---------- detail view ---------- */
function flattenEvolution(chainNode, out) {
  out.push(chainNode.species.name);
  for (const child of chainNode.evolves_to || []) flattenEvolution(child, out);
  return out;
}
async function openDetail(id) {
  el.overlay.hidden = false;
  el.detailBody.innerHTML = '<p>Loading details…</p>';
  try {
    const p = cacheGet(id) || (await fetchDetail(id));
    const maxStat = 160;
    const statsHtml = p.stats.map((s) =>
      '<div class="stat-row"><span class="stat-name">' + esc(s.name.replace('-', ' ')) + '</span>' +
      '<span class="stat-track"><span class="stat-fill" style="width:' + Math.min(100, Math.round(s.value / maxStat * 100)) + '%"></span></span>' +
      '<span>' + s.value + '</span></div>').join('');
    const abilities = p.abilities.map((a) => esc(a.name.replace(/-/g, ' ')) + (a.hidden ? ' (hidden)' : '')).join(', ');
    const chips = p.types.map((t) => '<span class="type-chip type-' + esc(t) + '">' + esc(t) + '</span>').join('');
    el.detailBody.innerHTML =
      '<div class="detail-head"><img src="' + p.artwork + '" alt="' + esc(p.name) + ' artwork">' +
      '<h2 id="detail-name">' + esc(p.name) + '</h2>' +
      '<p class="detail-sub">#' + p.id + '</p>' +
      '<div class="type-row">' + chips + '</div></div>' +
      '<dl class="detail-grid">' +
      '<div><dt>Height</dt><dd>' + p.heightM.toFixed(1) + ' m</dd></div>' +
      '<div><dt>Weight</dt><dd>' + p.weightKg.toFixed(1) + ' kg</dd></div>' +
      '<div><dt>Abilities</dt><dd>' + abilities + '</dd></div>' +
      '</dl>' +
      '<h3 class="section-title">Base stats</h3>' + statsHtml +
      '<h3 class="section-title">Evolution chain</h3><div id="evo-region"><p>Loading evolution chain…</p></div>';
    loadEvolution(p);
  } catch (err) {
    el.detailBody.innerHTML = '<p>Could not load details. Close this and try again.</p>';
  }
}
async function loadEvolution(p) {
  const region = document.getElementById('evo-region');
  try {
    const species = await fetchJson(p.speciesUrl);
    const chainData = await fetchJson(species.evolution_chain.url);
    const names = flattenEvolution(chainData.chain, []);
    const members = [];
    for (const name of names) {
      try { members.push(await fetchDetail(name)); } catch (e) { /* skip missing */ }
    }
    region.innerHTML = '<div class="evo-row">' + members.map((m, i) =>
      (i > 0 ? '<span class="evo-arrow" aria-hidden="true">→</span>' : '') +
      '<button type="button" class="evo-item" data-evo-id="' + m.id + '" aria-label="View ' + esc(m.name) + '">' +
      '<img src="' + m.artwork + '" alt="' + esc(m.name) + '"><span>' + esc(m.name) + '</span></button>'
    ).join('') + '</div>';
    region.querySelectorAll('[data-evo-id]').forEach((b) => {
      b.addEventListener('click', () => openDetail(Number(b.dataset.evoId)));
    });
  } catch (err) {
    region.innerHTML = '<p>Evolution chain unavailable right now.</p>';
  }
}
function closeDetail() { el.overlay.hidden = true; el.detailBody.innerHTML = ''; }

/* ---------- wiring ---------- */
function buildTypeChips() {
  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'chip';
  all.textContent = 'All types';
  all.dataset.type = '';
  all.setAttribute('aria-pressed', 'true');
  all.addEventListener('click', () => applyTypeFilter(null));
  el.typeFilters.appendChild(all);
  for (const t of TYPE_LIST) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = t;
    b.dataset.type = t;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => applyTypeFilter(state.activeType === t ? null : t));
    el.typeFilters.appendChild(b);
  }
}
el.search.addEventListener('input', (e) => debouncedSearch(e.target.value));
el.clearSearch.addEventListener('click', () => {
  el.search.value = '';
  runSearch('');
});
document.getElementById('empty-reset').addEventListener('click', () => {
  el.search.value = '';
  runSearch('');
  applyTypeFilter(null);
});
document.getElementById('error-retry').addEventListener('click', () => {
  if (state.mode === 'search') runSearch(el.search.value); else loadPage();
});
el.prev.addEventListener('click', () => { if (state.page > 0) { state.page--; loadPage(); } });
el.next.addEventListener('click', () => { state.page++; loadPage(); });
document.getElementById('detail-close').addEventListener('click', closeDetail);
el.overlay.addEventListener('click', (e) => { if (e.target === el.overlay) closeDetail(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });

function updateOffline() { el.offline.hidden = navigator.onLine; }
window.addEventListener('online', updateOffline);
window.addEventListener('offline', updateOffline);

buildTypeChips();
updateOffline();
loadPage();
