/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — PARTY.JS
   Party builder, slot management, equipment, magic loadout
═══════════════════════════════════════════════════════════ */

// Local party state (mirrors DB, saved on changes)
let partyState = {
  slot_1: null, slot_2: null, slot_3: null, slot_4: null,
  equip_1: null, equip_2: null, equip_3: null, equip_4: null,
  magic_loadout: [],
};

// Track which slot is being picked for
let pickingFor = null; // { kind:'summon'|'equip'|'magic', slotIndex:1-4|null }

/* ═══════════════════════════════════════════════════════════
   RENDER PARTY SCREEN
═══════════════════════════════════════════════════════════ */

function renderPartyScreen() {
  // Load current party from GameState
  const dbParty = window.GameState.party;
  if (dbParty) {
    partyState = {
      slot_1: dbParty.slot_1 || null,
      slot_2: dbParty.slot_2 || null,
      slot_3: dbParty.slot_3 || null,
      slot_4: dbParty.slot_4 || null,
      equip_1: dbParty.equip_1 || null,
      equip_2: dbParty.equip_2 || null,
      equip_3: dbParty.equip_3 || null,
      equip_4: dbParty.equip_4 || null,
      magic_loadout: dbParty.magic_loadout || [],
    };
  }

  // Handle pending card from collection screen
  if (window._pendingPartyCard) {
    const key = window._pendingPartyCard;
    window._pendingPartyCard = null;
    setTimeout(() => openPickOverlay('summon', null, key), 300);
  }
  if (window._pendingEquipCard) {
    const key = window._pendingEquipCard;
    window._pendingEquipCard = null;
    setTimeout(() => openPickOverlay('equip', null, key), 300);
  }
  if (window._pendingMagicCard) {
    const key = window._pendingMagicCard;
    window._pendingMagicCard = null;
    setTimeout(() => autoAssignMagicCard(key), 300);
  }

  const screen = document.getElementById('screen-party');
  screen.innerHTML = `
    ${renderPartyPower()}
    ${renderFormationDiagram()}
    ${renderPartySlots()}
    ${renderMagicLoadout()}
    ${renderPartyStatsSummary()}
    <div class="party-save-row">
      <button class="btn-accent" id="btn-save-party">
        <iconify-icon icon="game-icons:save" width="20" height="20"></iconify-icon>
        Save Party
      </button>
    </div>

    <!-- Pick Card Overlay -->
    <div id="pick-card-overlay" class="hidden">
      <div class="pick-card-box">
        <div class="pick-card-header">
          <h3 id="pick-card-title">Select Card</h3>
          <button class="btn-close" id="pick-close-btn">✕</button>
        </div>
        <div class="pick-card-list" id="pick-card-list"></div>
      </div>
    </div>

    <div style="height:80px"></div>
  `;

  wirePartyEvents();
}

/* ═══════════════════════════════════════════════════════════
   PARTY POWER
═══════════════════════════════════════════════════════════ */

function renderPartyPower() {
  const power = calcPartyPower();
  return `
    <div class="party-power-bar">
      <div class="party-power-label">
        <iconify-icon icon="game-icons:lightning-trio" width="18" height="18"></iconify-icon>
        Party Power
      </div>
      <div class="party-power-value">${fmtNum(power)}</div>
    </div>
  `;
}

function calcPartyPower() {
  let power = 0;
  [1,2,3,4].forEach(i => {
    const key  = partyState[`slot_${i}`];
    const card = key ? getCardDef(key) : null;
    if (!card) return;
    power += (card.hp||0)*0.5 + (card.atk||0)*2 + (card.def||0)*1.5 +
             (card.spd||0)*1 + (card.mana||0)*0.8;

    // Add equipment bonuses
    const eKey  = partyState[`equip_${i}`];
    const equip = eKey ? getCardDef(eKey) : null;
    if (equip) {
      power += (equip.atk_bonus||0)*2 + (equip.def_bonus||0)*1.5 +
               (equip.spd_bonus||0)*1 + (equip.mana_bonus||0)*0.8;
    }
  });
  return Math.round(power);
}

/* ═══════════════════════════════════════════════════════════
   FORMATION DIAGRAM
═══════════════════════════════════════════════════════════ */

