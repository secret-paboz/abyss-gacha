/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — COLLECTION.JS
   Card collection browser, filters, sort, card detail overlay
═══════════════════════════════════════════════════════════ */

// Track current filter/sort state
let colState = {
  type:   'all',   // 'all' | 'summon' | 'equipment' | 'magic' | 'consumable'
  rarity: 'all',   // 'all' | 'E' | 'N' | 'R' | 'SR' | 'SSR' | 'SSSR' | 'UR' | 'SUR' | 'EX'
  sort:   'rarity',// 'rarity' | 'name' | 'atk' | 'hp' | 'recent'
  search: '',
};

/* ═══════════════════════════════════════════════════════════
   RENDER COLLECTION SCREEN
═══════════════════════════════════════════════════════════ */

function renderCollectionScreen() {
  const screen = document.getElementById('screen-collection');
  const owned  = getOwnedCardDefs();

  const summonCount     = owned.filter(c => c.card_type === 'summon').length;
  const equipCount      = owned.filter(c => c.card_type === 'equipment').length;
  const magicCount      = owned.filter(c => c.card_type === 'magic').length;
  const consumableCount = owned.filter(c => c.card_type === 'consumable').length;

  screen.innerHTML = `
    <!-- Header -->
    <div class="collection-header">
      <div class="collection-title">
        <iconify-icon icon="game-icons:scroll-unfurled" width="22" height="22"></iconify-icon>
        Collection
      </div>
      <div class="collection-count">${owned.length} Cards</div>
    </div>

    <!-- Type Tabs -->
    <div class="collection-tabs">
      <button class="col-tab-btn ${colState.type==='all'?'active':''}" data-type="all">
        <iconify-icon icon="game-icons:card-pick" width="18" height="18"></iconify-icon>
        All
        <span class="col-tab-count">${owned.length}</span>
      </button>
      <button class="col-tab-btn ${colState.type==='summon'?'active':''}" data-type="summon">
        <iconify-icon icon="game-icons:cowled" width="18" height="18"></iconify-icon>
        Summons
        <span class="col-tab-count">${summonCount}</span>
      </button>
      <button class="col-tab-btn ${colState.type==='equipment'?'active':''}" data-type="equipment">
        <iconify-icon icon="game-icons:broadsword" width="18" height="18"></iconify-icon>
        Equip
        <span class="col-tab-count">${equipCount}</span>
      </button>
      <button class="col-tab-btn ${colState.type==='magic'?'active':''}" data-type="magic">
        <iconify-icon icon="game-icons:magic-swirl" width="18" height="18"></iconify-icon>
        Magic
        <span class="col-tab-count">${magicCount}</span>
      </button>
    </div>

    <!-- Search -->
    <div class="collection-search">
      <iconify-icon icon="game-icons:magnifying-glass" width="16" height="16"></iconify-icon>
      <input type="text" id="col-search" placeholder="Search cards..."
        value="${escHtml(colState.search)}" autocomplete="off" />
    </div>

    <!-- Rarity Filter + Sort -->
    <div class="filter-bar" id="filter-bar">
      ${renderRarityFilters()}
      <select class="sort-select" id="col-sort">
        <option value="rarity"  ${colState.sort==='rarity' ?'selected':''}>Rarity</option>
        <option value="name"    ${colState.sort==='name'   ?'selected':''}>Name</option>
        <option value="atk"     ${colState.sort==='atk'    ?'selected':''}>ATK</option>
        <option value="hp"      ${colState.sort==='hp'     ?'selected':''}>HP</option>
      </select>
    </div>

    <!-- Card Grid -->
    <div class="card-grid" id="col-card-grid">
      ${renderCardGrid()}
    </div>

    <!-- Card Detail Overlay -->
    <div id="card-detail-overlay" class="hidden">
      <div class="card-detail-box" id="card-detail-box"></div>
    </div>

    <div style="height:var(--space-lg)"></div>
  `;

  wireCollectionEvents();
}

/* ═══════════════════════════════════════════════════════════
   RARITY FILTERS
═══════════════════════════════════════════════════════════ */

