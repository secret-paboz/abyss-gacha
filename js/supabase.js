/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — SUPABASE.JS
   Supabase client, auth, and all database functions
═══════════════════════════════════════════════════════════ */

// ── CONFIG ───────────────────────────────────────────────
// Replace these with your actual Supabase project values
const SUPABASE_URL     = 'https://qdydxodqfayuiifaazbo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeWR4b2RxZmF5dWlpZmFhemJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MTUyMDAsImV4cCI6MjA5NzI5MTIwMH0.DjrOtoecPKwh7137o83rOBeMkkqTGgkrXT0W4PArv2w';

// ── CLIENT INIT ──────────────────────────────────────────
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: false,
    flowType:           'implicit',
    storageKey:         'abyss-gacha-auth',
  },
  global: {
    fetch: async (url, options = {}) => {
      try {
        const res = await fetch(url, options);
        return res;
      } catch (err) {
        console.error('[Supabase fetch error]', err.message, url);
        throw err;
      }
    },
  },
});

// ── GLOBAL PLAYER STATE ──────────────────────────────────
// Holds the current logged-in player's data in memory
window.GameState = {
  user:       null,   // Supabase auth user object
  player:     null,   // players table row
  collection: [],     // player_collection rows
  party:      null,   // player_party row
  progress:   [],     // player_progress rows
  notifs:     [],     // notifications rows
};

/* ═══════════════════════════════════════════════════════════
   AUTH FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Register a new player
 * @param {string} username
 * @param {string} email      - real email for password reset
 * @param {string} password
 * @returns {object} { error }
 */
async function authRegister(username, email, password) {
  try {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) {
      if (error.message && error.message.includes('duplicate')) {
        return { error: { message: 'Username already taken. Please choose another.' } };
      }
      return { error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[authRegister error]', err);
    return { error: { message: 'Connection failed. Check your internet and try again. (' + err.message + ')' } };
  }
}

/**
 * Login with username + password
 * @param {string} username
 * @param {string} password
 * @returns {object} { data, error }
 */
async function authLogin(username, password) {
  // Step 1: get email via RPC (works without auth session)
  const { data: emailData, error: emailErr } = await sb
    .rpc('get_email_by_id_from_username', { p_username: username });

  if (emailErr || !emailData) {
    return { error: { message: 'Username not found.' } };
  }

  // Step 2: Sign in with email + password
  const { data, error } = await sb.auth.signInWithPassword({
    email: emailData,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: { message: 'Incorrect password.' } };
    }
    return { error };
  }

  return { data, error: null };
}

/**
 * Send password reset email
 * @param {string} usernameOrEmail
 * @returns {object} { error }
 */
