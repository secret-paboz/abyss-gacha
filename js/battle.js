/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — BATTLE.JS
   Stage select, turn-based battle engine, combat loop,
   damage calc, status effects, win/lose handling
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   BATTLE STATE
═══════════════════════════════════════════════════════════ */

let battleState = {
  active:       false,
  chapter:      0,
  stage:        0,
  turn:         0,
  party:        [],    // getBattleParty() result
  enemies:      [],    // getStageEnemies() result
  magicLoadout: [],    // getBattleMagicLoadout() result
  manaPool:     0,
  maxMana:      0,
  isPlayerTurn: true,
  isDefending:  false,
  magicJammed:  false,
  jamDuration:  0,
  log:          [],
};

/* ═══════════════════════════════════════════════════════════
   RENDER BATTLE SCREEN (Stage Select)
═══════════════════════════════════════════════════════════ */

function renderBattleScreen() {
  if (battleState.active) {
    renderActiveBattle();
    return;
  }

  const screen = document.getElementById('screen-battle');
  screen.innerHTML = `
    <div class="stage-select-view">
      <div class="section-header">
        <iconify-icon icon="game-icons:dungeon-gate" width="22" height="22"></iconify-icon>
        <h2>Battle</h2>
      </div>
      ${renderChapterList()}
      <div style="height:var(--space-lg)"></div>
    </div>
  `;

  wireStageSelect();
}

/* ═══════════════════════════════════════════════════════════
   CHAPTER / STAGE LIST
═══════════════════════════════════════════════════════════ */

function renderChapterList() {
  return window.STAGE_DATA.map(ch => {
    const unlocked  = window.isChapterUnlocked(ch.chapter);
    const { cleared, total } = window.getChapterClearCount(ch.chapter);

    return `
      <div class="chapter-header chapter-${ch.chapter}
        ${!unlocked ? 'locked' : ''}"
        data-chapter="${ch.chapter}">
        <div class="chapter-icon">
          <iconify-icon icon="${ch.icon}" width="28" height="28"
            style="color:${ch.icon_color}"></iconify-icon>
        </div>
        <div class="chapter-info">
          <div class="chapter-name">Chapter ${ch.chapter}: ${escHtml(ch.name)}</div>
          <div class="chapter-desc">${escHtml(ch.subtitle)}</div>
          ${unlocked ? `
            <div class="chapter-progress">
              ${cleared}/${total} stages cleared
            </div>` : ''}
        </div>
        ${unlocked
          ? `<iconify-icon icon="game-icons:arrow-right" width="18" height="18"
              class="chapter-chevron"></iconify-icon>`
          : `<iconify-icon icon="game-icons:padlock" width="18" height="18"
              class="chapter-lock"></iconify-icon>`}
      </div>
      <div class="stage-list" id="stage-list-${ch.chapter}">
        ${unlocked ? renderStageList(ch) : ''}
      </div>
    `;
  }).join('');
}