function renderRarityFilters() {
  const rarities = ['all','E','N','R','SR','SSR','SSSR','UR','SUR','EX'];
  return rarities.map(r => `
    <button class="filter-chip ${r !== 'all' ? `chip-${r.toLowerCase()}` : ''}
      ${colState.rarity === r ? 'active' : ''}"
      data-rarity="${r}">
      ${r === 'all' ? 'All' : r}
    </button>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════
   CARD GRID
═══════════════════════════════════════════════════════════ */

function renderCardGrid() {
  let cards = getOwnedCardDefs();

  // Filter by type
  if (colState.type !== 'all') {
    cards = cards.filter(c => c.card_type === colState.type);
  }

  // Filter by rarity
  if (colState.rarity !== 'all') {
    cards = cards.filter(c => c.rarity === colState.rarity);
  }

  // Filter by search
  if (colState.search) {
    const q = colState.search.toLowerCase();
    cards = cards.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      c.rarity.toLowerCase().includes(q)
    );
  }

  // Sort
  cards = sortCards(cards, colState.sort);

  if (cards.length === 0) {
    return `
      <div class="collection-empty">
        <iconify-icon icon="game-icons:card-pick" width="48" height="48"></iconify-icon>
        <p>${colState.search
          ? `No cards matching "${escHtml(colState.search)}"`
          : 'No cards in this category yet.'}</p>
        <button class="collection-empty-btn btn-primary btn-small"
          onclick="navigateTo('gacha')">
          Go Pull!
        </button>
      </div>
    `;
  }

  // Check which cards are in party
  const party = window.GameState.party;
  const partySlots = [party?.slot_1, party?.slot_2, party?.slot_3, party?.slot_4].filter(Boolean);

  return cards.map(card => {
    const inParty = partySlots.includes(card.card_key);
    const qty     = getCardQuantity(card.card_key);

    return `
      <div class="col-card card-frame rarity-${card.rarity.toLowerCase()}"
        onclick="openCardDetail('${card.card_key}')">
        ${inParty ? `
          <div class="col-card-in-party">
            <iconify-icon icon="game-icons:crossed-swords" width="10" height="10"></iconify-icon>
          </div>` : ''}
        ${qty > 1 ? `<div class="col-card-qty">×${qty}</div>` : ''}
        <div class="col-card-icon">
          ${window.getCardIconHtml(card, 32)}
        </div>
        <div class="col-card-name">${escHtml(card.name)}</div>
        <div class="col-card-rarity" style="color:${getRarityColor(card.rarity)}">
          ${card.rarity}
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   SORT
═══════════════════════════════════════════════════════════ */

function sortCards(cards, sortBy) {
  const rarityOrder = {EX:9,SUR:8,UR:7,SSSR:6,SSR:5,SR:4,R:3,N:2,E:1};
  return [...cards].sort((a, b) => {
    switch (sortBy) {
      case 'rarity': return (rarityOrder[b.rarity]||0) - (rarityOrder[a.rarity]||0);
      case 'name':   return a.name.localeCompare(b.name);
      case 'atk':    return (b.atk||b.atk_bonus||0) - (a.atk||a.atk_bonus||0);
      case 'hp':     return (b.hp||0) - (a.hp||0);
      default:       return (rarityOrder[b.rarity]||0) - (rarityOrder[a.rarity]||0);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   WIRE EVENTS
═══════════════════════════════════════════════════════════ */

function wireCollectionEvents() {
  // Type tabs
  document.querySelectorAll('.col-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      colState.type = btn.dataset.type;
      refreshCardGrid();
      document.querySelectorAll('.col-tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.type === colState.type));
    });
  });

  // Rarity filters
  document.querySelectorAll('.filter-chip[data-rarity]').forEach(chip => {
    chip.addEventListener('click', () => {
      colState.rarity = chip.dataset.rarity;
      refreshCardGrid();
      document.querySelectorAll('.filter-chip[data-rarity]').forEach(c =>
        c.classList.toggle('active', c.dataset.rarity === colState.rarity));
    });
  });

  // Sort
  const sortEl = document.getElementById('col-sort');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      colState.sort = sortEl.value;
      refreshCardGrid();
    });
  }

  // Search
  const searchEl = document.getElementById('col-search');
  if (searchEl) {
    let timer;
    searchEl.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        colState.search = searchEl.value;
        refreshCardGrid();
      }, 300);
    });
  }

  // Card detail overlay close (tap backdrop)
  const overlay = document.getElementById('card-detail-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeCardDetail();
    });
  }
}

function refreshCardGrid() {
  const grid = document.getElementById('col-card-grid');
  if (grid) grid.innerHTML = renderCardGrid();
}

/* ═══════════════════════════════════════════════════════════
   CARD DETAIL OVERLAY
═══════════════════════════════════════════════════════════ */

function openCardDetail(cardKey) {
  const card    = getCardDef(cardKey);
  if (!card) return;

  const overlay = document.getElementById('card-detail-overlay');
  const box     = document.getElementById('card-detail-box');
  if (!overlay || !box) return;

  box.innerHTML = buildCardDetailHTML(card);
  overlay.classList.remove('hidden');

  // Wire close button
  box.querySelector('.btn-close')?.addEventListener('click', closeCardDetail);

  // Wire action buttons
  wireCardDetailActions(card, box);
}

