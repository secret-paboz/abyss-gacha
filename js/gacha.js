/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — GACHA.JS
   Pull engine, rarity rolls, pity system,
   pull animation, results display
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   RENDER GACHA SCREEN
═══════════════════════════════════════════════════════════ */

function renderGachaScreen() {
  const screen = document.getElementById('screen-gacha');
  const player = window.GameState.player;

  screen.innerHTML = `
    ${renderGachaBanner()}
    ${renderGachaBalance(player)}
    ${renderPullButtons(player)}
    ${renderGachaPityBox(player)}
    ${renderRatesToggle()}
    <div style="height:var(--space-lg)"></div>
  `;

  wireGachaButtons();
  wireRatesToggle();
}

/* ═══════════════════════════════════════════════════════════
   BANNER
═══════════════════════════════════════════════════════════ */

function renderGachaBanner() {
  return `
    <div class="gacha-banner">
      <div class="gacha-banner-stars" id="gacha-stars"></div>
      <div class="gacha-banner-icon">
        <iconify-icon icon="game-icons:crystal-ball" width="56" height="56"></iconify-icon>
      </div>
      <div class="gacha-banner-title">Infinite Gacha</div>
      <div class="gacha-banner-subtitle">
        "The Abyss grants all things — for a price."
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   BALANCE DISPLAY
═══════════════════════════════════════════════════════════ */

function renderGachaBalance(player) {
  return `
    <div class="gacha-balance">
      <iconify-icon icon="game-icons:crystals" width="20" height="20"></iconify-icon>
      <span id="gacha-crystal-display">${fmtNum(player.crystals)}</span>
      Crystals
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PULL BUTTONS
═══════════════════════════════════════════════════════════ */

function renderPullButtons(player) {
  const canSingle = player.crystals >= window.GACHA_CONFIG.single_cost;
  const canTen    = player.crystals >= window.GACHA_CONFIG.ten_cost;

  return `
    <div class="pull-buttons">
      <button class="pull-btn pull-btn-single" id="btn-pull-single"
        ${!canSingle ? 'disabled' : ''}>
        <div class="pull-btn-left">
          <iconify-icon icon="game-icons:card-pick" width="24" height="24"></iconify-icon>
          <div>
            <div class="pull-btn-label">Single Pull</div>
            <div class="pull-btn-sublabel">1 card</div>
          </div>
        </div>
        <div class="pull-btn-cost">
          <iconify-icon icon="game-icons:crystals" width="16" height="16"></iconify-icon>
          ${fmtNum(window.GACHA_CONFIG.single_cost)}
        </div>
      </button>

      <button class="pull-btn pull-btn-ten" id="btn-pull-ten"
        ${!canTen ? 'disabled' : ''}>
        <div class="pull-btn-left">
          <iconify-icon icon="game-icons:card-random" width="24" height="24"></iconify-icon>
          <div>
            <div class="pull-btn-label">10-Pull</div>
            <div class="pull-btn-sublabel">Guaranteed SR+</div>
          </div>
        </div>
        <div class="pull-btn-cost">
          <iconify-icon icon="game-icons:crystals" width="16" height="16"></iconify-icon>
          ${fmtNum(window.GACHA_CONFIG.ten_cost)}
          <span style="font-size:0.65rem;opacity:0.8;margin-left:2px">(10% off)</span>
        </div>
      </button>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PITY BOX
═══════════════════════════════════════════════════════════ */

function renderGachaPityBox(player) {
  const pity    = player.pity_counter     || 0;
  const pitySur = player.pity_sur_counter || 0;
  const ssrPct  = Math.min(100, Math.round((pity    / window.GACHA_CONFIG.pity_ssr) * 100));
  const surPct  = Math.min(100, Math.round((pitySur / window.GACHA_CONFIG.pity_sur) * 100));

  return `
    <div class="gacha-pity-box">
      <div class="gacha-pity-title">
        <iconify-icon icon="game-icons:shield-reflect" width="16" height="16"></iconify-icon>
        Pity Counter
      </div>
      <div class="pity-track-row">
        <span class="pity-track-label" style="color:var(--rarity-ssr)">SSR+ Guarantee</span>
        <div class="pity-track-bar">
          <div class="pity-track-fill ssr-fill" style="width:${ssrPct}%"></div>
        </div>
        <span class="pity-track-count">${pity} / ${window.GACHA_CONFIG.pity_ssr}</span>
      </div>
      <div class="pity-track-row">
        <span class="pity-track-label" style="color:var(--rarity-sur)">SUR Guarantee</span>
        <div class="pity-track-bar">
          <div class="pity-track-fill sur-fill" style="width:${surPct}%"></div>
        </div>
        <span class="pity-track-count">${pitySur} / ${window.GACHA_CONFIG.pity_sur}</span>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   RATES TABLE
═══════════════════════════════════════════════════════════ */

function renderRatesToggle() {
  const rates   = window.GACHA_CONFIG.rarity_rates;
  const typeMap = { summon:'Summons', equipment:'Equipment', magic:'Magic', consumable:'Items' };
  const tw      = window.GACHA_CONFIG.type_weights;

  const rarityRows = Object.entries(rates).map(([rarity, rate]) => `
    <div class="rates-table-row">
      <span class="rates-rarity" style="color:${getRarityColor(rarity)}">${rarity}</span>
      <span class="rates-percent">${rate}%</span>
      <span class="rates-note">${getRarityNote(rarity)}</span>
    </div>
  `).join('');

  const typeRows = Object.entries(tw).map(([type, w]) => `
    <div class="rates-table-row">
      <span style="color:var(--text-secondary)">${typeMap[type] || type}</span>
      <span class="rates-percent">${w}%</span>
      <span class="rates-note"></span>
    </div>
  `).join('');

  return `
    <div class="rates-toggle" id="rates-toggle">
      <iconify-icon icon="game-icons:info" width="14" height="14"></iconify-icon>
      View Drop Rates
      <iconify-icon icon="game-icons:arrow-down" width="14" height="14"></iconify-icon>
    </div>
    <div class="rates-table" id="rates-table">
      <div class="rates-table-header">
        <span>Rarity</span><span>Rate</span><span>Note</span>
      </div>
      ${rarityRows}
      <div class="rates-table-header" style="margin-top:4px">
        <span>Type</span><span>Chance</span><span></span>
      </div>
      ${typeRows}
      <div style="padding:var(--space-sm) var(--space-md);font-size:0.7rem;color:var(--text-muted)">
        SSR+ guaranteed every ${window.GACHA_CONFIG.pity_ssr} pulls &nbsp;·&nbsp;
        SUR guaranteed every ${window.GACHA_CONFIG.pity_sur} pulls
      </div>
    </div>
  `;
}

function getRarityNote(rarity) {
  const notes = {
    E:'Auto-refunded', N:'Common', R:'Uncommon', SR:'Rare',
    SSR:'Very Rare', SSSR:'Epic', UR:'Legendary',
    SUR:'Mythical ⭐', EX:'Unique 💀',
  };
  return notes[rarity] || '';
}

function wireRatesToggle() {
  const toggle = document.getElementById('rates-toggle');
  const table  = document.getElementById('rates-table');
  if (!toggle || !table) return;

  toggle.addEventListener('click', () => {
    const open = table.classList.toggle('visible');
    toggle.classList.toggle('open', open);
    toggle.querySelector('iconify-icon:last-child').setAttribute(
      'icon', open ? 'game-icons:arrow-up' : 'game-icons:arrow-down'
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   BUTTON WIRING
═══════════════════════════════════════════════════════════ */

function wireGachaButtons() {
  const singleBtn = document.getElementById('btn-pull-single');
  const tenBtn    = document.getElementById('btn-pull-ten');

  if (singleBtn) singleBtn.addEventListener('click', () => executePull(1));
  if (tenBtn)    tenBtn.addEventListener('click',    () => executePull(10));
}

/* ═══════════════════════════════════════════════════════════
   PULL ENGINE
═══════════════════════════════════════════════════════════ */

/**
 * Main pull function
 * @param {number} count - 1 or 10
 */
async function executePull(count) {
  const player = window.GameState.player;
  const cost   = count === 1
    ? window.GACHA_CONFIG.single_cost
    : window.GACHA_CONFIG.ten_cost;

  if (player.crystals < cost) {
    showToast('Not enough Abyss Crystals!', 'error');
    return;
  }

  // Disable buttons during pull
  setPullButtonsDisabled(true);

  // Show portal animation
  showPullPortal();
  await delay(1200);

  // Roll the cards
  const pulledCards = rollCards(count, player);

  // Check for special rarity (SUR/EX flash)
  const hasSUR = pulledCards.some(c => c.rarity === 'SUR');
  const hasEX  = pulledCards.some(c => c.rarity === 'EX');

  // Save to database
  const saveResult = await savePullResults(pulledCards, cost);

  if (saveResult.error) {
    hidePullPortal();
    setPullButtonsDisabled(false);
    showToast(saveResult.error.message, 'error');
    return;
  }

  // Show appropriate flash
  if (hasEX)       showPullFlash('rainbow');
  else if (hasSUR) showPullFlash('gold');

  await delay(400);

  // Show results
  if (count === 1) {
    showSinglePullResult(pulledCards[0], saveResult);
  } else {
    showTenPullResult(pulledCards, saveResult);
  }

  // Update UI
  updateTopCrystals();
  updateGachaCrystalDisplay();
}

/* ═══════════════════════════════════════════════════════════
   CARD ROLLING LOGIC
═══════════════════════════════════════════════════════════ */

/**
 * Roll N cards applying pity rules
 */
function rollCards(count, player) {
  const results = [];
  let   pity    = player.pity_counter     || 0;
  let   pitySur = player.pity_sur_counter || 0;

  for (let i = 0; i < count; i++) {
    pity++;
    pitySur++;

    let rarity = rollRarity(pity, pitySur);

    // Apply pity overrides
    if (pity >= window.GACHA_CONFIG.pity_ssr) {
      const highRarities = ['SSR','SSSR','UR','SUR','EX'];
      if (!highRarities.includes(rarity)) rarity = 'SSR';
      pity = 0;
    }
    if (pitySur >= window.GACHA_CONFIG.pity_sur) {
      rarity   = 'SUR';
      pitySur  = 0;
      pity     = 0;
    }

    // Reset pity on high rarity
    if (['SSR','SSSR','UR','SUR','EX'].includes(rarity)) pity = 0;
    if (['SUR','EX'].includes(rarity)) pitySur = 0;

    // For 10-pull: guarantee at least one SR on last card if nothing good
    if (count === 10 && i === 9) {
      const lowRarities = ['E','N','R'];
      const hasGoodCard = results.some(c => !lowRarities.includes(c.rarity));
      if (!hasGoodCard && lowRarities.includes(rarity)) rarity = 'SR';
    }

    // Pick card type
    const cardType = rollCardType();

    // Pick specific card
    const card = pickCard(cardType, rarity);
    if (card) results.push(card);
  }

  return results;
}

/**
 * Roll rarity based on rates
 */
function rollRarity(pity, pitySur) {
  const rates = window.GACHA_CONFIG.rarity_rates;
  const rand  = Math.random() * 100;
  let   cum   = 0;

  // Increasing SSR rate as pity builds (soft pity starting at 75)
  let ssrBonus = 0;
  if (pity >= 75) ssrBonus = (pity - 74) * 3; // +3% per pull after 75

  const adjustedRates = { ...rates };
  if (ssrBonus > 0) {
    adjustedRates.SSR = (adjustedRates.SSR || 0) + ssrBonus;
    adjustedRates.N   = Math.max(0, (adjustedRates.N || 0) - ssrBonus);
  }

  for (const [rarity, rate] of Object.entries(adjustedRates)) {
    cum += rate;
    if (rand < cum) return rarity;
  }

  return 'N'; // fallback
}

/**
 * Roll card type (summon/equipment/magic/consumable)
 */
function rollCardType() {
  const weights = window.GACHA_CONFIG.type_weights;
  const total   = Object.values(weights).reduce((a, b) => a + b, 0);
  const rand    = Math.random() * total;
  let   cum     = 0;

  for (const [type, weight] of Object.entries(weights)) {
    cum += weight;
    if (rand < cum) return type;
  }

  return 'summon';
}

/**
 * Pick a specific card of given type and rarity
 */
function pickCard(cardType, rarity) {
  let pool = window.CARD_DATA.filter(c =>
    c.card_type === cardType && c.rarity === rarity
  );

  // If no cards match exactly, fall back to nearest available rarity
  if (pool.length === 0) {
    pool = window.CARD_DATA.filter(c => c.card_type === cardType);
  }
  if (pool.length === 0) {
    pool = window.CARD_DATA;
  }

  // Weighted random pick
  const totalWeight = pool.reduce((s, c) => s + (c.drop_weight || 100), 0);
  let   rand        = Math.random() * totalWeight;

  for (const card of pool) {
    rand -= (card.drop_weight || 100);
    if (rand <= 0) return card;
  }

  return pool[pool.length - 1];
}

/* ═══════════════════════════════════════════════════════════
   PULL OVERLAY ANIMATIONS
═══════════════════════════════════════════════════════════ */

function showPullPortal() {
  let overlay = document.getElementById('pull-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'pull-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="pull-portal"></div>
    <div class="pull-portal-text">The Infinite Gacha responds...</div>
  `;
  overlay.classList.remove('hidden');
}

function hidePullPortal() {
  const overlay = document.getElementById('pull-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function showPullFlash(type) {
  const el = document.createElement('div');
  el.className = type === 'rainbow' ? 'pull-flash-rainbow' : 'pull-flash-gold';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

/* ═══════════════════════════════════════════════════════════
   SINGLE PULL RESULT
═══════════════════════════════════════════════════════════ */

function showSinglePullResult(card, saveResult) {
  const isNew     = saveResult.newCards?.some(c => c.card_key === card.card_key);
  const isDupe    = saveResult.refundCards?.some(r => r.card.card_key === card.card_key);
  const refund    = saveResult.refundCards?.find(r => r.card.card_key === card.card_key)?.refund || 0;

  const overlay = document.getElementById('pull-overlay');
  overlay.innerHTML = `
    <div class="pull-results-single">
      <div class="single-result-card rarity-${card.rarity.toLowerCase()} card-frame">
        ${isNew ? '<div class="pull-new-badge">NEW</div>' : ''}
        <div class="single-result-icon">
          ${window.getCardIconHtml(card, 52)}
        </div>
        <div class="single-result-name">${escHtml(card.name)}</div>
        <div class="single-result-type" style="color:var(--text-muted)">
          ${card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)}
        </div>
        ${rarityBadgeHtml(card.rarity)}
        ${isDupe ? `
          <div class="dup-notice" style="margin-top:var(--space-sm)">
            <iconify-icon icon="game-icons:crystals" width="12" height="12"
              style="color:var(--rarity-sur)"></iconify-icon>
            Duplicate → +${refund} 💎
          </div>
        ` : ''}
      </div>

      ${card.skill_name ? `
        <div style="text-align:center;font-size:0.82rem;color:var(--text-secondary);
          max-width:220px;padding:0 var(--space-md)">
          <span style="color:var(--color-primary);font-weight:700">${escHtml(card.skill_name)}</span>
          — ${escHtml(card.skill_description || '')}
        </div>
      ` : ''}

      <div class="pull-overlay-actions">
        <button class="pull-continue-btn" onclick="closePullOverlay()">Close</button>
        <button class="pull-again-btn" onclick="closePullOverlayAndPull(1)">Pull Again</button>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   10-PULL RESULT
═══════════════════════════════════════════════════════════ */

function showTenPullResult(cards, saveResult) {
  const overlay = document.getElementById('pull-overlay');

  // Build rarity summary
  const rarityCount = {};
  cards.forEach(c => { rarityCount[c.rarity] = (rarityCount[c.rarity] || 0) + 1; });
  const summaryChips = Object.entries(rarityCount)
    .sort((a, b) => {
      const order = {EX:9,SUR:8,UR:7,SSSR:6,SSR:5,SR:4,R:3,N:2,E:1};
      return (order[b[0]]||0) - (order[a[0]]||0);
    })
    .map(([rarity, count]) => `
      <div class="pull-summary-chip">
        <span style="color:${getRarityColor(rarity)};font-weight:800">${rarity}</span>
        ×${count}
      </div>
    `).join('');

  const cardItems = cards.map((card, idx) => {
    const isNew  = saveResult.newCards?.some(c => c.card_key === card.card_key);
    const isDupe = saveResult.refundCards?.some(r => r.card.card_key === card.card_key);
    return `
      <div class="pull-result-card rarity-${card.rarity.toLowerCase()}"
        style="--delay:${idx * 0.12}s"
        onclick="showCardQuickDetail('${card.card_key}')">
        ${isNew  ? '<div class="pull-new-badge">NEW</div>' : ''}
        ${isDupe ? '<div class="pull-new-badge" style="background:var(--rarity-ur)">DUP</div>' : ''}
        <div class="pull-result-card-icon">
          ${window.getCardIconHtml(card, 28)}
        </div>
        <div class="pull-result-card-name">${escHtml(card.name)}</div>
        <div class="pull-result-card-rarity" style="color:${getRarityColor(card.rarity)}">
          ${card.rarity}
        </div>
      </div>
    `;
  }).join('');

  const totalRefund = saveResult.totalRefund || 0;

  overlay.innerHTML = `
    <div style="width:100%;max-width:420px;padding:var(--space-md);
      display:flex;flex-direction:column;align-items:center;gap:var(--space-md)">

      <div style="font-size:0.9rem;font-weight:700;color:var(--text-accent);
        letter-spacing:2px">✨ PULL RESULTS ✨</div>

      <div class="pull-results-grid">${cardItems}</div>

      <div class="pull-summary">${summaryChips}</div>

      ${totalRefund > 0 ? `
        <div class="dup-notice" style="width:100%;text-align:center">
          <iconify-icon icon="game-icons:crystals" width="12" height="12"
            style="color:var(--rarity-sur)"></iconify-icon>
          Duplicate refunds: +${totalRefund} 💎
        </div>
      ` : ''}

      <div class="pull-overlay-actions">
        <button class="pull-continue-btn" onclick="closePullOverlay()">Close</button>
        <button class="pull-again-btn" onclick="closePullOverlayAndPull(10)">Pull Again (×10)</button>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   CARD QUICK DETAIL (tap on 10-pull result)
═══════════════════════════════════════════════════════════ */

function showCardQuickDetail(cardKey) {
  const card = getCardDef(cardKey);
  if (!card) return;

  showToast(`${card.name} — ${card.rarity} ${card.card_type}`, '', 2000);
}

/* ═══════════════════════════════════════════════════════════
   OVERLAY CLOSE / PULL AGAIN
═══════════════════════════════════════════════════════════ */

function closePullOverlay() {
  hidePullPortal();
  setPullButtonsDisabled(false);
  // Refresh gacha screen to update crystal display + button states
  renderGachaScreen();
}

async function closePullOverlayAndPull(count) {
  hidePullPortal();
  await delay(100);
  executePull(count);
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

function setPullButtonsDisabled(disabled) {
  const s = document.getElementById('btn-pull-single');
  const t = document.getElementById('btn-pull-ten');
  if (s) s.disabled = disabled;
  if (t) t.disabled = disabled;
}

function updateGachaCrystalDisplay() {
  const el = document.getElementById('gacha-crystal-display');
  if (el) el.textContent = fmtNum(window.GameState.player?.crystals || 0);

  // Update button disabled states
  const player    = window.GameState.player;
  const singleBtn = document.getElementById('btn-pull-single');
  const tenBtn    = document.getElementById('btn-pull-ten');
  if (singleBtn) singleBtn.disabled = player.crystals < window.GACHA_CONFIG.single_cost;
  if (tenBtn)    tenBtn.disabled    = player.crystals < window.GACHA_CONFIG.ten_cost;
}