async function authResetPassword(usernameOrEmail) {
  let email = usernameOrEmail;

  // If it doesn't look like an email, treat as username → look up email
  if (!usernameOrEmail.includes('@')) {
    const { data: playerRow, error: lookupErr } = await sb
      .from('players')
      .select('id')
      .eq('username', usernameOrEmail)
      .maybeSingle();

    if (lookupErr || !playerRow) {
      return { error: { message: 'Username not found.' } };
    }

    const { data: emailData, error: emailErr } = await sb
      .rpc('get_email_by_id', { user_id: playerRow.id });

    if (emailErr || !emailData) {
      return { error: { message: 'No email linked to this account.' } };
    }

    email = emailData;
  }

  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/?reset=true`,
  });

  return { error: error || null };
}

/**
 * Logout current user
 */
async function authLogout() {
  await sb.auth.signOut();
  window.GameState = {
    user: null, player: null,
    collection: [], party: null,
    progress: [], notifs: [],
  };
}

/**
 * Get current auth session
 */
async function authGetSession() {
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

/* ═══════════════════════════════════════════════════════════
   PLAYER DATA FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Load all player data into GameState
 * Called once after login
 */
async function loadPlayerData() {
  const session = await authGetSession();
  if (!session) return false;

  window.GameState.user = session.user;
  const uid = session.user.id;

  // Load in parallel for speed
  const [playerRes, collectionRes, partyRes, progressRes, notifRes] = await Promise.all([
    sb.from('players').select('*').eq('id', uid).single(),
    sb.from('player_collection').select('*').eq('player_id', uid),
    sb.from('player_party').select('*').eq('player_id', uid).maybeSingle(),
    sb.from('player_progress').select('*').eq('player_id', uid),
    sb.from('notifications').select('*').eq('player_id', uid)
      .eq('is_claimed', false).order('created_at', { ascending: false }),
  ]);

  if (playerRes.error) return false;

  // Check if banned
  if (playerRes.data.is_banned) {
    await authLogout();
    return 'banned';
  }

  window.GameState.player     = playerRes.data;
  window.GameState.collection = collectionRes.data || [];
  window.GameState.party      = partyRes.data || null;
  window.GameState.progress   = progressRes.data || [];
  window.GameState.notifs     = notifRes.data || [];

  return true;
}

/**
 * Refresh only the player row (crystals, pity, etc.)
 */
async function refreshPlayer() {
  const uid = window.GameState.user?.id;
  if (!uid) return;
  const { data } = await sb.from('players').select('*').eq('id', uid).single();
  if (data) window.GameState.player = data;
  return data;
}

/**
 * Refresh collection
 */
async function refreshCollection() {
  const uid = window.GameState.user?.id;
  if (!uid) return;
  const { data } = await sb.from('player_collection').select('*').eq('player_id', uid);
  window.GameState.collection = data || [];
  return data;
}

/**
 * Refresh party
 */
async function refreshParty() {
  const uid = window.GameState.user?.id;
  if (!uid) return;
  const { data } = await sb.from('player_party').select('*').eq('player_id', uid).maybeSingle();
  window.GameState.party = data;
  return data;
}

/* ═══════════════════════════════════════════════════════════
   CRYSTAL FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Add crystals to current player
 * @param {number} amount
 */
async function addCrystals(amount) {
  const uid = window.GameState.user?.id;
  const current = window.GameState.player?.crystals || 0;
  const { error } = await sb
    .from('players')
    .update({ crystals: current + amount })
    .eq('id', uid);
  if (!error) window.GameState.player.crystals = current + amount;
  return { error };
}

/**
 * Spend crystals (returns error if not enough)
 * @param {number} amount
 */
async function spendCrystals(amount) {
  const uid = window.GameState.user?.id;
  const current = window.GameState.player?.crystals || 0;

  if (current < amount) {
    return { error: { message: 'Not enough Abyss Crystals.' } };
  }

  const { error } = await sb
    .from('players')
    .update({ crystals: current - amount })
    .eq('id', uid);

  if (!error) window.GameState.player.crystals = current - amount;
  return { error };
}

/* ═══════════════════════════════════════════════════════════
   DAILY LOGIN
═══════════════════════════════════════════════════════════ */

/**
 * Claim daily login reward
 * Returns { claimed, alreadyClaimed }
 */
async function claimDailyLogin() {
  const uid   = window.GameState.user?.id;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const last  = window.GameState.player?.last_login_date;

  if (last === today) return { claimed: false, alreadyClaimed: true };

  const DAILY_REWARD = 50;

  const { error } = await sb
    .from('players')
    .update({
      last_login_date: today,
      crystals: (window.GameState.player?.crystals || 0) + DAILY_REWARD,
    })
    .eq('id', uid);

  if (error) return { claimed: false, error };

  window.GameState.player.last_login_date = today;
  window.GameState.player.crystals += DAILY_REWARD;

  return { claimed: true, amount: DAILY_REWARD };
}

/* ═══════════════════════════════════════════════════════════
   GACHA / COLLECTION FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Save pull results to DB
 * Handles new cards (insert) vs duplicates (update qty or refund)
 * Updates pity counters and total pulls
 * @param {Array} pulledCards  - array of card_definition objects
 * @param {number} crystalCost
 */
async function savePullResults(pulledCards, crystalCost) {
  const uid    = window.GameState.user?.id;
  const player = window.GameState.player;

  // 1. Deduct crystals
  const { error: crystalErr } = await spendCrystals(crystalCost);
  if (crystalErr) return { error: crystalErr };

  // 2. Update pity counters
  let pity    = player.pity_counter;
  let pitySur = player.pity_sur_counter;
  let newPity = pity;
  let newPitySur = pitySur;

  const HIGH_RARITY = ['SSR','SSSR','UR','SUR','EX'];
  const SUR_RARITY  = ['SUR','EX'];

  for (const card of pulledCards) {
    newPity++;
    newPitySur++;
    if (HIGH_RARITY.includes(card.rarity)) newPity = 0;
    if (SUR_RARITY.includes(card.rarity))  newPitySur = 0;
  }

  // 3. Process each card — upsert into player_collection
  const refundCards = [];
  const newCards    = [];

  for (const card of pulledCards) {
    const existing = window.GameState.collection.find(c => c.card_key === card.card_key);

    if (card.card_type === 'magic' || card.card_type === 'consumable') {
      // Magic/consumable: always stack quantity
      if (existing) {
        await sb.from('player_collection')
          .update({ quantity: existing.quantity + 1 })
          .eq('player_id', uid)
          .eq('card_key', card.card_key);
        existing.quantity += 1;
      } else {
        await sb.from('player_collection')
          .insert({ player_id: uid, card_key: card.card_key, quantity: 1 });
        window.GameState.collection.push({ player_id: uid, card_key: card.card_key, quantity: 1 });
        newCards.push(card);
      }
    } else if (card.rarity === 'E') {
      // E rank: auto-refund 5 crystals — don't add to collection
      refundCards.push({ card, refund: 5 });
    } else if (existing) {
      // Duplicate summon/equipment: refund crystals based on rarity
      const refundMap = { N:5, R:10, SR:20, SSR:50, SSSR:80, UR:120, SUR:200, EX:500 };
      refundCards.push({ card, refund: refundMap[card.rarity] || 10 });
    } else {
      // New card: add to collection
      await sb.from('player_collection')
        .insert({ player_id: uid, card_key: card.card_key, quantity: 1 });
      window.GameState.collection.push({ player_id: uid, card_key: card.card_key, quantity: 1 });
      newCards.push(card);
    }
  }

  // 4. Process refunds
  let totalRefund = 0;
  for (const { refund } of refundCards) totalRefund += refund;
  if (totalRefund > 0) await addCrystals(totalRefund);

  // 5. Update player row (pity + total_pulls)
  await sb.from('players')
    .update({
      pity_counter:     newPity,
      pity_sur_counter: newPitySur,
      total_pulls:      player.total_pulls + pulledCards.length,
    })
    .eq('id', uid);

  window.GameState.player.pity_counter     = newPity;
  window.GameState.player.pity_sur_counter = newPitySur;
  window.GameState.player.total_pulls     += pulledCards.length;

  return { error: null, refundCards, newCards, totalRefund };
}

/* ═══════════════════════════════════════════════════════════
   PARTY FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Save party configuration
 * @param {object} partyData - { slot_1..4, equip_1..4, magic_loadout }
 */
async function saveParty(partyData) {
  const uid = window.GameState.user?.id;

  const { error } = await sb
    .from('player_party')
    .upsert({ player_id: uid, ...partyData });

  if (!error) window.GameState.party = { player_id: uid, ...partyData };
  return { error };
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Mark a stage as cleared
 * @param {number} chapter
 * @param {number} stage    - 0 = boss
 * @param {number} crystalReward
 */
async function clearStage(chapter, stage, crystalReward) {
  const uid = window.GameState.user?.id;

  // Check if already cleared (first clear only gives crystals)
  const alreadyCleared = window.GameState.progress.find(
    p => p.chapter === chapter && p.stage === stage && p.cleared
  );

  const { error } = await sb
    .from('player_progress')
    .upsert({
      player_id:  uid,
      chapter,
      stage,
      cleared:    true,
      cleared_at: new Date().toISOString(),
    });

  if (error) return { error };

  // Update local state
  const existing = window.GameState.progress.find(
    p => p.chapter === chapter && p.stage === stage
  );
  if (existing) {
    existing.cleared = true;
  } else {
    window.GameState.progress.push({ player_id: uid, chapter, stage, cleared: true });
  }

  // Give crystal reward for first clear only
  if (!alreadyCleared && crystalReward > 0) {
    await addCrystals(crystalReward);
    return { error: null, firstClear: true, crystalReward };
  }

  return { error: null, firstClear: false };
}

/**
 * Check if a stage is cleared
 */
function isStageClear(chapter, stage) {
  return window.GameState.progress.some(
    p => p.chapter === chapter && p.stage === stage && p.cleared
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Load unclaimed notifications
 */
async function loadNotifications() {
  const uid = window.GameState.user?.id;
  const { data } = await sb
    .from('notifications')
    .select('*')
    .eq('player_id', uid)
    .eq('is_claimed', false)
    .order('created_at', { ascending: false });
  window.GameState.notifs = data || [];
  return data;
}

/**
 * Mark notification as read
 */
async function markNotifRead(notifId) {
  await sb.from('notifications')
    .update({ is_read: true })
    .eq('id', notifId);
}

/**
 * Claim a notification reward
 */
async function claimNotifReward(notif) {
  const uid = window.GameState.user?.id;

  // Give crystals if applicable
  if (notif.crystals_amount > 0) {
    await addCrystals(notif.crystals_amount);
  }

  // Give card if applicable
  if (notif.card_key) {
    const existing = window.GameState.collection.find(c => c.card_key === notif.card_key);
    if (existing) {
      await sb.from('player_collection')
        .update({ quantity: existing.quantity + 1 })
        .eq('player_id', uid)
        .eq('card_key', notif.card_key);
      existing.quantity += 1;
    } else {
      await sb.from('player_collection')
        .insert({ player_id: uid, card_key: notif.card_key, quantity: 1 });
      window.GameState.collection.push({ player_id: uid, card_key: notif.card_key, quantity: 1 });
    }
  }

  // Mark as claimed
  await sb.from('notifications')
    .update({ is_claimed: true, is_read: true })
    .eq('id', notif.id);

  // Remove from local state
  window.GameState.notifs = window.GameState.notifs.filter(n => n.id !== notif.id);
}

/* ═══════════════════════════════════════════════════════════
   VOUCHER FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Redeem a voucher code
 * @param {string} code
 */
async function redeemVoucher(code) {
  const uid    = window.GameState.user?.id;
  const player = window.GameState.player;

  // 1. Find voucher
  const { data: voucher, error: vErr } = await sb
    .from('voucher_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (vErr || !voucher) return { error: { message: 'Invalid or expired voucher code.' } };

  // 2. Check expiry
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { error: { message: 'This voucher code has expired.' } };
  }

  // 3. Check max uses
  if (voucher.max_uses !== -1 && voucher.current_uses >= voucher.max_uses) {
    return { error: { message: 'This voucher code has reached its usage limit.' } };
  }

  // 4. Check role requirement
  if (player.role_id < voucher.role_required) {
    return { error: { message: 'You do not meet the requirements for this voucher.' } };
  }

  // 5. Check already redeemed
  const { data: alreadyUsed } = await sb
    .from('voucher_redemptions')
    .select('id')
    .eq('player_id', uid)
    .eq('voucher_id', voucher.id)
    .maybeSingle();

  if (alreadyUsed) return { error: { message: 'You have already redeemed this code.' } };

  // 6. Give rewards
  if (voucher.crystals_amount > 0) {
    await addCrystals(voucher.crystals_amount);
  }

  if (voucher.card_key) {
    const existing = window.GameState.collection.find(c => c.card_key === voucher.card_key);
    if (existing) {
      await sb.from('player_collection')
        .update({ quantity: existing.quantity + (voucher.card_quantity || 1) })
        .eq('player_id', uid).eq('card_key', voucher.card_key);
    } else {
      await sb.from('player_collection')
        .insert({ player_id: uid, card_key: voucher.card_key, quantity: voucher.card_quantity || 1 });
      window.GameState.collection.push({
        player_id: uid, card_key: voucher.card_key, quantity: voucher.card_quantity || 1
      });
    }
  }

  // 7. Record redemption + increment use count
  await sb.from('voucher_redemptions').insert({ player_id: uid, voucher_id: voucher.id });
  await sb.from('voucher_codes').update({ current_uses: voucher.current_uses + 1 }).eq('id', voucher.id);

  return {
    error: null,
    crystals: voucher.crystals_amount,
    card_key: voucher.card_key,
  };
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENTS
═══════════════════════════════════════════════════════════ */

/**
 * Load active announcements
 */
async function loadAnnouncements() {
  const { data } = await sb
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

/* ═══════════════════════════════════════════════════════════
   GM FUNCTIONS
═══════════════════════════════════════════════════════════ */

/**
 * Search a player by username (GM only)
 */
async function gmSearchPlayer(username) {
  const { data, error } = await sb
    .from('players')
    .select('*')
    .eq('username', username)
    .maybeSingle();
  return { data, error };
}

/**
 * Update a player's role
 */
async function gmSetRole(targetId, roleId) {
  const { error } = await sb
    .from('players')
    .update({ role_id: roleId })
    .eq('id', targetId);
  await gmLog('set_role', targetId, false, { role_id: roleId });
  return { error };
}

/**
 * Give crystals to a single player
 */
async function gmGiveCrystals(targetId, amount) {
  const { data: target } = await sb.from('players').select('crystals').eq('id', targetId).single();
  const { error } = await sb
 
