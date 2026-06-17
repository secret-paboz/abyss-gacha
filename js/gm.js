/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — GM.JS
   GM Panel: player search, broadcast, vouchers,
   stats dashboard, audit logs
═══════════════════════════════════════════════════════════ */

// GM panel tab state
let gmTab = 'players';

// Currently searched player
let gmTargetPlayer = null;

/* ═══════════════════════════════════════════════════════════
   RENDER GM SCREEN
═══════════════════════════════════════════════════════════ */

function renderGMScreen() {
  // Only role 99 can access
  if (window.GameState.player?.role_id !== 99) {
    document.getElementById('screen-gm').innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="game-icons:padlock" width="48" height="48"></iconify-icon>
        <p>Access denied.</p>
      </div>
    `;
    return;
  }

  const screen = document.getElementById('screen-gm');
  screen.innerHTML = `
    ${renderGMBanner()}
    ${renderGMTabs()}
    <div id="gm-panels">
      ${renderGMPanelPlayers()}
      ${renderGMPanelBroadcast()}
      ${renderGMPanelVouchers()}
      ${renderGMPanelStats()}
      ${renderGMPanelLogs()}
    </div>

    <!-- Confirm overlay -->
    <div id="gm-confirm-overlay" class="hidden">
      <div class="gm-confirm-box" id="gm-confirm-box"></div>
    </div>

    <div style="height:80px"></div>
  `;

  wireGMEvents();
  showGMPanel(gmTab);

  // Auto-load stats and logs
  if (gmTab === 'stats') loadGMStats();
  if (gmTab === 'logs')  loadGMLogs();
}

/* ═══════════════════════════════════════════════════════════
   GM BANNER
═══════════════════════════════════════════════════════════ */

function renderGMBanner() {
  return `
    <div class="gm-banner">
      <iconify-icon icon="game-icons:crown" width="32" height="32"
        class="gm-banner-icon"></iconify-icon>
      <div class="gm-banner-info">
        <div class="gm-banner-title">Game Master Panel</div>
        <div class="gm-banner-sub">Logged in as ${escHtml(window.GameState.player?.username || 'GM')}</div>
      </div>
      <div class="gm-warning-badge">ADMIN</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   GM TABS
═══════════════════════════════════════════════════════════ */

function renderGMTabs() {
  const tabs = [
    { id:'players',   icon:'game-icons:cowled',         label:'Players'   },
    { id:'broadcast', icon:'game-icons:megaphone',       label:'Broadcast' },
    { id:'vouchers',  icon:'game-icons:ticket',          label:'Vouchers'  },
    { id:'stats',     icon:'game-icons:chart-bars',      label:'Stats'     },
    { id:'logs',      icon:'game-icons:scroll-unfurled', label:'Logs'      },
  ];

  return `
    <div class="gm-tabs">
      ${tabs.map(t => `
        <button class="gm-tab-btn ${gmTab === t.id ? 'active' : ''}"
          data-tab="${t.id}">
          <iconify-icon icon="${t.icon}" width="16" height="16"></iconify-icon>
          ${t.label}
        </button>
      `).join('')}
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PANEL 1: PLAYERS
═══════════════════════════════════════════════════════════ */

function renderGMPanelPlayers() {
  return `
    <div class="gm-panel" id="gm-panel-players">

      <!-- Search -->
      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:magnifying-glass" width="14" height="14"></iconify-icon>
          Search Player
        </div>
        <div class="gm-card-body">
          <div class="gm-search-row">
            <div class="input-group">
              <iconify-icon icon="game-icons:cowled" width="18" height="18"></iconify-icon>
              <input type="text" id="gm-search-input"
                placeholder="Enter username" autocomplete="off" />
            </div>
            <button class="gm-search-btn" id="gm-search-btn">Search</button>
          </div>
          <div id="gm-player-result" class="gm-player-result hidden"></div>
        </div>
      </div>

    </div>
  `;
}

function renderPlayerResult(player) {
  const roleNames = { 0:'Player', 1:'Veteran', 2:'VIP', 99:'Game Master' };

  return `
    <div class="gm-player-top">
      <div class="gm-player-avatar">
        <iconify-icon icon="game-icons:cowled" width="24" height="24"></iconify-icon>
      </div>
      <div>
        <div class="gm-player-name">${escHtml(player.username)}</div>
        <div class="gm-player-email">ID: ${player.id.slice(0,8)}...</div>
        <div style="font-size:0.72rem;color:${player.is_banned ? 'var(--color-danger)' : 'var(--color-success)'}">
          ${player.is_banned ? '🔴 Banned' : '🟢 Active'}
        </div>
      </div>
    </div>

    <div class="gm-player-meta">
      <div class="gm-meta-box">
        <div class="gm-meta-value">${fmtNum(player.crystals)}</div>
        <div class="gm-meta-label">Crystals</div>
      </div>
      <div class="gm-meta-box">
        <div class="gm-meta-value">${fmtNum(player.total_pulls)}</div>
        <div class="gm-meta-label">Pulls</div>
      </div>
      <div class="gm-meta-box">
        <div class="gm-meta-value">${roleNames[player.role_id] || 'Player'}</div>
        <div class="gm-meta-label">Role</div>
      </div>
    </div>

    <div class="gm-player-actions">

      <!-- Give/Remove Crystals -->
      <div class="gm-action-row">
        <span class="gm-action-label">💎 Crystals</span>
        <input type="number" class="gm-action-input" id="gm-crystal-amount"
          placeholder="Amount" min="1" max="999999" />
        <button class="gm-action-btn add" onclick="gmActionGiveCrystals()">Give</button>
        <button class="gm-action-btn remove" onclick="gmActionRemoveCrystals()">Remove</button>
      </div>

      <!-- Change Role -->
      <div class="gm-action-row">
        <span class="gm-action-label">👑 Role</span>
        <select class="gm-role-select" id="gm-role-select">
          <option value="0">Player (0)</option>
          <option value="1">Veteran (1)</option>
          <option value="2">VIP (2)</option>
          <option value="99">Game Master (99)</option>
        </select>
        <button class="gm-action-btn set" onclick="gmActionSetRole()">Set</button>
      </div>

      <!-- Give Card -->
      <div class="gm-action-row">
        <span class="gm-action-label">🃏 Card</span>
        <input type="text" class="gm-action-input" id="gm-card-search-input"
          placeholder="Search card name..." autocomplete="off" />
        <input type="number" class="gm-action-input" id="gm-card-qty"
          placeholder="Qty" min="1" value="1" style="max-width:52px" />
        <button class="gm-action-btn add" onclick="gmActionGiveCard()">Give</button>
      </div>

      <!-- Card search results -->
      <div id="gm-card-results" class="gm-card-results" style="display:none"></div>
      <input type="hidden" id="gm-selected-card-key" />

      <!-- Ban / Unban -->
      <div class="gm-ban-row">
        <span class="gm-ban-label">
          <iconify-icon icon="game-icons:cancel" width="14" height="14"></iconify-icon>
          ${gmTargetPlayer?.is_banned ? 'Player is BANNED' : 'Ban Player'}
        </span>
        <button class="gm-action-btn ${gmTargetPlayer?.is_banned ? 'add' : 'remove'}"
          onclick="gmActionToggleBan()">
          ${gmTargetPlayer?.is_banned ? 'Unban' : 'Ban'}
        </button>
      </div>

    </div>

    <div id="gm-player-msg" class="gm-result-msg hidden"></div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PANEL 2: BROADCAST
═══════════════════════════════════════════════════════════ */

function renderGMPanelBroadcast() {
  return `
    <div class="gm-panel" id="gm-panel-broadcast">

      <!-- Broadcast Crystals -->
      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:crystals" width="14" height="14"></iconify-icon>
          Give Crystals to ALL Players
        </div>
        <div class="gm-card-body">
          <div class="gm-crystal-amount-row">
            <input type="number" class="gm-action-input" id="gm-broadcast-crystal-amount"
              placeholder="Amount to give all players" min="1" max="99999" />
          </div>
          <div class="gm-broadcast-warning">
            <iconify-icon icon="game-icons:warning-sign" width="12" height="12"></iconify-icon>
            This sends a claimable notification to every player.
          </div>
          <button class="gm-broadcast-btn" id="btn-broadcast-crystals">
            <iconify-icon icon="game-icons:crystals" width="18" height="18"></iconify-icon>
            Broadcast Crystals to All
          </button>
          <div id="broadcast-crystal-msg" class="gm-result-msg hidden"></div>
        </div>
      </div>

      <!-- Post Announcement -->
      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:megaphone" width="14" height="14"></iconify-icon>
          Post Announcement
        </div>
        <div class="gm-card-body">
          <div class="gm-announcement-form">
            <input type="text" class="gm-action-input" id="gm-announce-title"
              placeholder="Announcement title" />
            <textarea class="gm-textarea" id="gm-announce-body"
              placeholder="Write your announcement here..."></textarea>
            <button class="gm-broadcast-btn" id="btn-post-announce">
              <iconify-icon icon="game-icons:megaphone" width="18" height="18"></iconify-icon>
              Post Announcement
            </button>
          </div>
          <div id="announce-msg" class="gm-result-msg hidden"></div>
        </div>
      </div>

      <!-- Active Announcements -->
      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:scroll-unfurled" width="14" height="14"></iconify-icon>
          Active Announcements
        </div>
        <div class="gm-card-body">
          <div id="gm-announcement-list">
            <div style="color:var(--text-muted);font-size:0.8rem">Loading...</div>
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PANEL 3: VOUCHERS
═══════════════════════════════════════════════════════════ */

function renderGMPanelVouchers() {
  return `
    <div class="gm-panel" id="gm-panel-vouchers">

      <!-- Create Voucher -->
      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:ticket" width="14" height="14"></iconify-icon>
          Create Voucher Code
        </div>
        <div class="gm-card-body">
          <div class="gm-voucher-form">

            <div class="gm-voucher-row">
              <label>Code</label>
              <input type="text" class="gm-voucher-input" id="vc-code"
                placeholder="MYCODE2025" maxlength="32" />
            </div>

            <div class="gm-voucher-row">
              <label>Reward</label>
              <select class="gm-voucher-select" id="vc-reward-type">
                <option value="crystals">Crystals Only</option>
                <option value="card">Card Only</option>
                <option value="multi">Crystals + Card</option>
              </select>
            </div>

            <div class="gm-voucher-row">
              <label>Crystals</label>
              <input type="number" class="gm-voucher-input" id="vc-crystals"
                placeholder="0" min="0" value="0" />
            </div>

            <div class="gm-voucher-row">
              <label>Card Key</label>
              <input type="text" class="gm-voucher-input" id="vc-card-key"
                placeholder="e.g. sur_mei (optional)" style="text-transform:lowercase;letter-spacing:0" />
            </div>

            <div class="gm-voucher-row">
              <label>Max Uses</label>
              <input type="number" class="gm-voucher-input" id="vc-max-uses"
                placeholder="-1 = unlimited" value="1" />
            </div>

            <div class="gm-voucher-row">
              <label>Min Role</label>
              <select class="gm-voucher-select" id="vc-role-req">
                <option value="0">All Players</option>
                <option value="1">Veteran+</option>
                <option value="2">VIP+</option>
                <option value="99">GM Only</option>
              </select>
            </div>

            <div class="gm-voucher-row">
              <label>Expires</label>
              <input type="date" class="gm-voucher-input" id="vc-expires"
                style="color-scheme:dark" />
            </div>

            <button class="gm-broadcast-btn" id="btn-create-voucher">
              <iconify-icon icon="game-icons:ticket" width="18" height="18"></iconify-icon>
              Create Voucher
            </button>
            <div id="voucher-create-msg" class="gm-result-msg hidden"></div>
          </div>
        </div>
      </div>

      <!-- Active Vouchers List -->
      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:ticket" width="14" height="14"></iconify-icon>
          Active Vouchers
        </div>
        <div class="gm-card-body">
          <div id="gm-voucher-list">
            <div style="color:var(--text-muted);font-size:0.8rem">Loading...</div>
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PANEL 4: STATS
═══════════════════════════════════════════════════════════ */

function renderGMPanelStats() {
  return `
    <div class="gm-panel" id="gm-panel-stats">
      <div class="gm-stats-grid" id="gm-stats-grid">
        ${renderGMStatBox('game-icons:group', 'Total Players', '...', 'gm-stat-total')}
        ${renderGMStatBox('game-icons:calendar', 'Active Today', '...', 'gm-stat-today')}
        ${renderGMStatBox('game-icons:card-pick', 'Total Cards', '...', 'gm-stat-cards')}
        ${renderGMStatBox('game-icons:dungeon-gate', 'Stages Cleared', '...', 'gm-stat-stages')}
      </div>

      <div class="gm-card">
        <div class="gm-card-header">
          <iconify-icon icon="game-icons:chart-bars" width="14" height="14"></iconify-icon>
          Top Pulled Cards
        </div>
        <div class="gm-card-body">
          <div id="gm-top-pulls" class="gm-top-pulls">
            <div style="color:var(--text-muted);font-size:0.8rem">Loading...</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGMStatBox(icon, label, value, id) {
  return `
    <div class="gm-stat-box">
      <iconify-icon icon="${icon}" width="24" height="24"></iconify-icon>
      <div class="gm-stat-value" id="${id}">${value}</div>
      <div class="gm-stat-label">${label}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   PANEL 5: LOGS
═══════════════════════════════════════════════════════════ */

function renderGMPanelLogs() {
  const filters = ['All','give_crystals','give_card','set_role','ban_player','broadcast_crystals','post_announcement','create_voucher'];

  return `
    <div class="gm-panel" id="gm-panel-logs">
      <div class="gm-log-filters">
        ${filters.map((f, i) => `
          <button class="gm-log-filter-chip ${i === 0 ? 'active' : ''}"
            data-filter="${f}">${f === 'All' ? 'All' : f.replace(/_/g,' ')}</button>
        `).join('')}
      </div>
      <div id="gm-logs-list" class="gm-logs-list">
        <div style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:var(--space-lg)">
          Loading logs...
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   WIRE EVENTS
═══════════════════════════════════════════════════════════ */

function wireGMEvents() {
  // Tab switching
  document.querySelectorAll('.gm-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      gmTab = btn.dataset.tab;
      document.querySelectorAll('.gm-tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === gmTab));
      showGMPanel(gmTab);
    });
  });

  // Player search
  document.getElementById('gm-search-btn')
    ?.addEventListener('click', gmSearchPlayerAction);
  document.getElementById('gm-search-input')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') gmSearchPlayerAction(); });

  // Card search (live)
  let cardTimer;
  document.getElementById('gm-card-search-input')
    ?.addEventListener('input', e => {
      clearTimeout(cardTimer);
      cardTimer = setTimeout(() => gmSearchCards(e.target.value), 300);
    });

  // Broadcast crystals
  document.getElementById('btn-broadcast-crystals')
    ?.addEventListener('click', gmActionBroadcastCrystals);

  // Post announcement
  document.getElementById('btn-post-announce')
    ?.addEventListener('click', gmActionPostAnnouncement);

  // Create voucher
  document.getElementById('btn-create-voucher')
    ?.addEventListener('click', gmActionCreateVoucher);

  // Log filters
  document.querySelectorAll('.gm-log-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.gm-log-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadGMLogs(chip.dataset.filter === 'All' ? null : chip.dataset.filter);
    });
  });

  // Confirm overlay
  document.getElementById('gm-confirm-overlay')
    ?.addEventListener('click', e => {
      if (e.target.id === 'gm-confirm-overlay') closeGMConfirm();
    });
}

function showGMPanel(tabId) {
  document.querySelectorAll('.gm-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`gm-panel-${tabId}`)?.classList.add('active');

  // Load data for specific panels
  if (tabId === 'stats')     loadGMStats();
  if (tabId === 'logs')      loadGMLogs();
  if (tabId === 'broadcast') loadGMAnnouncements();
  if (tabId === 'vouchers')  loadGMVouchersPanel();
}

/* ═══════════════════════════════════════════════════════════
   PLAYER SEARCH ACTION
═══════════════════════════════════════════════════════════ */

async function gmSearchPlayerAction() {
  const input    = document.getElementById('gm-search-input');
  const resultEl = document.getElementById('gm-player-result');
  const username = input?.value.trim();

  if (!username) { showToast('Enter a username to search.', 'error'); return; }

  const btn = document.getElementById('gm-search-btn');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }

  const { data, error } = await gmSearchPlayer(username);

  if (btn) { btn.disabled = false; btn.textContent = 'Search'; }

  if (error || !data) {
    if (resultEl) {
      resultEl.innerHTML = `<div style="color:var(--color-danger);font-size:0.82rem">Player not found.</div>`;
      resultEl.classList.remove('hidden');
    }
    return;
  }

  gmTargetPlayer = data;

  if (resultEl) {
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = renderPlayerResult(data);

    // Set role select to current role
    const roleSelect = document.getElementById('gm-role-select');
    if (roleSelect) roleSelect.value = data.role_id;

    // Wire card search live
    document.getElementById('gm-card-search-input')
      ?.addEventListener('input', e => gmSearchCards(e.target.value));
  }
}

/* ═══════════════════════════════════════════════════════════
   PLAYER ACTIONS
═══════════════════════════════════════════════════════════ */

async function gmActionGiveCrystals() {
  if (!gmTargetPlayer) return;
  const amount = parseInt(document.getElementById('gm-crystal-amount')?.value);
  if (!amount || amount <= 0) { showToast('Enter a valid amount.', 'error'); return; }

  await gmConfirm(
    `Give ${fmtNum(amount)} crystals to ${gmTargetPlayer.username}?`,
    async () => {
      const { error } = await gmGiveCrystals(gmTargetPlayer.id, amount);
      showGMPlayerMsg(error ? error.message : `✓ Gave ${fmtNum(
