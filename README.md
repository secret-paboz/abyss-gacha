# 🏰 Abyss Gacha

A browser-based gacha RPG inspired by *My Gift Lvl 9999 Unlimited Gacha*.
Built with vanilla HTML + CSS + JavaScript. Hosted on Vercel. Backend on Supabase.

---

## 📁 File Structure

```
abyss-gacha/
├── index.html              ← Game shell
├── vercel.json             ← Vercel config
├── README.md               ← This file
├── css/
│   ├── main.css            ← Global styles & variables
│   ├── auth.css            ← Login / register screens
│   ├── home.css            ← Home / kingdom screen
│   ├── gacha.css           ← Gacha pull screen
│   ├── collection.css      ← Card collection browser
│   ├── party.css           ← Party builder
│   ├── battle.css          ← Battle screen
│   ├── profile.css         ← Profile screen
│   └── gm.css              ← GM panel
└── js/
    ├── supabase.js         ← Supabase client & all DB functions
    ├── router.js           ← Navigation, auth flow, utilities
    ├── home.js             ← Home screen
    ├── gacha.js            ← Gacha pull engine
    ├── collection.js       ← Card collection browser
    ├── party.js            ← Party builder
    ├── battle.js           ← Turn-based battle engine
    ├── profile.js          ← Profile screen
    ├── gm.js               ← GM panel (role 99 only)
    └── data/
        ├── cards.js        ← All card definitions (47 cards)
        ├── enemies.js      ← All enemy definitions
        └── stages.js       ← Chapter & stage structure
```

---

## 🚀 SETUP GUIDE (Android Only)

### STEP 1 — GitHub

1. Go to **github.com** → Sign up or log in
2. Tap **+** → **New repository**
3. Name: `abyss-gacha`
4. Set to **Public**
5. Check ✅ **Add a README file**
6. Tap **Create repository**
7. Upload all 24 files maintaining the folder structure

> **Tip for Android:** Use the GitHub website in your browser.
> Tap **Add file → Upload files** to upload multiple files at once.
> Create the `css/` and `js/data/` folders by typing the path in the
> filename field e.g. `css/main.css`

---

### STEP 2 — Vercel

1. Go to **vercel.com** → **Sign Up with GitHub**
2. Tap **Add New → Project**
3. Find `abyss-gacha` → tap **Import**
4. Settings:
   - Framework Preset: `Other`
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty)*
5. Tap **Deploy**
6. Wait ~1 minute → you get a URL like `abyss-gacha.vercel.app` 🎉

> Every time you push to GitHub → Vercel auto-deploys in ~30 seconds.

---

### STEP 3 — Supabase

1. Go to **supabase.com** → **Start your project**
2. Sign up with GitHub (easiest)
3. Tap **New project**:
   - Name: `abyss-gacha`
   - Database Password: *(save this somewhere safe)*
   - Region: pick closest to you
4. Wait ~2 minutes for initialization

#### Run the SQL Script

1. In Supabase left sidebar → **SQL Editor**
2. Tap **New query**
3. Paste the entire SQL from the section below
4. Tap **Run** → you should see "Success"

#### Configure Auth

1. Left sidebar → **Authentication → Providers**
2. Make sure **Email** is enabled
3. Tap **Email** → turn **OFF** "Confirm email"
   *(so players can login without email verification)*
4. Tap **Save**

#### Get Your API Keys

1. Left sidebar → **Project Settings → API**
2. Copy:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### STEP 4 — Connect Supabase to the Game

Open `js/supabase.js` and replace lines 7–8:

```javascript
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

With your actual values:

```javascript
const SUPABASE_URL      = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Commit and push → Vercel redeploys automatically.

---

### STEP 5 — Add Required SQL Function

In Supabase SQL Editor, run this additional query:

```sql
CREATE OR REPLACE FUNCTION get_email_by_id(user_id UUID)
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

This is required for username-based login to work.

---

### STEP 6 — Make Yourself GM

1. Open your game URL
2. Register a new account (this will be your GM account)
3. Go back to Supabase → **SQL Editor** → **New query**
4. Run:

```sql
UPDATE players SET role_id = 99 WHERE username = 'your_username_here';
```

5. Refresh the game → GM tab appears in the bottom nav 👑

---

## 🗄️ FULL SQL SETUP SCRIPT

Run this entire script in Supabase SQL Editor:

```sql
-- ============================================================
-- ABYSS GACHA — SUPABASE SQL SETUP
-- ============================================================

-- 1. PLAYERS
CREATE TABLE players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role_id INTEGER NOT NULL DEFAULT 0,
  crystals INTEGER NOT NULL DEFAULT 900,
  pity_counter INTEGER NOT NULL DEFAULT 0,
  pity_sur_counter INTEGER NOT NULL DEFAULT 0,
  total_pulls INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PLAYER COLLECTION
CREATE TABLE player_collection (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  card_key TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  obtained_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, card_key)
);

