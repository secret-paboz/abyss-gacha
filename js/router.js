/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — ROUTER.JS
   Screen navigation, auth state, app init, toast system
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   APP INITIALIZATION
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  // Show loading screen
  showScreen('loading');
  animateLoadingBar();

  // Wire up auth form events first
  initAuthListeners();

  // Check session directly — simpler and more reliable
  try {
    const session = await authGetSession();
    if (session) {
      await onUserSignedIn();
    } else {
      showScreen('auth');
      showAuthPanel('login');
    }
  } catch (err) {
    console.error('[Init error]', err);
    showScreen('auth');
    showAuthPanel('login');
  }

  // Listen for auth state changes AFTER initial check
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      await onUserSignedIn();
    }
    if (event === 'SIGNED_OUT') {
      onUserSignedOut();
    }
    if (event === 'PASSWORD_RECOVERY') {
      showScreen('auth');
      showAuthPanel('reset');
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   AUTH STATE HANDLERS
═══════════════════════════════════════════════════════════ */

async function onUserSignedIn() {
  const result = await loadPlayerData();

  if (result === 'banned') {
    showScreen('auth');
    showAuthPanel('login');
    showAuthError('login', 'Your account has been suspended. Contact support.');
    return;
  }

  if (!result) {
    showScreen('auth');
    showAuthPanel('login');
    showAuthError('login', 'Failed to load player data. Please try again.');
    return;
  }

  // Init the game UI
  initGameUI();
  showGameWrapper();
  navigateTo('home');
  initHomeScreen();
}

function onUserSignedOut() {
  hideGameWrapper();
  showScreen('auth');
  showAuthPanel('login');
  clearAuthForms();
}

/* ═══════════════════════════════════════════════════════════
   SCREEN SYSTEM
═══════════════════════════════════════════════════════════ */

/**
 * Show a full-screen overlay (loading, auth)
 */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if (target) target.classList.add('active');
}

/**
 * Show the game wrapper (after login)
 */
function showGameWrapper() {
  document.getElementById('game-wrapper').classList.remove('hidden');
  // Hide all full-screen overlays
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
}

/**
 * Hide the game wrapper (on logout)
 */
function hideGameWrapper() {
  document.getElementById('game-wrapper').classList.add('hidden');
}

/**
 * Navigate to a game screen (home, gacha, collection, etc.)
 */
