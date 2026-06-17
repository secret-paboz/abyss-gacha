/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — HOME.JS
   Home screen, daily login, announcements, voucher redemption
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   INIT (called once after login)
═══════════════════════════════════════════════════════════ */

async function initHomeScreen() {
  // Attempt daily login claim immediately on login
  const result = await claimDailyLogin();
  if (result.claimed) {
    updateTopCrystals();
    showToast(`Daily login reward! +${result.amount} 💎`, 'gold', 3000);
  }
}

/* ═══════════════════════════════════════════════════════════
   RENDER HOME SCREEN
═══════════════════════════════════════════════════════════ */

async function renderHomeScreen() {
  const screen = document.getElementById('screen-home');
  const player = window.GameState.player;

  // Load announcements fresh each visit
  const announcements = await loadAnnouncements();

  // Build HTML
  screen.innerHTML = `
    ${renderKingdomBanner(player)}
    ${renderPlayerStats(player)}
    ${renderDailyLoginCard(player)}
    ${renderPityDisplay(player)}
    ${renderQuickActions()}
    ${renderAnnouncementSection(announcements)}
    ${renderVoucherSection()}
    ${renderRecentPulls()}
    <div style="height: var(--space-lg)"></div>
  `;

  // Wire events
  wireDailyLoginBtn();
  wireQuickActions();
  wireVoucherInput();
}

/* ═══════════════════════════════════════════════════════════
   KINGDOM BANNER
═══════════════════════════════════════════════════════════ */