-- 3. PLAYER PARTY
CREATE TABLE player_party (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  slot_1 TEXT, slot_2 TEXT, slot_3 TEXT, slot_4 TEXT,
  equip_1 TEXT, equip_2 TEXT, equip_3 TEXT, equip_4 TEXT,
  magic_loadout TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PLAYER PROGRESS
CREATE TABLE player_progress (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  stage INTEGER NOT NULL,
  cleared BOOLEAN NOT NULL DEFAULT FALSE,
  cleared_at TIMESTAMPTZ,
  UNIQUE(player_id, chapter, stage)
);

-- 5. ANNOUNCEMENTS
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_by UUID REFERENCES players(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 6. VOUCHER CODES
CREATE TABLE voucher_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  reward_type TEXT NOT NULL,
  crystals_amount INTEGER DEFAULT 0,
  card_key TEXT,
  card_quantity INTEGER DEFAULT 1,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  role_required INTEGER DEFAULT 0,
  created_by UUID REFERENCES players(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 7. VOUCHER REDEMPTIONS
CREATE TABLE voucher_redemptions (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  voucher_id INTEGER NOT NULL REFERENCES voucher_codes(id),
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, voucher_id)
);

-- 8. GM LOGS
CREATE TABLE gm_logs (
  id SERIAL PRIMARY KEY,
  gm_id UUID NOT NULL REFERENCES players(id),
  action TEXT NOT NULL,
  target_player_id UUID REFERENCES players(id),
  is_broadcast BOOLEAN DEFAULT FALSE,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reward_type TEXT,
  crystals_amount INTEGER DEFAULT 0,
  card_key TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_party ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gm_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_gm()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM players WHERE id = auth.uid() AND role_id = 99);
$$ LANGUAGE sql SECURITY DEFINER;

-- Players policies
CREATE POLICY "players_select_own" ON players FOR SELECT USING (id = auth.uid());
CREATE POLICY "players_update_own" ON players FOR UPDATE USING (id = auth.uid());
CREATE POLICY "players_insert_own" ON players FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "players_gm_all"     ON players FOR ALL USING (is_gm());

-- Collection policies
CREATE POLICY "collection_own"    ON player_collection FOR ALL USING (player_id = auth.uid());
CREATE POLICY "collection_gm_all" ON player_collection FOR ALL USING (is_gm());

-- Party policies
CREATE POLICY "party_own"    ON player_party FOR ALL USING (player_id = auth.uid());
CREATE POLICY "party_gm_all" ON player_party FOR ALL USING (is_gm());

-- Progress policies
CREATE POLICY "progress_own"    ON player_progress FOR ALL USING (player_id = auth.uid());
CREATE POLICY "progress_gm_all" ON player_progress FOR ALL USING (is_gm());

-- Announcements policies
CREATE POLICY "announcements_read"   ON announcements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "announcements_gm_all" ON announcements FOR ALL USING (is_gm());

-- Voucher policies
CREATE POLICY "vouchers_read"   ON voucher_codes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "vouchers_gm_all" ON voucher_codes FOR ALL USING (is_gm());

-- Redemptions policies
CREATE POLICY "redemptions_own"    ON voucher_redemptions FOR ALL USING (player_id = auth.uid());
CREATE POLICY "redemptions_gm_all" ON voucher_redemptions FOR ALL USING (is_gm());

-- GM logs policies
CREATE POLICY "gm_logs_gm_only" ON gm_logs FOR ALL USING (is_gm());

-- Notifications policies
CREATE POLICY "notifications_own"    ON notifications FOR ALL USING (player_id = auth.uid());
CREATE POLICY "notifications_gm_all" ON notifications FOR ALL USING (is_gm());

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO players (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  INSERT INTO player_party (player_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_players_username      ON players(username);
CREATE INDEX idx_collection_player     ON player_collection(player_id);
CREATE INDEX idx_progress_player       ON player_progress(player_id);
CREATE INDEX idx_notifications_player  ON notifications(player_id);
CREATE INDEX idx_gm_logs_gm            ON gm_logs(gm_id);
CREATE INDEX idx_vouchers_code         ON voucher_codes(code);
```

---

## 🔐 ROLE SYSTEM

| Role ID | Name | Access |
|---|---|---|
| 0 | Player | Normal gameplay |
| 1 | Veteran | Trusted player |
| 2 | VIP | Special perks |
| 99 | Game Master | Full GM panel |

---

## 🎮 GAME FEATURES

- **Gacha** — 9 rarity tiers (E → EX), pity system (SSR at 90 pulls, SUR at 180)
- **3 Card Types** — Summons, Equipment, Magic/Spells
- **47 Cards** — including lore-accurate characters (Mei, Nazuna, Ellie, Aoyuki, Light)
- **Turn-based Battle** — Attack / Magic / Defend / Item actions
- **5 Chapters** — 20 stages + 5 boss fights
- **Party Builder** — 4 slots, front/back formation, equipment per character
- **Magic Loadout** — 4 spell slots, mana system, single-use vs reusable
- **Daily Login** — +50 crystals per day
- **Voucher Codes** — redeemable reward codes via GM panel
- **GM Panel** — full player management, broadcast, announcements, audit logs

---

## 📱 ANDROID WORKFLOW

Recommended apps for editing on Android:

| App | Use |
|---|---|
| **GitHub** (official app) | Browse and view files |
| **Acode** (free) | Edit code files, push to GitHub |
| **Spck Editor** (free) | Alternative code editor |
| **GitHub Codespaces** (browser) | Full VS Code in browser, best option |

---

## 🙏 CREDITS

- Icons: [game-icons.net](https://game-icons.net) — CC BY 3.0
- Inspired by: *My Gift Lvl 9999 Unlimited Gacha* (anime/light novel)
- Built with: Vanilla JS, Supabase, Vercel