function closeCardDetail() {
  const overlay = document.getElementById('card-detail-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function buildCardDetailHTML(card) {
  const qty      = getCardQuantity(card.card_key);
  const party    = window.GameState.party;
  const inParty  = [party?.slot_1,party?.slot_2,party?.slot_3,party?.slot_4]
    .includes(card.card_key);

  return `
    <!-- Close row -->
    <div class="card-detail-close-row">
      <button class="btn-close">✕</button>
    </div>

    <!-- Top section -->
    <div class="card-detail-top">
      <div class="card-detail-icon-wrap rarity-${card.rarity.toLowerCase()}">
        ${window.getCardIconHtml(card, 52)}
      </div>
      <div class="card-detail-info">
        <div class="card-detail-name">${escHtml(card.name)}</div>
        <div class="card-detail-subtitle">${escHtml(getCardSubtitle(card))}</div>
        <div class="card-detail-badges">
          ${rarityBadgeHtml(card.rarity)}
          <span class="card-type-badge type-${card.card_type}">
            ${icon(getCardTypeIcon(card.card_type), 12)}
            ${card.card_type}
          </span>
        </div>
      </div>
    </div>

    <!-- Quantity (magic/consumable) -->
    ${(card.card_type === 'magic' || card.card_type === 'consumable') ? `
      <div class="card-detail-qty">
        <iconify-icon icon="game-icons:stack" width="16" height="16"
          style="color:var(--color-primary)"></iconify-icon>
        Owned:
        <span class="card-detail-qty-num">${qty}</span>
        ${card.is_single_use ? `
          <span class="magic-use-type single-use">Single-use</span>` : `
          <span class="magic-use-type reusable">Reusable</span>`}
      </div>
    ` : ''}

    <!-- Magic cost -->
    ${card.card_type === 'magic' && card.magic_cost > 0 ? `
      <div class="magic-cost-row">
        <span class="magic-cost-label">
          <iconify-icon icon="game-icons:lightning-trio" width="14" height="14"
            style="color:var(--color-primary)"></iconify-icon>
          Mana Cost
        </span>
        <span class="magic-cost-value">${card.magic_cost}</span>
        <span style="font-size:0.72rem;color:var(--text-muted)">${card.magic_class || ''}</span>
      </div>
    ` : ''}

    <!-- Stats (summons) -->
    ${card.card_type === 'summon' ? renderCardStats(card) : ''}

    <!-- Equipment bonuses -->
    ${card.card_type === 'equipment' ? renderEquipBonuses(card) : ''}

    <!-- Skill / Effect -->
    ${card.skill_name ? `
      <div class="card-detail-skill">
        <div class="card-detail-skill-title">
          <iconify-icon icon="game-icons:magic-swirl" width="14" height="14"></iconify-icon>
          Skill
        </div>
        <div class="card-detail-skill-name">${escHtml(card.skill_name)}</div>
        <div class="card-detail-skill-desc">${escHtml(card.skill_description || '')}</div>
      </div>
    ` : ''}

    ${card.equip_effect ? `
      <div class="card-detail-skill">
        <div class="card-detail-skill-title">
          <iconify-icon icon="game-icons:broadsword" width="14" height="14"></iconify-icon>
          Equipment Effect
        </div>
        <div class="card-detail-skill-desc">${escHtml(card.equip_effect)}</div>
      </div>
    ` : ''}

    <!-- Description -->
    <div class="card-detail-desc">${escHtml(card.description || '')}</div>

    <!-- Actions -->
    <div class="card-detail-actions">
      ${card.card_type === 'summon' ? `
        <button class="btn-primary btn-small" id="detail-add-party"
          ${inParty ? 'disabled' : ''}>
          <iconify-icon icon="game-icons:crossed-swords" width="16" height="16"></iconify-icon>
          ${inParty ? 'Already in Party' : 'Add to Party'}
        </button>
      ` : ''}
      ${card.card_type === 'equipment' ? `
        <button class="btn-secondary btn-small" id="detail-equip">
          <iconify-icon icon="game-icons:broadsword" width="16" height="16"></iconify-icon>
          Equip to Character
        </button>
      ` : ''}
      ${card.card_type === 'magic' ? `
        <button class="btn-secondary btn-small" id="detail-add-magic">
          <iconify-icon icon="game-icons:magic-swirl" width="16" height="16"></iconify-icon>
          Add to Magic Loadout
        </button>
      ` : ''}
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   CARD STATS RENDERING
═══════════════════════════════════════════════════════════ */

function renderCardStats(card) {
  const maxStat = 9999;
  const stats = [
    { key:'hp',   label:'HP',   icon:'game-icons:health-normal',   color:'var(--color-danger)', val: card.hp   },
    { key:'atk',  label:'ATK',  icon:'game-icons:broadsword',      color:'var(--rarity-ur)',    val: card.atk  },
    { key:'def',  label:'DEF',  icon:'game-icons:shield',          color:'var(--color-info)',   val: card.def  },
    { key:'spd',  label:'SPD',  icon:'game-icons:lightning-trio',  color:'var(--color-success)',val: card.spd  },
    { key:'mana', label:'MANA', icon:'game-icons:magic-swirl',     color:'var(--color-primary)',val: card.mana },
  ];

  const rows = stats.map(s => `
    <div class="stat-bar-wrap stat-${s.key}">
      <iconify-icon icon="${s.icon}" width="14" height="14"
        style="color:${s.color}"></iconify-icon>
      <span style="font-size:0.72rem;color:var(--text-muted);min-width:32px">${s.label}</span>
      <div class="stat-bar">
        <div class="stat-bar-fill" style="width:${Math.min(100,(s.val/maxStat)*100)}%;
          background:${s.color}"></div>
      </div>
      <span class="stat-value">${fmtNum(s.val)}</span>
    </div>
  `).join('');

  return `
    <div class="card-detail-stats">
      <div class="card-detail-stats-title">Base Stats</div>
      ${rows}
    </div>
  `;
}

function renderEquipBonuses(card) {
  const bonuses = [
    { label:'ATK Bonus',  icon:'game-icons:broadsword',     color:'var(--rarity-ur)',    val: card.atk_bonus  },
    { label:'DEF Bonus',  icon:'game-icons:shield',         color:'var(--color-info)',   val: card.def_bonus  },
    { label:'SPD Bonus',  icon:'game-icons:lightning-trio', color:'var(--color-success)',val: card.spd_bonus  },
    { label:'MANA Bonus', icon:'game-icons:magic-swirl',    color:'var(--color-primary)',val: card.mana_bonus },
  ].filter(b => b.val !== 0);

  if (!bonuses.length) return '';

  const rows = bonuses.map(b => `
    <div class="equip-bonus-row">
      <span class="equip-bonus-label">
        <iconify-icon icon="${b.icon}" width="14" height="14"
          style="color:${b.color}"></iconify-icon>
        ${b.label}
      </span>
      <span class="equip-bonus-value">
        ${b.val > 0 ? '+' : ''}${fmtNum(b.val)}
      </span>
    </div>
  `).join('');

  const classLabel = card.equip_class ? `
    <span class="equip-class-badge">
      <iconify-icon icon="game-icons:rank-3" width="10" height="10"></iconify-icon>
      ${card.equip_class} Class
    </span>
  ` : '';

  return `
    <div class="card-detail-stats">
      <div class="card-detail-stats-title">
        Equipment Bonuses ${classLabel}
      </div>
      ${rows}
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   CARD DETAIL ACTION BUTTONS
═══════════════════════════════════════════════════════════ */

function wireCardDetailActions(card, box) {
  // Add to party
  const addPartyBtn = box.querySelector('#detail-add-party');
  if (addPartyBtn) {
    addPartyBtn.addEventListener('click', () => {
      closeCardDetail();
      navigateTo('party');
      showToast(`Select a slot for ${card.name}`, 'info');
      // Pre-select this card in party screen
      window._pendingPartyCard = card.card_key;
    });
  }

  // Equip
  const equipBtn = box.querySelector('#detail-equip');
  if (equipBtn) {
    equipBtn.addEventListener('click', () => {
      closeCardDetail();
      navigateTo('party');
      showToast(`Select a character to equip ${card.name}`, 'info');
      window._pendingEquipCard = card.card_key;
    });
  }

  // Add to magic loadout
  const magicBtn = box.querySelector('#detail-add-magic');
  if (magicBtn) {
    magicBtn.addEventListener('click', () => {
      closeCardDetail();
      navigateTo('party');
      showToast(`Select a magic slot for ${card.name}`, 'info');
      window._pendingMagicCard = card.card_key;
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

function getCardSubtitle(card) {
  if (card.card_type === 'summon')    return card.skill_name || 'Fighter';
  if (card.card_type === 'equipment') return `${card.equip_class || ''} ${card.equip_type || ''}`.trim();
  if (card.card_type === 'magic')     return card.magic_class || 'Spell';
  if (card.card_type === 'consumable') return 'Consumable Item';
  return '';
}
