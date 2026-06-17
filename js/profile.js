/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — PROFILE.JS
   Player profile, stats, account settings, logout
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   RENDER PROFILE SCREEN
═══════════════════════════════════════════════════════════ */

function renderProfileScreen() {
  const screen = document.getElementById('screen-profile');
  const player = window.GameState.player;

  screen.innerHTML = `
    ${renderProfileHero(player)}
    ${renderCrystalCard(player)}
    ${renderProfileStatsGrid(player)}
    ${renderPullBreakdown(player)}
    ${renderMilestones(player)}
    ${renderAccountSettings()}
    ${renderProfileCredits()}
    <div style="height:80px"></div>

    <!-- Logout confirm overlay -->
    <div id="logout-confirm-overlay" class="hidden">
      <div class="logout-confirm-box">
        <iconify-icon icon="game-icons:exit-door" width="40" height="40"
          class="logout-confirm-icon"></iconify-icon>
        <div class="logout-confirm-title">Leave the Abyss?</div>
        <div class="logout-confirm-text">
          Your progress is saved. You can return anytime.
        </div>
        <div class="logout-confirm-actions">
          <button class="logout-cancel-btn" id="logout-cancel">Stay</button>
          <button class="logout-confirm-btn" id="logout-confirm">Logout</button>
        </div>
      </div>
    </div>
  `;

  wireProfileEvents();
}

/* ═══════════════════════════════════════════════════════════
   PROFILE HERO
═══════════════════════════════════════════════════════════ */

function renderProfileHero(player) {
  const roleNames   = { 0:'Player', 1:'Veteran', 2:'VIP', 99:'Game Master' };
  const roleClasses = { 0:'role-0', 1:'role-1', 2:'role-2', 99:'role-99' };
  const avatarClass = { 0:'', 1:'role-veteran', 2:'role-vip', 99:'role-gm' };
  const roleName    = roleNames[player.role_id]   || 'Player';
  const roleClass   = roleClasses[player.role_id] || 'role-0';
  const avClass     = avatarClass[player.role_id] || '';

  const joinedDate  = fmtDate(player.created_at);
  const daysActive  = player.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(player.created_at)) / 86400000))
    : 1;

  return `
    <div class="profile-hero">
      <div class="profile-avatar ${avClass}">
        <iconify-icon icon="game-icons:cowled" width="36" height="36"></iconify-icon>
      </div>
      <div class="profile-info">
        <div class="profile-username">${escHtml(player.username)}</div>
        <div class="profile-role-badge ${roleClass}">
          ${player.role_id === 99 ? '👑 ' : ''}${escHtml(roleName)}
        </div>
        <div class="profile-joined">
          <iconify-icon icon="game-icons:calendar" width="12" height="12"></iconify-icon>
          Joined ${joinedDate} · ${daysActive} day${daysActive !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   CRYSTAL BALANCE
═══════════════════════════════════════════════════════════ */

function renderCrystalCard(player) {
  return `
    <div class="profile-crystal-card">
      <div class="profile-crystal-left">
        <iconify-icon icon="game-icons:crystals" width="22" height="22"></iconify-icon>
        Abyss Crystals
      </div>
      <div class="profile-crystal-amount">${fmtNum(player.crystals)}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   STATS GRID
═══════════════════════════════════════════════════════════ */

function renderProfileStatsGrid(player) {
  const totalCards    = window.GameState.collection.length;
  const clearedStages = window.GameState.progress.filter(p => p.cleared).length;
  const totalStages   = window.STAGE_DATA.reduce((s, ch) => s + ch.stages.length, 0);
  const daysActive    = player.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(player.created_at)) / 86400000))
    : 1;

  const stats = [
    {
      icon:'game-icons:card-pick', bgClass:'stat-icon-pulls',
      value: fmtNum(player.total_pulls),
      label:'Total Pulls',
    },
    {
      icon:'game-icons:dungeon-gate', bgClass:'stat-icon-stages',
      value: `${clearedStages}/${totalStages}`,
      label:'Stages Cleared',
    },
    {
      icon:'game-icons:scroll-unfurled', bgClass:'stat-icon-cards',
      value: fmtNum(totalCards),
      label:'Cards Owned',
    },
    {
      icon:'game-icons:calendar', bgClass:'stat-icon-days',
      value: fmtNum(daysActive),
      label:'Days Active',
    },
  ];

  const cards = stats.map(s => `
    <div class="profile-stat-card">
      <div class="profile-stat-icon ${s.bgClass}">
        <iconify-icon icon="${s.icon}" width="22" height="22"></iconify-icon>
      </div>
      <div class="profile-stat-info">
        <div class="profile-stat-value">${s.value}</div>
        <div class="profile-stat-label">${s.label}</div>
      </div>
    </div>
  `).join('');

  return `<div class="profile-stats-grid">${cards}</div>`;
}

/* ═══════════════════════════════════════════════════════════
   PULL RARITY BREAKDOWN
═══════════════════════════════════════════════════════════ */