function renderStageList(chapter) {
  return chapter.stages.map(stage => {
    const unlocked = window.isStageUnlocked(chapter.chapter, stage.stage);
    const cleared  = isStageClear(chapter.chapter, stage.stage);
    const partyPwr = calcPartyPower();
    const challenge = unlocked
      ? window.getStageChallenge(chapter.chapter, stage.stage, partyPwr)
      : 'normal';
    const diff = window.getDifficultyDisplay(challenge);

    return `
      <div class="stage-item
        ${cleared  ? 'cleared'  : ''}
        ${!unlocked ? 'locked'  : ''}
        ${stage.is_boss ? 'is-boss' : ''}"
        data-chapter="${chapter.chapter}"
        data-stage="${stage.stage}">

        <div class="stage-number">${stage.is_boss ? '👑' : stage.stage}</div>
        <div class="stage-info">
          <div class="stage-name">${escHtml(stage.name)}</div>
          <div class="stage-enemy-preview">
            ${unlocked ? `
              <span style="color:${diff.color};font-size:0.68rem;font-weight:700">
                ${diff.label}
              </span>` : 'Locked'}
          </div>
        </div>
        <div class="stage-reward">
          <iconify-icon icon="game-icons:crystals" width="12" height="12"></iconify-icon>
          ${stage.first_clear_crystals}
        </div>
        ${cleared
          ? `<iconify-icon icon="game-icons:check-mark" width="18" height="18"
              class="stage-cleared-badge" style="color:var(--color-success)"></iconify-icon>`
          : !unlocked
          ? `<iconify-icon icon="game-icons:padlock" width="16" height="16"
              class="stage-lock-icon"></iconify-icon>`
          : ''}
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════
   WIRE STAGE SELECT
═══════════════════════════════════════════════════════════ */

function wireStageSelect() {
  // Chapter accordion toggle
  document.querySelectorAll('.chapter-header:not(.locked)').forEach(header => {
    header.addEventListener('click', () => {
      const ch      = header.dataset.chapter;
      const list    = document.getElementById(`stage-list-${ch}`);
      const isOpen  = list.classList.toggle('open');
      header.classList.toggle('open', isOpen);
    });
  });

  // Stage select
  document.querySelectorAll('.stage-item:not(.locked)').forEach(item => {
    item.addEventListener('click', () => {
      const chapter = parseInt(item.dataset.chapter);
      const stage   = parseInt(item.dataset.stage);
      startBattle(chapter, stage);
    });
  });

  // Auto-open first unlocked chapter
  const firstUnlocked = document.querySelector('.chapter-header:not(.locked)');
  if (firstUnlocked) {
    firstUnlocked.click();
  }
}

/* ═══════════════════════════════════════════════════════════
   START BATTLE
═══════════════════════════════════════════════════════════ */

function startBattle(chapter, stage) {
  const party = getBattleParty();
  if (party.length === 0) {
    showToast('Set up your party first!', 'error');
    navigateTo('party');
    return;
  }

  const enemies = window.getStageEnemies(chapter, stage);
  if (!enemies.length) {
    showToast('No enemies found for this stage.', 'error');
    return;
  }

  const magic   = getBattleMagicLoadout();
  const maxMana = party.reduce((s, m) => s + m.mana, 0);

  battleState = {
    active:       true,
    chapter,
    stage,
    turn:         1,
    party:        party.map(m => ({ ...m })),
    enemies:      enemies.map(e => ({ ...e })),
    magicLoadout: magic.map(c => ({ ...c })),
    manaPool:     Math.floor(maxMana * 0.3),
    maxMana,
    isPlayerTurn: true,
    isDefending:  false,
    magicJammed:  false,
    jamDuration:  0,
    log:          [],
  };

  addLog(`⚔️ Battle started! Chapter ${chapter} - Stage ${stage === 0 ? 'BOSS' : stage}`, 'system');
  renderActiveBattle();
}

/* ═══════════════════════════════════════════════════════════
   RENDER ACTIVE BATTLE
═══════════════════════════════════════════════════════════ */

function renderActiveBattle() {
  const screen   = document.getElementById('screen-battle');
  const stageData = window.getStage(battleState.chapter, battleState.stage);
  const bgClass  = window.getChapter(battleState.chapter)?.bg_class || 'chapter-1';

  screen.innerHTML = `
    <div class="battle-view active">
      <div class="battle-bg ${bgClass}">
        <div class="battle-bg-gradient"></div>
      </div>
      <div class="battle-content">
        ${renderBattleHeader(stageData)}
        ${renderEnemyArea()}
        ${renderManaBar()}
        ${renderPartyBattleArea()}
        ${renderActionButtons()}
        ${renderBattleLog()}
      </div>
    </div>

    <!-- Magic pick overlay -->
    <div id="battle-magic-overlay" class="hidden">
      <div class="battle-magic-box">
        <div class="battle-magic-header">
          <h3>
            <iconify-icon icon="game-icons:magic-swirl" width="18" height="18"></iconify-icon>
            Cast Spell
          </h3>
          <button class="btn-close" onclick="closeBattleMagicOverlay()">✕</button>
        </div>
        <div class="battle-magic-list" id="battle-magic-list"></div>
      </div>
    </div>

    <!-- Item overlay -->
    <div id="battle-item-overlay" class="hidden">
      <div class="battle-item-box">
        <div class="battle-item-header">
          <h3>
            <iconify-icon icon="game-icons:potion-ball" width="18" height="18"></iconify-icon>
            Use Item
          </h3>
          <button class="btn-close" onclick="closeBattleItemOverlay()">✕</button>
        </div>
        <div class="battle-item-list" id="battle-item-list"></div>
      </div>
    </div>

    <!-- Result overlay -->
    <div id="battle-result-overlay" class="hidden">
      <div class="battle-result-box" id="battle-result-box"></div>
    </div>
  `;

  wireBattleActions();
}

/* ═══════════════════════════════════════════════════════════
   BATTLE UI COMPONENTS
═══════════════════════════════════════════════════════════ */

function renderBattleHeader(stageData) {
  return `
    <div class="battle-header">
      <div class="battle-stage-name">
        ${stageData ? escHtml(stageData.name) : 'Battle'}
      </div>
      <div class="battle-turn-counter">
        <iconify-icon icon="game-icons:cycle" width="14" height="14"></iconify-icon>
        Turn ${battleState.turn}
      </div>
      <button class="battle-flee-btn" onclick="fleeBattle()">Flee</button>
    </div>
  `;
}

function renderEnemyArea() {
  const enemies = battleState.enemies.filter(e => !e.is_dead);
  const html    = battleState.enemies.map((e, idx) => {
    const hpPct = Math.max(0, (e.current_hp / e.max_hp) * 100);
    return `
      <div class="enemy-card ${e.is_dead ? 'dead' : ''} ${e.is_boss ? 'is-boss' : ''}"
        id="enemy-${idx}" onclick="targetEnemy(${idx})">
        ${e.is_boss ? '<div class="boss-label">BOSS</div>' : ''}
        <div class="enemy-icon">
          <iconify-icon icon="${e.icon}" width="${e.is_boss?40:32}"
            height="${e.is_boss?40:32}" style="color:${e.icon_color}"></iconify-icon>
        </div>
        <div class="enemy-name">${escHtml(e.name)}</div>
        <div class="enemy-level">Lv.${e.level}</div>
        <div class="enemy-hp-bar">
          <div class="enemy-hp-fill" id="enemy-hp-${idx}"
            style="width:${hpPct}%"></div>
        </div>
        <div class="enemy-hp-text" id="enemy-hp-text-${idx}">
          ${fmtNum(Math.max(0,e.current_hp))} / ${fmtNum(e.max_hp)}
        </div>
        ${renderStatusIcons(e.status_effects || [])}
      </div>
    `;
  }).join('');

  return `<div class="enemy-area" id="enemy-area">${html}</div>`;
}

function renderStatusIcons(effects) {
  if (!effects.length) return '';
  const icons = effects.map(eff => {
    const map = {
      bound:  {cls:'status-bound',  icon:'game-icons:chain'},
      sleep:  {cls:'status-sleep',  icon:'game-icons:sleeping'},
      hypno:  {cls:'status-hypno',  icon:'game-icons:hypnotic-eyes'},
      burn:   {cls:'status-burn',   icon:'game-icons:fire-ray'},
      jammed: {cls:'status-jammed', icon:'game-icons:cancel'},
    };
    const m = map[eff.type];
    if (!m) return '';
    return `<div class="status-icon ${m.cls}">
      <iconify-icon icon="${m.icon}" width="10" height="10"></iconify-icon>
    </div>`;
  }).join('');
  return `<div class="status-icons">${icons}</div>`;
}

function renderManaBar() {
  const pct = battleState.maxMana > 0
    ? Math.round((battleState.manaPool / battleState.maxMana) * 100) : 0;
  return `
    <div class="mana-pool-bar">
      <div class="mana-pool-label">
        <iconify-icon icon="game-icons:magic-swirl" width="14" height="14"></iconify-icon>
        MANA
      </div>
      <div class="mana-pool-track">
        <div class="mana-pool-fill" id="mana-fill" style="width:${pct}%"></div>
      </div>
      <div class="mana-pool-value" id="mana-value">
        ${fmtNum(battleState.manaPool)} / ${fmtNum(battleState.maxMana)}
      </div>
    </div>
  `;
}

function renderPartyBattleArea() {
  const html = battleState.party.map((m, idx) => {
    const hpPct  = Math.max(0, (m.current_hp / m.max_hp) * 100);
    const hpClass = hpPct > 50 ? '' : hpPct > 25 ? 'low' : 'danger';
    return `
      <div class="party-battle-card" id="party-card-${idx}">
        <div class="party-battle-icon ${m.is_dead ? 'is-dead' : ''}">
          <iconify-icon icon="${m.icon}" width="24" height="24"
            style="color:${m.icon_color}"></iconify-icon>
        </div>
        <div class="party-battle-hp">
          <div class="party-battle-hp-fill ${hpClass}" id="party-hp-${idx}"
            style="width:${hpPct}%"></div>
        </div>
        <div class="party-battle-name">${escHtml(m.name)}</div>
        <div class="party-battle-hp-text" id="party-hp-text-${idx}">
          ${fmtNum(Math.max(0, m.current_hp))}
        </div>
      </div>
    `;
  }).join('');
  return `<div class="party-area" id="party-area">${html}</div>`;
}

function renderActionButtons() {
  const jammed = battleState.magicJammed;
  return `
    <div class="action-area" id="action-area">
      <button class="action-btn action-attack" id="btn-attack" onclick="doAttack()">
        <iconify-icon icon="game-icons:crossed-swords" width="24" height="24"></iconify-icon>
        Attack
      </button>
      <button class="action-btn action-magic ${jammed ? 'disabled' : ''}"
        id="btn-magic" onclick="openBattleMagicOverlay()" ${jammed?'disabled':''}>
        <iconify-icon icon="game-icons:magic-swirl" width="24" height="24"></iconify-icon>
        ${jammed ? 'Jammed' : 'Magic'}
      </button>
      <button class="action-btn action-defend" id="btn-defend" onclick="doDefend()">
        <iconify-icon icon="game-icons:shield" width="24" height="24"></iconify-icon>
        Defend
      </button>
      <button class="action-btn action-item" id="btn-item" onclick="openBattleItemOverlay()">
        <iconify-icon icon="game-icons:potion-ball" width="24" height="24"></iconify-icon>
        Item
      </button>
    </div>
  `;
}

function renderBattleLog() {
  const entries = battleState.log.slice(-6).map(e =>
    `<div class="log-entry log-${e.type}">${escHtml(e.text)}</div>`
  ).join('');
  return `<div class="battle-log" id="battle-log">${entries}</div>`;
}

/* ═══════════════════════════════════════════════════════════
   ACTION HANDLERS
═══════════════════════════════════════════════════════════ */

async function doAttack() {
  if (!battleState.isPlayerTurn) return;
  disableActions();

  const alive   = battleState.party.filter(m => !m.is_dead);
  const enemies = battleState.enemies.filter(e => !e.is_dead);
  if (!enemies.length) { checkBattleEnd(); return; }

  // Target lowest HP enemy
  const target = enemies.reduce((a, b) => a.current_hp < b.current_hp ? a : b);
  const idx    = battleState.enemies.indexOf(target);

  // Calculate total party ATK
  let totalAtk = alive.reduce((s, m) => s + m.atk, 0);

  // Apply defending bonus (already set from previous turn)
  const dmg = calcDamage(totalAtk, target.def, false);
  addLog(`⚔️ Your party attacks ${target.name} for ${fmtNum(dmg)} damage!`, 'damage');

  await animateAttack(`enemy-${idx}`, 'physical', dmg);
  applyDamageToEnemy(idx, dmg);

  // Regen mana after action
  regenMana();
  battleState.isDefending = false;

  await delay(600);
  await enemyTurn();
}

async function doDefend() {
  if (!battleState.isPlayerTurn) return;
  disableActions();

  battleState.isDefending = true;
  addLog('🛡️ Your party takes a defensive stance! Damage reduced by 50% this turn.', 'system');

  // Animate defend
  battleState.party.forEach((m, idx) => {
    if (!m.is_dead) animateDefend(`party-card-${idx}`);
  });

  regenMana(1.5); // Extra mana on defend
  await delay(600);
  await enemyTurn();
}

/* ═══════════════════════════════════════════════════════════
   MAGIC OVERLAY
═══════════════════════════════════════════════════════════ */

function openBattleMagicOverlay() {
  if (battleState.magicJammed) { showToast('Magic is nullified!', 'error'); return; }

  const list   = document.getElementById('battle-magic-list');
  const cards  = battleState.magicLoadout;

  if (!cards.length) {
    showToast('No magic cards in loadout!', 'info');
    return;
  }

  list.innerHTML = cards.map((card, idx) => {
    const canAfford = battleState.manaPool >= card.magic_cost;
    return `
      <div class="battle-magic-item ${!canAfford ? 'cant-afford' : ''}"
        onclick="castMagic(${idx})">
        <div class="battle-magic-icon">
          <iconify-icon icon="${card.icon}" width="22" height="22"
            style="color:${card.icon_color}"></iconify-icon>
        </div>
        <div class="battle-magic-info">
          <div class="battle-magic-name">${escHtml(card.name)}</div>
          <div class="battle-magic-desc">${escHtml(card.skill_description || card.description || '')}</div>
        </div>
        <div class="battle-magic-meta">
          <div class="battle-magic-cost">
            <iconify-icon icon="game-icons:lightning-trio" width="10" height="10"></iconify-icon>
            ${card.magic_cost}
          </div>
          <div class="battle-magic-qty">×${card.quantity}</div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('battle-magic-overlay').classList.remove('hidden');
}

function closeBattleMagicOverlay() {
  document.getElementById('battle-magic-overlay')?.classList.add('hidden');
}

async function castMagic(cardIdx) {
  closeBattleMagicOverlay();
  if (!battleState.isPlayerTurn) return;
  disableActions();

  const card = battleState.magicLoadout[cardIdx];
  if (!card) return;

  if (battleState.manaPool < card.magic_cost) {
    showToast('Not enough mana!', 'error');
    enableActions();
    return;
  }

  battleState.manaPool = Math.max(0, battleState.manaPool - card.magic_cost);
  updateManaBar();

  addLog(`✨ Casting ${card.name}!`, 'magic');

  const effect = tryParseJSON(card.magic_effect || card.skill_effect);
  await applyMagicEffect(effect, card);

  // Consume single-use cards
  if (card.is_single_use) {
    await consumeMagicCard(card.card_key);
    card.quantity = Math.max(0, card.quantity - 1);
    if (card.quantity <= 0) {
      battleState.magicLoadout.splice(cardIdx, 1);
    }
  }

  battleState.isDefending = false;
  await delay(600);
  await enemyTurn();
}

/* ═══════════════════════════════════════════════════════════
   APPLY MAGIC EFFECT
═══════════════════════════════════════════════════════════ */

async function applyMagicEffect(effect, card) {
  if (!effect) return;

  const liveEnemies = battleState.enemies.filter(e => !e.is_dead);
  const aliveParty  = battleState.party.filter(m => !m.is_dead);

  switch (effect.type) {
    case 'magic_aoe':
    case 'magic_aoe_dot':
    case 'magic_aoe_debuff': {
      const power = effect.power || 3000;
      for (let i = 0; i < battleState.enemies.length; i++) {
        const e = battleState.enemies[i];
        if (e.is_dead) continue;
        const def  = effect.ignore_def ? 0 : e.def;
        const dmg  = calcDamage(power, def, true);
        await animateAttack(`enemy-${i}`, 'magic', dmg);
        applyDamageToEnemy(i, dmg);
        addLog(`  → ${e.name} takes ${fmtNum(dmg)} magic damage!`, 'magic');
        if (effect.dot) applyStatusEffect(e, effect.dot, effect.dot_duration || 2);
        if (effect.stat && effect.value) applyDebuff(e, effect.stat, effect.value, effect.duration || 2);
      }
      break;
    }

    case 'magic_single':
    case 'magic_single_debuff':
    case 'magic_single_stun': {
      const target = liveEnemies[0];
      if (!target) break;
      const idx  = battleState.enemies.indexOf(target);
      const dmg  = calcDamage(effect.power || 2000, target.def, true);
      await animateAttack(`enemy-${idx}`, 'magic', dmg);
      applyDamageToEnemy(idx, dmg);
      addLog(`  → ${target.name} takes ${fmtNum(dmg)} magic damage!`, 'magic');
      if (effect.stat) applyDebuff(target, effect.stat, effect.value, effect.duration);
      if (effect.stun_chance && Math.ran