function renderFormationDiagram() {
  const slots = [1,2,3,4].map(i => {
    const filled = !!partyState[`slot_${i}`];
    const pos    = i <= 2 ? 'front' : 'back';
    return `<div class="formation-dot ${filled ? `filled ${pos}` : ''}"></div>`;
  });

  return `
    <div class="formation-diagram">
      <div class="formation-side">
        <div class="formation-label front">FRONT</div>
        <div class="formation-slots">${slots[0]}${slots[1]}</div>
      </div>
      <div class="formation-arrow">⚔️</div>
      <div class="formation-side">
        <div class="formation-label back">BACK</div>
        <div class="formation-slots">${slots[2]}${slots[3]}</div>
      </div>
    </div>
    <div class="formation-hint">Front row takes more damage · Back row is safer</div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PARTY SLOTS (4 character slots)
═══════════════════════════════════════════════════════════ */

function renderPartySlots() {
  const slotsHTML = [1,2,3,4].map(i => renderPartySlot(i)).join('');
  return `
    <div class="party-section-title">
      <iconify-icon icon="game-icons:cowled" width="16" height="16"></iconify-icon>
      Party Members
    </div>
    <div class="party-slots" id="party-slots">${slotsHTML}</div>
  `;
}

function renderPartySlot(slotIndex) {
  const cardKey  = partyState[`slot_${slotIndex}`];
  const equipKey = partyState[`equip_${slotIndex}`];
  const card     = cardKey  ? getCardDef(cardKey)  : null;
  const equip    = equipKey ? getCardDef(equipKey) : null;
  const isBack   = slotIndex > 2;
  const posClass = isBack ? 'slot-back' : 'slot-front';

  return `
    <div class="party-slot ${posClass} ${card ? 'filled' : ''}" id="slot-${slotIndex}">
      <div class="slot-position-label">${isBack ? 'BACK' : 'FRONT'}</div>
      <div class="slot-number">${slotIndex}</div>

      <!-- Character avatar -->
      <div class="slot-avatar ${card ? `has-card rarity-${card.rarity.toLowerCase()}` : 'empty-slot'}"
        onclick="openPickOverlay('summon', ${slotIndex})">
        ${card
          ? window.getCardIconHtml(card, 28)
          : `<iconify-icon icon="game-icons:add" width="20" height="20"></iconify-icon>`}
      </div>

      <!-- Character info -->
      <div class="slot-info">
        ${card ? `
          <div class="slot-char-name">${escHtml(card.name)}</div>
          <div class="slot-char-title" style="color:${getRarityColor(card.rarity)}">
            ${card.rarity} · ${escHtml(card.skill_name || '')}
          </div>
          <div class="slot-mini-stats">
            <span class="slot-mini-stat">
              <iconify-icon icon="game-icons:health-normal" width="10" height="10"
                style="color:var(--color-danger)"></iconify-icon>
              ${fmtNum(card.hp + (equip?.def_bonus||0))}
            </span>
            <span class="slot-mini-stat">
              <iconify-icon icon="game-icons:broadsword" width="10" height="10"
                style="color:var(--rarity-ur)"></iconify-icon>
              ${fmtNum(card.atk + (equip?.atk_bonus||0))}
            </span>
            <span class="slot-mini-stat">
              <iconify-icon icon="game-icons:shield" width="10" height="10"
                style="color:var(--color-info)"></iconify-icon>
              ${fmtNum(card.def + (equip?.def_bonus||0))}
            </span>
          </div>
          ${card.skill_name ? `
            <span class="slot-skill-badge">
              <iconify-icon icon="game-icons:magic-swirl" width="8" height="8"></iconify-icon>
              ${escHtml(card.skill_name)}
            </span>` : ''}
        ` : `
          <div class="slot-empty-text">Tap to add character</div>
        `}
      </div>

      <!-- Equipment mini slot -->
      <div class="slot-equip" onclick="openPickOverlay('equip', ${slotIndex})">
        <div class="slot-equip-icon ${equip ? 'has-equip' : ''}">
          ${equip
            ? `<iconify-icon icon="${equip.icon}" width="18" height="18"
                style="color:${equip.icon_color}"></iconify-icon>`
            : `<iconify-icon icon="game-icons:broadsword" width="16" height="16"></iconify-icon>`}
        </div>
        <div class="slot-equip-label">${equip ? escHtml(equip.name).slice(0,8) : 'Equip'}</div>
      </div>

      <!-- Remove button (only if filled) -->
      ${card ? `
        <button class="slot-remove-btn" onclick="removeFromSlot(${slotIndex})">✕</button>
      ` : ''}
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   MAGIC LOADOUT (4 spell slots)
═══════════════════════════════════════════════════════════ */

function renderMagicLoadout() {
  const slots = [0,1,2,3].map(i => {
    const cardKey = partyState.magic_loadout[i] || null;
    const card    = cardKey ? getCardDef(cardKey) : null;
    const qty     = cardKey ? getCardQuantity(cardKey) : 0;

    return `
      <div class="magic-slot ${card ? 'has-magic' : ''}"
        onclick="openPickOverlay('magic', ${i})">
        <div class="magic-slot-icon">
          ${card
            ? `<iconify-icon icon="${card.icon}" width="20" height="20"
                style="color:${card.icon_color}"></iconify-icon>`
            : `<iconify-icon icon="game-icons:magic-swirl" width="18" height="18"></iconify-icon>`}
        </div>
        <div class="magic-slot-info">
          ${card ? `
            <div class="magic-slot-name">${escHtml(card.name)}</div>
            <div class="magic-slot-cost">
              <iconify-icon icon="game-icons:lightning-trio" width="10" height="10"></iconify-icon>
              ${card.magic_cost} mana
            </div>
            <div class="magic-slot-qty">×${qty} ${card.is_single_use ? '(consumed)' : '(reusable)'}</div>
          ` : `
            <div class="magic-slot-empty-text">+ Add Spell</div>
          `}
        </div>
        ${card ? `
          <button class="magic-remove-btn"
            onclick="removeMagicSlot(event, ${i})">✕</button>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="party-section-title">
      <iconify-icon icon="game-icons:magic-swirl" width="16" height="16"></iconify-icon>
      Magic Loadout
      <span style="font-size:0.65rem;color:var(--text-muted);margin-left:4px">(4 spells max)</span>
    </div>
    <div class="magic-loadout">${slots}</div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PARTY STATS SUMMARY
═══════════════════════════════════════════════════════════ */

function renderPartyStatsSummary() {
  const totals = { hp:0, atk:0, def:0, spd:0, mana:0 };

  [1,2,3,4].forEach(i => {
    const card  = getCardDef(partyState[`slot_${i}`]);
    const equip = getCardDef(partyState[`equip_${i}`]);
    if (!card) return;
    totals.hp   += card.hp   || 0;
    totals.atk  += card.atk  || 0;
    totals.def  += card.def  || 0;
    totals.spd  += card.spd  || 0;
    totals.mana += card.mana || 0;
    if (equip) {
      totals.atk  += equip.atk_bonus  || 0;
      totals.def  += equip.def_bonus  || 0;
      totals.spd  += equip.spd_bonus  || 0;
      totals.mana += equip.mana_bonus || 0;
    }
  });

  const stats = [
    { key:'hp',   label:'Total HP',   icon:'game-icons:health-normal',   color:'var(--color-danger)' },
    { key:'atk',  label:'Total ATK',  icon:'game-icons:broadsword',      color:'var(--rarity-ur)' },
    { key:'def',  label:'Total DEF',  icon:'game-icons:shield',          color:'var(--color-info)' },
    { key:'spd',  label:'Avg SPD',    icon:'game-icons:lightning-trio',  color:'var(--color-success)' },
    { key:'mana', label:'Total MANA', icon:'game-icons:magic-swirl',     color:'var(--color-primary)' },
  ];

  const cells = stats.map(s => `
    <div class="party-stat-cell ${s.key}">
      <iconify-icon icon="${s.icon}" width="14" height="14"
        style="color:${s.color}"></iconify-icon>
      <div class="party-stat-total">${fmtNum(s.key==='spd' ? Math.round(totals[s.key]/4) : totals[s.key])}</div>
      <div class="party-stat-label">${s.label}</div>
    </div>
  `).join('');

  return `
    <div class="party-section-title">
      <iconify-icon icon="game-icons:chart-bars" width="16" height="16"></iconify-icon>
      Party Totals
    </div>
    <div class="party-stats-summary">${cells}</div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PICK CARD OVERLAY
═══════════════════════════════════════════════════════════ */

function openPickOverlay(kind, slotIndex, preselectedKey = null) {
  pickingFor = { kind, slotIndex };

  const overlay   = document.getElementById('pick-card-overlay');
  const titleEl   = document.getElementById('pick-card-title');
  const listEl    = document.getElementById('pick-card-list');
  if (!overlay) return;

  // Set title
  const titles = {
    summon: `Select Character (Slot ${slotIndex})`,
    equip:  `Select Equipment (Slot ${slotIndex})`,
    magic:  `Select Spell (Magic Slot ${slotIndex + 1})`,
  };
  if (titleEl) titleEl.textContent = titles[kind] || 'Select Card';

  // Build card list
  let cards = [];
  if (kind === 'summon') {
    cards = getOwnedCardDefs('summon').filter(c => c.rarity !== 'E');
  } else if (kind === 'equip') {
    cards = getOwnedCardDefs('equipment');
  } else if (kind === 'magic') {
    cards = [
      ...getOwnedCardDefs('magic'),
      ...getOwnedCardDefs('consumable'),
    ];
  }

  cards = sortByRarity(cards);

  // Currently used slots (to mark as already in use)
  const usedSummons = [1,2,3,4]
    .map(i => partyState[`slot_${i}`])
    .filter(Boolean);
  const usedEquips  = [1,2,3,4]
    .map(i => partyState[`equip_${i}`])
    .filter(Boolean);
  const usedMagic   = partyState.magic_loadout.filter(Boolean);

  if (listEl) {
    if (cards.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <iconify-icon icon="game-icons:card-pick" width="36" height="36"></iconify-icon>
          <p>No ${kind} cards owned yet.<br>Go pull some!</p>
        </div>
      `;
    } else {
      listEl.innerHTML = cards.map(card => {
        let alreadyUsed = false;
        if (kind === 'summon') alreadyUsed = usedSummons.includes(card.card_key) && card.card_key !== partyState[`slot_${slotIndex}`];
        if (kind === 'equip')  alreadyUsed = usedEquips.includes(card.card_key)  && card.card_key !== partyState[`equip_${slotIndex}`];
        if (kind === 'magic')  alreadyUsed = usedMagic.includes(card.card_key);

        const qty = getCardQuantity(card.card_key);

        return `
          <div class="pick-card-item rarity-${card.rarity.toLowerCase()}
            ${alreadyUsed ? 'already-used' : ''}"
            onclick="selectCard('${card.card_key}')">
            <div class="pick-card-item-icon">
              ${window.getCardIconHtml(card, 28)}
            </div>
            <div class="pick-card-item-name">${escHtml(card.name)}</div>
            <div class="pick-card-item-rarity" style="color:${getRarityColor(card.rarity)}">
              ${card.rarity}
            </div>
            ${(kind === 'magic') ? `
              <div class="pick-card-item-qty">×${qty}</div>` : ''}
          </div>
        `;
      }).join('');
    }

    // Add "Remove" option at top if slot is filled
    const currentKey = kind === 'summon' ? partyState[`slot_${slotIndex}`]
      : kind === 'equip' ? partyState[`equip_${slotIndex}`]
      : partyState.magic_loadout[slotIndex];

    if (currentKey) {
      const removeItem = document.createElement('div');
      removeItem.className = 'pick-card-item';
      removeItem.style.cssText = 'border-color:var(--color-danger);background:rgba(255,51,85,0.05)';
      removeItem.innerHTML = `
        <div class="pick-card-item-icon">
          <iconify-icon icon="game-icons:cancel" width="24" height="24"
            style="color:var(--color-danger)"></iconify-icon>
        </div>
        <div class="pick-card-item-name" style="color:var(--color-danger)">Remove</div>
      `;
      removeItem.onclick = () => selectCard(null);
      listEl.prepend(removeItem);
    }
  }

  overlay.classList.remove('hidden');

  // If a card was pre-selected, select it immediately
  if (preselectedKey) {
    setTimeout(() => selectCard(preselectedKey), 100);
  }
}

function closePickOverlay() {
  const overlay = document.getElementById('pick-card-overlay');
  if (overlay) overlay.classList.add('hidden');
  pickingFor = null;
}

function selectCard(cardKey) {
  if (!pickingFor) return;
  const { kind, slotIndex } = pickingFor;

  if (kind === 'summon') {
    partyState[`slot_${slotIndex}`] = cardKey;
    if (!cardKey) partyState[`equip_${slotIndex}`] = null; // clear equip too
  } else if (kind === 'equip') {
    partyState[`equip_${slotIndex}`] = cardKey;
  } else if (kind === 'magic') {
    const loadout = [...(partyState.magic_loadout || [])];
    if (cardKey) {
      loadout[slotIndex] = cardKey;
    } else {
      loadout.splice(slotIndex, 1);
    }
    partyState.magic_loadout = loadout;
  }

  closePickOverlay();
  refreshPartyUI();
}

/* ═══════════════════════════════════════════════════════════
   SLOT MANAGEMENT
═══════════════════════════════════════════════════════════ */

function removeFromSlot(slotIndex) {
  partyState[`slot_${slotIndex}`]  = null;
  partyState[`equip_${slotIndex}`] = null;
  refreshPartyUI();
}

function removeMagicSlot(event, slotIndex) {
  event.stopPropagation();
  const loadout = [...(partyState.magic_loadout || [])];
  loadout.splice(slotIndex, 1);
  partyState.magic_loadout = loadout;
  refreshPartyUI();
}

function autoAssignMagicCard(cardKey) {
  const loadout = [...(partyState.magic_loadout || [])];
  // Find first empty slot
  for (let i = 0; i < 4; i++) {
    if (!loadout[i]) {
      loadout[i] = cardKey;
      partyState.magic_loadout = loadout;
      refreshPartyUI();
      showToast('Magic card added to loadout!', 'success');
      return;
    }
  }
  showToast('Magic loadout full! Remove a spell first.', 'error');
}

/* ═══════════════════════════════════════════════════════════
   REFRESH UI (after any change)
═══════════════════════════════════════════════════════════ */

function refreshPartyUI() {
  // Re-render slots
  const slotsEl = document.getElementById('party-slots');
  if (slotsEl) {
    slotsEl.innerHTML = [1,2,3,4].map(i => renderPartySlot(i)).join('');
  }

  // Re-render magic loadout
  const magicEl = document.querySelector('.magic-loadout');
  if (magicEl) {
    magicEl.outerHTML = renderMagicLoadout();
  }

  // Re-render stats summary
  const statsEl = document.querySelector('.party-stats-summary');
  if (statsEl) {
    statsEl.outerHTML = renderPartyStatsSummary();
  }

  // Re-render power
  const powerEl = document.querySelector('.party-power-bar');
  if (powerEl) {
    powerEl.outerHTML = renderPartyPower();
  }

  // Re-render formation
  const formEl = document.querySelector('.formation-diagram');
  if (formEl) {
    const hint = formEl.nextElementSibling;
    formEl.outerHTML = renderFormationDiagram();
    if (hint) hint.remove();
  }
}

/* ═══════════════════════════════════════════════════════════
   SAVE PARTY
═══════════════════════════════════════════════════════════ */

async function handleSaveParty() {
  const btn = document.getElementById('btn-save-party');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

  const { error } = await saveParty(partyState);

  if (btn) {
    btn.disabled    = false;
    btn.innerHTML   = `
      <iconify-icon icon="game-icons:save" width="20" height="20"></iconify-icon>
      Save Party
    `;
  }

  if (error) {
    showToast('Failed to save party. Try again.', 'error');
  } else {
    showToast('Party saved! ✓', 'success');
    // Sync GameState
    window.GameState.party = { ...window.GameState.party, ...partyState };
  }
}

/* ═══════════════════════════════════════════════════════════
   WIRE EVENTS
═══════════════════════════════════════════════════════════ */

function wirePartyEvents() {
  // Save button
  document.getElementById('btn-save-party')
    ?.add