function renderPullBreakdown(player) {
  // Count cards by rarity from collection
  const rarityCounts = {};
  window.GameState.collection.forEach(c => {
    const def = getCardDef(c.card_key);
    if (!def) return;
    rarityCounts[def.rarity] = (rarityCounts[def.rarity] || 0) + 1;
  });

  const rarities  = ['EX','SUR','UR','SSSR','SSR','SR','R','N','E'];
  const maxCount  = Math.max(...Object.values(rarityCounts), 1);

  const rows = rarities.map(r => {
    const count = rarityCounts[r] || 0;
    const pct   = Math.round((count / maxCount) * 100);
    return `
      <div class="pull-breakdown-row">
        <span class="pull-breakdown-label" style="color:${getRarityColor(r)}">${r}</span>
        <div class="pull-breakdown-bar">
          <div class="pull-breakdown-fill fill-${r.toLowerCase()}"
            style="width:${pct}%"></div>
        </div>
        <span class="pull-breakdown-count">${count}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="pull-breakdown">
      <div class="pull-breakdown-title">
        <iconify-icon icon="game-icons:card-pick" width="14" height="14"></iconify-icon>
        Card Collection by Rarity
      </div>
      <div class="pull-breakdown-rows">${rows}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   MILESTONES
═══════════════════════════════════════════════════════════ */

function renderMilestones(player) {
  const collection    = window.GameState.collection;
  const cleared       = window.GameState.progress.filter(p => p.cleared).length;
  const hasSUR        = collection.some(c => {
    const def = getCardDef(c.card_key);
    return def && (def.rarity === 'SUR' || def.rarity === 'EX');
  });

  const milestones = [
    {
      icon: 'game-icons:dungeon-gate',
      name: 'First Steps',
      desc: 'Clear your first stage',
      done: cleared >= 1,
    },
    {
      icon: 'game-icons:card-pick',
      name: 'Gacha Addict',
      desc: 'Perform 100 pulls',
      done: player.total_pulls >= 100,
    },
    {
      icon: 'game-icons:star-prominences',
      name: 'Touched by the Abyss',
      desc: 'Obtain a SUR or EX card',
      done: hasSUR,
    },
    {
      icon: 'game-icons:castle',
      name: 'Abyss Empire',
      desc: 'Clear all Chapter 1 stages',
      done: [1,2,3,0].every(s => isStageClear(1, s)),
    },
    {
      icon: 'game-icons:crossed-swords',
      name: 'Unstoppable',
      desc: 'Clear all 5 chapters',
      done: [1,2,3,4,5].every(ch => isStageClear(ch, 0)),
    },
    {
      icon: 'game-icons:crown',
      name: 'True Overlord',
      desc: 'Own all SUR cards',
      done: ['sur_mei','sur_nazuna','sur_ellie','sur_aoyuki','sur_light']
        .every(k => collection.some(c => c.card_key === k)),
    },
  ];

  const rows = milestones.map(m => `
    <div class="milestone-row">
      <div class="milestone-icon ${m.done ? 'earned' : 'locked'}">
        <iconify-icon icon="${m.icon}" width="16" height="16"></iconify-icon>
      </div>
      <div class="milestone-info">
        <div class="milestone-name">${escHtml(m.name)}</div>
        <div class="milestone-desc">${escHtml(m.desc)}</div>
      </div>
      <span class="milestone-earned-badge ${m.done ? 'done' : 'pending'}">
        ${m.done ? '✓ Done' : 'Pending'}
      </span>
    </div>
  `).join('');

  const doneCount = milestones.filter(m => m.done).length;

  return `
    <div class="milestones-section">
      <div class="milestones-title">
        <iconify-icon icon="game-icons:achievement" width="16" height="16"></iconify-icon>
        Milestones (${doneCount}/${milestones.length})
      </div>
      ${rows}
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   ACCOUNT SETTINGS
═══════════════════════════════════════════════════════════ */

function renderAccountSettings() {
  return `
    <div class="settings-section">
      <div class="settings-section-title">
        <iconify-icon icon="game-icons:gear-hammer" width="14" height="14"></iconify-icon>
        Account
      </div>

      <!-- Change Password -->
      <div class="settings-row" id="toggle-change-password">
        <div class="settings-row-left">
          <div class="settings-row-icon settings-icon-security">
            <iconify-icon icon="game-icons:locked-fortress" width="18" height="18"></iconify-icon>
          </div>
          <div class="settings-row-text">
            <div class="settings-row-title">Change Password</div>
            <div class="settings-row-subtitle">Update your account password</div>
          </div>
        </div>
        <iconify-icon icon="game-icons:arrow-right" width="14" height="14"
          class="settings-row-chevron" id="pw-chevron"></iconify-icon>
      </div>

      <!-- Change Password Form (hidden by default) -->
      <div class="change-password-form" id="change-password-form">
        <div class="input-group">
          <iconify-icon icon="game-icons:locked-fortress" width="18" height="18"></iconify-icon>
          <input type="password" id="new-password-input"
            placeholder="New password (min 6 chars)" autocomplete="new-password" />
        </div>
        <div class="input-group">
          <iconify-icon icon="game-icons:locked-fortress" width="18" height="18"></iconify-icon>
          <input type="password" id="confirm-password-input"
            placeholder="Confirm new password" />
        </div>
        <div id="pw-change-error" class="auth-error hidden"></div>
        <div id="pw-change-success" class="auth-success hidden"></div>
        <button class="btn-primary btn-small" id="btn-change-password">
          Update Password
        </button>
      </div>

      <!-- Logout -->
      <div class="settings-row" id="btn-logout-row">
        <div class="settings-row-left">
          <div class="settings-row-icon settings-icon-danger">
            <iconify-icon icon="game-icons:exit-door" width="18" height="18"></iconify-icon>
          </div>
          <div class="settings-row-text">
            <div class="settings-row-title" style="color:var(--color-danger)">Logout</div>
            <div class="settings-row-subtitle">Sign out of your account</div>
          </div>
        </div>
        <iconify-icon icon="game-icons:arrow-right" width="14" height="14"
          class="settings-row-chevron"></iconify-icon>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   CREDITS FOOTER
═══════════════════════════════════════════════════════════ */

function renderProfileCredits() {
  return `
    <div class="profile-credits">
      Abyss Gacha — Inspired by <em>My Gift Lvl 9999 Unlimited Gacha</em><br>
      Icons by <a href="https://game-icons.net" target="_blank">game-icons.net</a>
      (CC BY 3.0)<br>
      <span class="version-tag">v1.0.0</span>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   WIRE EVENTS
═══════════════════════════════════════════════════════════ */

function wireProfileEvents() {
  // Toggle change password form
  document.getElementById('toggle-change-password')
    ?.addEventListener('click', toggleChangePasswordForm);

  // Change password submit
  document.getElementById('btn-change-password')
    ?.addEventListener('click', handleChangePassword);

  // Enter key in password fields
  ['new-password-input', 'confirm-password-input'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleChangePassword();
    });
  });

  // Logout row
  document.getElementById('btn-logout-row')
    ?.addEventListener('click', openLogoutConfirm);

  // Logout confirm overlay
  document.getElementById('logout-cancel')
    ?.addEventListener('click', closeLogoutConfirm);

  document.getElementById('logout-confirm')
    ?.addEventListener('click', handleLogout);
}

/* ═══════════════════════════════════════════════════════════
   CHANGE PASSWORD
═══════════════════════════════════════════════════════════ */

function toggleChangePasswordForm() {
  const form    = document.getElementById('change-password-form');
  const chevron = document.getElementById('pw-chevron');
  const isOpen  = form.classList.toggle('open');
  if (chevron) {
    chevron.setAttribute('icon',
      isOpen ? 'game-icons:arrow-down' : 'game-icons:arrow-right'
    );
  }
}

async function handleChangePassword() {
  const newPw  = document.getElementById('new-password-input')?.value;
  const confPw = document.getElementById('confirm-password-input')?.value;
  const errEl  = document.getElementById('pw-change-error');
  const sucEl  = document.getElementById('pw-change-success');

  // Clear messages
  if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
  if (sucEl) { sucEl.classList.add('hidden'); }

  if (!newPw || !confPw) {
    if (errEl) { errEl.textContent = 'Please fill in both fields.'; errEl.classList.remove('hidden'); }
    return;
  }

  if (newPw.length < 6) {
    if (errEl) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.classList.remove('hidden'); }
    return;
  }

  if (newPw !== confPw) {
    if (errEl) { errEl.textContent = 'Passwords do not match.'; errEl.classList.remove('hidden'); }
    return;
  }

  const btn = document.getElementById('btn-change-password');
  if (btn) { btn.disabled = true; btn.textContent = 'Updating...'; }

  const { error } = await sb.auth.updateUser({ password: newPw });

  if (btn) { btn.disabled = false; btn.textContent = 'Update Password'; }

  if (error) {
    if (errEl) { errEl.textContent = error.message; errEl.classList.remove('hidden'); }
  } else {
    if (sucEl) { sucEl.textContent = '✓ Password updated successfully!'; sucEl.classList.remove('hidden'); }
    document.getElementById('new-password-input').value    = '';
    document.getElementById('confirm-password-input').value = '';
    showToast('Password updated!', 'success');
  }
}

/* ═══════════════════════════════════════════════════════════
   LOGOUT
═══════════════════════════════════════════════════════════ */

function openLogoutConfirm() {
  document.getElementById('logout-confirm-overlay')?.classList.remove('hidden');
}

function closeLogoutConfirm() {
  document.getElementById('logout-confirm-overlay')?.classList.add('hidden');
}

async function handleLogout() {
  closeLogoutConfirm();
  await authLogout();
  // onAuthStateChange will handle the redirect to auth screen
    }
    