function renderKingdomBanner(player) {
  const rankNames = { 0:'Abyss Dweller', 1:'Surface Wanderer', 2:'Kingdom Challenger', 3:'Queendom Breaker', 4:'Throne Usurper', 5:'Summit Conqueror' };
  const clearedBosses = [1,2,3,4,5].filter(ch => isStageClear(ch, 0)).length;
  const rankName = rankNames[clearedBosses] || 'Abyss Dweller';

  return `
    <div class="kingdom-banner">
      <div class="kingdom-banner-stars" id="banner-stars"></div>
      <div class="kingdom-icon">
        <iconify-icon icon="game-icons:castle" width="56" height="56"></iconify-icon>
      </div>
      <div class="kingdom-name">ABYSS EMPIRE</div>
      <div class="kingdom-subtitle">"From the depths, I will conquer all"</div>
      <div class="kingdom-rank">
        <iconify-icon icon="game-icons:crown" width="14" height="14"></iconify-icon>
        ${escHtml(rankName)}
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PLAYER STATS ROW
═══════════════════════════════════════════════════════════ */

function renderPlayerStats(player) {
  const totalStages = window.STAGE_DATA.reduce((s, ch) => s + ch.stages.length, 0);
  const clearedStages = window.GameState.progress.filter(p => p.cleared).length;
  const totalCards = window.GameState.collection.length;

  return `
    <div class="stats-row">
      <div class="stat-box">
        <iconify-icon icon="game-icons:crystals" width="24" height="24"></iconify-icon>
        <div class="stat-box-value">${fmtNum(player.crystals)}</div>
        <div class="stat-box-label">Crystals</div>
      </div>
      <div class="stat-box">
        <iconify-icon icon="game-icons:card-pick" width="24" height="24"></iconify-icon>
        <div class="stat-box-value">${fmtNum(player.total_pulls)}</div>
        <div class="stat-box-label">Total Pulls</div>
      </div>
      <div class="stat-box">
        <iconify-icon icon="game-icons:dungeon-gate" width="24" height="24"></iconify-icon>
        <div class="stat-box-value">${clearedStages}/${totalStages}</div>
        <div class="stat-box-label">Stages</div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   DAILY LOGIN CARD
═══════════════════════════════════════════════════════════ */

function renderDailyLoginCard(player) {
  const today       = new Date().toISOString().split('T')[0];
  const alreadyClaimed = player.last_login_date === today;
  const nextReset   = getNextResetTime();

  return `
    <div class="section-header">
      <iconify-icon icon="game-icons:calendar" width="20" height="20"></iconify-icon>
      <h2>Daily Reward</h2>
    </div>
    <div class="daily-card ${alreadyClaimed ? '' : ''}" id="daily-card">
      <div class="daily-card-icon">
        <iconify-icon icon="game-icons:crystals" width="28" height="28"></iconify-icon>
      </div>
      <div class="daily-card-info">
        <div class="daily-card-title">Daily Login Bonus</div>
        <div class="daily-card-reward">
          <iconify-icon icon="game-icons:crystals" width="14" height="14"></iconify-icon>
          +50 Abyss Crystals
        </div>
        <div class="daily-card-status">
          ${alreadyClaimed
            ? `✓ Claimed today &nbsp;·&nbsp; Resets in ${nextReset}`
            : 'Available now!'}
        </div>
      </div>
      <button class="daily-claim-btn ${alreadyClaimed ? 'claimed' : ''}" id="daily-claim-btn">
        ${alreadyClaimed ? '✓ Claimed' : 'Claim'}
      </button>
    </div>
  `;
}

function getNextResetTime() {
  const now       = new Date();
  const tomorrow  = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  const diff      = tomorrow - now;
  const hours     = Math.floor(diff / 3600000);
  const minutes   = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

function wireDailyLoginBtn() {
  const btn = document.getElementById('daily-claim-btn');
  if (!btn || btn.classList.contains('claimed')) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const result = await claimDailyLogin();
    if (result.claimed) {
      const card = document.getElementById('daily-card');
      if (card) card.classList.add('just-claimed');
      btn.textContent = '✓ Claimed';
      btn.classList.add('claimed');
      updateTopCrystals();
      showCrystalFloat(result.amount, btn);
      showToast(`+${result.amount} Abyss Crystals! 💎`, 'gold', 3000);
      // Refresh stats row
      document.querySelector('.stats-row').outerHTML = renderPlayerStats(window.GameState.player);
    } else {
      btn.disabled = false;
      showToast('Already claimed today!', 'info');
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   PITY DISPLAY
═══════════════════════════════════════════════════════════ */

function renderPityDisplay(player) {
  const pity    = player.pity_counter     || 0;
  const pitySur = player.pity_sur_counter || 0;
  const ssrPct  = Math.round((pity    / window.GACHA_CONFIG.pity_ssr) * 100);
  const surPct  = Math.round((pitySur / window.GACHA_CONFIG.pity_sur) * 100);

  return `
    <div class="pity-display">
      <div class="pity-row">
        <iconify-icon icon="game-icons:card-pick" width="14" height="14"
          style="color:var(--rarity-ssr)"></iconify-icon>
        <span style="font-size:0.75rem;color:var(--text-secondary);flex:1">
          SSR+ Pity
        </span>
        <span class="pity-value">${pity} / ${window.GACHA_CONFIG.pity_ssr}</span>
      </div>
      <div class="pity-bar-wrap">
        <div class="pity-bar">
          <div class="pity-bar-fill-ssr" style="width:${ssrPct}%"></div>
        </div>
        <span class="pity-percent">${ssrPct}%</span>
      </div>
      <div class="pity-row" style="margin-top:4px">
        <iconify-icon icon="game-icons:star-prominences" width="14" height="14"
          style="color:var(--rarity-sur)"></iconify-icon>
        <span style="font-size:0.75rem;color:var(--text-secondary);flex:1">
          SUR Pity
        </span>
        <span class="pity-value">${pitySur} / ${window.GACHA_CONFIG.pity_sur}</span>
      </div>
      <div class="pity-bar-wrap">
        <div class="pity-bar">
          <div class="pity-bar-fill-sur" style="width:${surPct}%"></div>
        </div>
        <span class="pity-percent">${surPct}%</span>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   QUICK ACTIONS
═══════════════════════════════════════════════════════════ */

function renderQuickActions() {
  return `
    <div class="section-header">
      <iconify-icon icon="game-icons:lightning-trio" width="20" height="20"></iconify-icon>
      <h2>Quick Actions</h2>
    </div>
    <div class="quick-actions">
      <button class="quick-action-btn" data-goto="gacha">
        <iconify-icon icon="game-icons:card-pick" width="28" height="28"></iconify-icon>
        Pull Gacha
      </button>
      <button class="quick-action-btn" data-goto="battle">
        <iconify-icon icon="game-icons:dungeon-gate" width="28" height="28"></iconify-icon>
        Enter Battle
      </button>
      <button class="quick-action-btn" data-goto="collection">
        <iconify-icon icon="game-icons:scroll-unfurled" width="28" height="28"></iconify-icon>
        My Cards
      </button>
      <button class="quick-action-btn" data-goto="party">
        <iconify-icon icon="game-icons:crossed-swords" width="28" height="28"></iconify-icon>
        Edit Party
      </button>
    </div>
  `;
}

function wireQuickActions() {
  document.querySelectorAll('.quick-action-btn[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.goto));
  });
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENTS
═══════════════════════════════════════════════════════════ */

function renderAnnouncementSection(announcements) {
  const header = `
    <div class="section-header">
      <iconify-icon icon="game-icons:megaphone" width="20" height="20"></iconify-icon>
      <h2>Announcements</h2>
    </div>
  `;

  if (!announcements || announcements.length === 0) {
    return header + `
      <div class="announcement-section">
        <div class="no-announcements">No announcements at this time.</div>
      </div>
    `;
  }

  const items = announcements.map(a => `
    <div class="announcement-card">
      <div class="announcement-header">
        <iconify-icon icon="game-icons:megaphone" width="16" height="16"></iconify-icon>
        <span class="announcement-title">${escHtml(a.title)}</span>
        <span class="announcement-date">${fmtDate(a.created_at)}</span>
      </div>
      <div class="announcement-body">${escHtml(a.message)}</div>
    </div>
  `).join('');

  return header + `<div class="announcement-section">${items}</div>`;
}

/* ═══════════════════════════════════════════════════════════
   VOUCHER SECTION
═══════════════════════════════════════════════════════════ */

function renderVoucherSection() {
  return `
    <div class="voucher-section">
      <div class="voucher-section-title">
        <iconify-icon icon="game-icons:ticket" width="20" height="20"></iconify-icon>
        Redeem Voucher Code
      </div>
      <div class="voucher-input-row">
        <div class="input-group">
          <iconify-icon icon="game-icons:ticket" width="18" height="18"></iconify-icon>
          <input type="text" id="voucher-input" placeholder="ENTER CODE"
            maxlength="32" autocomplete="off" spellcheck="false" />
        </div>
        <button class="voucher-redeem-btn" id="voucher-redeem-btn">Redeem</button>
      </div>
      <div id="voucher-result" class="voucher-result hidden"></div>
    </div>
  `;
}

function wireVoucherInput() {
  const input  = document.getElementById('voucher-input');
  const btn    = document.getElementById('voucher-redeem-btn');
  const result = document.getElementById('voucher-result');
  if (!input || !btn) return;

  // Force uppercase as they type
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });

  btn.addEventListener('click', async () => {
    const code = input.value.trim();
    if (!code) {
      showVoucherResult('Please enter a voucher code.', false);
      return;
    }

    btn.disabled  = true;
    btn.textContent = '...';

    const res = await redeemVoucher(code);

    btn.disabled    = false;
    btn.textContent = 'Redeem';

    if (res.error) {
      showVoucherResult(res.error.message, false);
    } else {
      input.value = '';
      let msg = '✓ Voucher redeemed!';
      if (res.crystals > 0) msg += ` +${fmtNum(res.crystals)} 💎`;
      if (res.card_key) {
        const card = getCardDef(res.card_key);
        if (card) msg += ` + ${card.name}!`;
      }
      showVoucherResult(msg, true);
      updateTopCrystals();
      showCrystalFloat(res.crystals || 0);
    }
  });
}

function showVoucherResult(message, success) {
  const el = document.getElementById('voucher-result');
  if (!el) return;
  el.textContent = message;
  el.className   = `voucher-result ${success ? 'success' : 'error'}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

/* ═══════════════════════════════════════════════════════════
   RECENT PULLS PREVIEW
═══════════════════════════════════════════════════════════ */

function renderRecentPulls() {
  const owned = sortByRarity(getOwnedCardDefs()).slice(0, 10);

  if (owned.length === 0) {
    return `
      <div class="recent-pulls">
        <div class="recent-pulls-title">
          <iconify-icon icon="game-icons:card-pick" width="16" height="16"></iconify-icon>
          Your Best Cards
        </div>
        <div style="font-size:0.8rem;color:var(--text-muted);text-align:center;padding:var(--space-md)">
          No cards yet — go pull!
        </div>
      </div>
    `;
  }

  const chips = owned.map(card => `
    <div class="recent-pull-chip rarity-${card.rarity.toLowerCase()}">
      <iconify-icon icon="${card.icon}" width="20" height="20"
        style="color:${card.icon_color}"></iconify-icon>
      <span class="recent-pull-rarity" style="color:${getRarityColor(card.rarity)}">
        ${card.rarity}
      </span>
    </div>
  `).join('');

  return `
    <div class="recent-pulls">
      <div class="recent-pulls-title">
        <iconify-icon icon="game-icons:card-pick" width="16" height="16"></iconify-icon>
        Your Best Cards
      </div>
      <div class="recent-pull-list">${chips}</div>
    </div>
  `;
}