function navigateTo(screenName) {
  // Update game screens
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${screenName}`);
  if (target) target.classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenName);
  });

  // Trigger screen-specific init
  switch (screenName) {
    case 'home':       renderHomeScreen();       break;
    case 'gacha':      renderGachaScreen();      break;
    case 'collection': renderCollectionScreen(); break;
    case 'party':      renderPartyScreen();      break;
    case 'battle':     renderBattleScreen();     break;
    case 'profile':    renderProfileScreen();    break;
    case 'gm':         renderGMScreen();         break;
  }
}

/* ═══════════════════════════════════════════════════════════
   GAME UI INIT (runs once after login)
═══════════════════════════════════════════════════════════ */

function initGameUI() {
  const player = window.GameState.player;

  // Set top bar username
  document.getElementById('top-username').textContent = player.username;

  // Set role badge
  const roleBadge = document.getElementById('top-role-badge');
  const roleNames = { 0: '', 1: 'Veteran', 2: 'VIP', 99: '👑 GM' };
  const roleClasses = { 0: '', 1: '', 2: 'role-vip', 99: 'role-gm' };
  roleBadge.textContent  = roleNames[player.role_id] || '';
  roleBadge.className    = roleClasses[player.role_id] || '';
  if (!roleNames[player.role_id]) roleBadge.style.display = 'none';

  // Set top crystals
  updateTopCrystals();

  // Show GM nav tab if GM
  if (player.role_id === 99) {
    document.getElementById('nav-gm').classList.remove('hidden');
  }

  // Update notification bell
  updateNotifBell();

  // Wire nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
  });

  // Wire notification bell
  document.getElementById('notif-bell').addEventListener('click', openNotifPanel);
  document.getElementById('notif-close').addEventListener('click', closeNotifPanel);
}

/* ═══════════════════════════════════════════════════════════
   TOP BAR UPDATES
═══════════════════════════════════════════════════════════ */

function updateTopCrystals() {
  const crystals = window.GameState.player?.crystals || 0;
  document.getElementById('top-crystals').textContent = crystals.toLocaleString();
}

function updateNotifBell() {
  const count    = window.GameState.notifs?.length || 0;
  const countEl  = document.getElementById('notif-count');
  if (count > 0) {
    countEl.textContent = count > 99 ? '99+' : count;
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATION PANEL
═══════════════════════════════════════════════════════════ */

function openNotifPanel() {
  renderNotifPanel();
  document.getElementById('notif-panel').classList.remove('hidden');
}

function closeNotifPanel() {
  document.getElementById('notif-panel').classList.add('hidden');
}

function renderNotifPanel() {
  const list   = document.getElementById('notif-list');
  const notifs = window.GameState.notifs || [];

  if (notifs.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <iconify-icon icon="game-icons:bell" width="40" height="40"></iconify-icon>
        <p>No new notifications</p>
      </div>`;
    return;
  }

  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${!n.is_read ? 'unread' : ''}" data-id="${n.id}">
      <div class="notif-item-title">${escHtml(n.title)}</div>
      <div class="notif-item-msg">${escHtml(n.message)}</div>
      ${n.reward_type ? `
        <button class="notif-claim-btn btn-primary btn-small"
          onclick="handleClaimNotif(${n.id})">
          Claim Reward
        </button>` : ''}
    </div>
  `).join('');

  // Mark unread as read
  notifs.filter(n => !n.is_read).forEach(n => markNotifRead(n.id));
}

async function handleClaimNotif(notifId) {
  const notif = window.GameState.notifs.find(n => n.id === notifId);
  if (!notif) return;

  await claimNotifReward(notif);
  updateTopCrystals();
  updateNotifBell();
  renderNotifPanel();
  showToast('Reward claimed!', 'success');
}

/* ═══════════════════════════════════════════════════════════
   AUTH PANELS
═══════════════════════════════════════════════════════════ */

function showAuthPanel(name) {
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`auth-${name}`);
  if (target) target.classList.add('active');
}

function initAuthListeners() {
  // Panel switchers
  document.getElementById('goto-register').addEventListener('click', () => showAuthPanel('register'));
  document.getElementById('goto-reset').addEventListener('click',    () => showAuthPanel('reset'));
  document.getElementById('goto-login').addEventListener('click',   () => showAuthPanel('login'));
  document.getElementById('goto-login-from-reset').addEventListener('click', () => showAuthPanel('login'));

  // Login form
  document.getElementById('btn-login').addEventListener('click', handleLogin);

  // Allow Enter key to submit
  ['login-username', 'login-password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });

  // Register form
  document.getElementById('btn-register').addEventListener('click', handleRegister);

  // Password strength checker
  document.getElementById('reg-password').addEventListener('input', e => {
    checkPasswordStrength(e.target.value);
  });

  // Username availability check
  let usernameTimer;
  document.getElementById('reg-username').addEventListener('input', e => {
    clearTimeout(usernameTimer);
    usernameTimer = setTimeout(() => checkUsernameAvailability(e.target.value), 600);
  });

  // Reset form
  document.getElementById('btn-reset').addEventListener('click', handleReset);
}

/* ═══════════════════════════════════════════════════════════
   AUTH HANDLERS
═══════════════════════════════════════════════════════════ */

async function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  clearAuthError('login');

  if (!username || !password) {
    showAuthError('login', 'Please enter your username and password.');
    return;
  }

  setAuthLoading('btn-login', true);

  const { error } = await authLogin(username, password);

  setAuthLoading('btn-login', false);

  if (error) {
    showAuthError('login', error.message);
  }
  // Success handled by onAuthStateChange
}

async function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;

  clearAuthError('reg');

  // Validate
  if (!username || !email || !password || !confirm) {
    showAuthError('reg', 'Please fill in all fields.');
    return;
  }

  if (username.length < 3 || username.length > 20) {
    showAuthError('reg', 'Username must be 3–20 characters.');
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showAuthError('reg', 'Username can only contain letters, numbers and underscores.');
    return;
  }

  if (!email.includes('@')) {
    showAuthError('reg', 'Please enter a valid email address.');
    return;
  }

  if (password.length < 6) {
    showAuthError('reg', 'Password must be at least 6 characters.');
    return;
  }

  if (password !== confirm) {
    showAuthError('reg', 'Passwords do not match.');
    return;
  }

  setAuthLoading('btn-register', true);

  const { error } = await authRegister(username, email, password);

  setAuthLoading('btn-register', false);

  if (error) {
    showAuthError('reg', error.message);
  }
  // Success handled by onAuthStateChange
}

async function handleReset() {
  const input = document.getElementById('reset-input').value.trim();

  clearAuthError('reset');
  document.getElementById('reset-success').classList.add('hidden');

  if (!input) {
    showAuthError('reset', 'Please enter your username or email.');
    return;
  }

  setAuthLoading('btn-reset', true);

  const { error } = await authResetPassword(input);

  setAuthLoading('btn-reset', false);

  if (error) {
    showAuthError('reset', error.message);
  } else {
    const successEl = document.getElementById('reset-success');
    successEl.textContent = 'Reset link sent! Check your email inbox.';
    successEl.classList.remove('hidden');
  }
}

/* ═══════════════════════════════════════════════════════════
   AUTH UI HELPERS
═══════════════════════════════════════════════════════════ */

function showAuthError(panel, message) {
  const el = document.getElementById(`${panel}-error`);
  if (el) {
    el.textContent = message;
    el.classList.remove('hidden');
  }
}

function clearAuthError(panel) {
  const el = document.getElementById(`${panel}-error`);
  if (el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

function setAuthLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

function clearAuthForms() {
  ['login-username','login-password',
   'reg-username','reg-email','reg-password','reg-confirm',
   'reset-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['login','reg','reset'].forEach(p => clearAuthError(p));
  document.getElementById('reset-success')?.classList.add('hidden');
}

async function checkUsernameAvailability(username) {
  const el = document.querySelector('.username-check');
  if (!el) return;

  if (username.length < 3) {
    el.textContent = '';
    el.className = 'username-check';
    return;
  }

  el.textContent = 'Checking...';
  el.className   = 'username-check checking';

  const { data } = await sb
    .from('players')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (data) {
    el.textContent = '✕ Username taken';
    el.className   = 'username-check taken';
  } else {
    el.textContent = '✓ Username available';
    el.className   = 'username-check available';
  }
}

function checkPasswordStrength(password) {
  const bars  = document.querySelectorAll('.strength-bar');
  if (!bars.length) return;

  bars.forEach(b => {
    b.classList.remove('weak','medium','strong');
    b.style.background = '';
  });

  if (!password) return;

  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;

  const classes = ['weak','medium','strong'];
  for (let i = 0; i < score; i++) {
    bars[i]?.classList.add(classes[score - 1]);
  }
}

/* ═══════════════════════════════════════════════════════════
   LOADING BAR ANIMATION
═══════════════════════════════════════════════════════════ */

function animateLoadingBar() {
  const fill = document.querySelector('.loading-bar-fill');
  if (fill) {
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = '100%'; }, 100);
  }
}

/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════════ */

let toastTimer = null;

/**
 * Show a toast message
 * @param {string} message
 * @param {'success'|'error'|'info'|'gold'|''} type
 * @param {number} duration  ms
 */
function showToast(message, type = '', duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  // Clear existing timer
  if (toastTimer) clearTimeout(toastTimer);

  toast.textContent = message;
  toast.className   = `toast toast-${type}`;
  toast.style.opacity = '1';

  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════
   CRYSTAL FLOAT ANIMATION
═══════════════════════════════════════════════════════════ */

/**
 * Show a floating +N crystals animation
 * @param {number} amount
 * @param {HTMLElement|null} anchorEl  element to float near
 */
function showCrystalFloat(amount, anchorEl = null) {
  const el = document.createElement('div');
  el.className   = 'crystal-float';
  el.textContent = `+${amount} 💎`;

  // Position near anchor or top bar
  if (anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top  = `${rect.top}px`;
  } else {
    el.style.right = '20px';
    el.style.top   = '60px';
  }

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/* ═══════════════════════════════════════════════════════════
   UTILITY FUNCTIONS (shared across all JS files)
═══════════════════════════════════════════════════════════ */

/**
 * Escape HTML to prevent XSS
 */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/**
 * Format a number with commas
 */
function fmtNum(n) {
  return Number(n || 0).toLocaleString();
}

/**
 * Format a date string to readable format
 */
function fmtDate(dateStr) {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

/**
 * Get rarity display color (for inline styles)
 */
function getRarityColor(rarity) {
  const map = {
    E:'#444', N:'#888', R:'#30cc44', SR:'#3090ff',
    SSR:'#9b30ff', SSSR:'#ff4422', UR:'#ff8c00',
    SUR:'#f0c040', EX:'#ff30ff'
  };
  return map[rarity] || '#888';
}

/**
 * Get card type icon key (Iconify)
 */
function getCardTypeIcon(cardType) {
  const map = {
    summon:     'game-icons:cowled',
    equipment:  'game-icons:broadsword',
    magic:      'game-icons:magic-swirl',
    consumable: 'game-icons:potion-ball',
  };
  return map[cardType] || 'game-icons:card-pick';
}

/**
 * Get rarity badge HTML
 */
function rarityBadgeHtml(rarity) {
  return `<span class="rarity-badge badge-${rarity.toLowerCase()}">${rarity}</span>`;
}

/**
 * Get iconify icon HTML string
 */
function icon(iconKey, size = 20, color = '') {
  const style = color ? `style="color:${color}"` : '';
  return `<iconify-icon icon="${iconKey}" width="${size}" height="${size}" ${style}></iconify-icon>`;
}

/**
 * Clamp a value between min and max
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Calculate HP bar percentage color
 */
function hpBarColor(current, max) {
  const pct = current / max;
  if (pct > 0.5) return 'var(--color-success)';
  if (pct > 0.25) return 'var(--rarity-ur)';
  return 'var(--color-danger)';
}

/**
 * Delay helper for animations
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get a card definition by key from the global card data
 */
function getCardDef(cardKey) {
  return window.CARD_DATA?.find(c => c.card_key === cardKey) || null;
}

/**
 * Get all card definitions owned by player
 */
function getOwnedCardDefs(filterType = null) {
  return window.GameState.collection
    .map(c => {
      const def = getCardDef(c.card_key);
      if (!def) return null;
      if (filterType && def.card_type !== filterType) return null;
      return { ...def, quantity: c.quantity };
    })
    .filter(Boolean);
}

/**
 * Sort cards by rarity (highest first)
 */
function sortByRarity(cards) {
  const order = { EX:9, SUR:8, UR:7, SSSR:6, SSR:5, SR:4, R:3, N:2, E:1 };
  return [...cards].sort((a, b) => (order[b.rarity] || 0) - (order[a.rarity] || 0));
}

/* ═══════════════════════════════════════════════════════════
   RENDER STUBS (called by navigateTo — defined in other files)
   These get overridden by the actual implementations below
═══════════════════════════════════════════════════════════ */

// These functions are defined in their respective JS files:
// renderHomeScreen()       → home.js
// renderGachaScreen()      → gacha.js
// renderCollectionScreen() → collection.js
// renderPartyScreen()      → party.js
// renderBattleScreen()     → battle.js
// renderProfileScreen()    → profile.js
// renderGMScreen()         → gm.js
// initHomeScreen()         → home.js
