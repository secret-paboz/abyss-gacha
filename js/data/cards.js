/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — DATA/CARDS.JS
   All card definitions: summons, equipment, magic, consumables
   This is the master card database loaded on startup
═══════════════════════════════════════════════════════════ */

window.CARD_DATA = [

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — SUR (Lv.9999)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sur_mei',
  name:             'Mei',
  card_type:        'summon',
  rarity:           'SUR',
  description:      'The Seeker Maid of the Abyss. First of Light\'s SUR summons. Uses magic thread to control and bind enemies. Loyal beyond measure.',
  icon:             'game-icons:sewing-needle',
  icon_color:       '#f0c040',
  hp:               9200, atk: 8500, def: 7200, spd: 9000, mana: 8800,
  skill_name:       'Thread Bind',
  skill_description:'Wraps all enemies in magic thread. Reduces enemy SPD by 60% for 3 turns. Cannot be dispelled.',
  skill_effect:     JSON.stringify({ type:'debuff', target:'all_enemies', stat:'spd', value:0.6, duration:3 }),
},
{
  card_key:         'sur_nazuna',
  name:             'Nazuna',
  card_type:        'summon',
  rarity:           'SUR',
  description:      'Vampire Knight of the Abyss. Lv.9999 undead warrior. Strikes with overwhelming force and drains life from enemies.',
  icon:             'game-icons:vampire-dracula',
  icon_color:       '#cc2244',
  hp:               9800, atk: 9600, def: 8000, spd: 8200, mana: 6000,
  skill_name:       'Vampire Strike',
  skill_description:'Unleashes a devastating vampiric slash. ATK ×3.5. Heals Nazuna for 40% of damage dealt.',
  skill_effect:     JSON.stringify({ type:'attack_heal', target:'single_enemy', atk_mult:3.5, heal_pct:0.4 }),
},
{
  card_key:         'sur_ellie',
  name:             'Ellie',
  card_type:        'summon',
  rarity:           'SUR',
  description:      'The Forbidden Witch of the Abyss. Wields the four Grimoires of forbidden magic. Her spells ignore all defense.',
  icon:             'game-icons:witch-flight',
  icon_color:       '#9b30ff',
  hp:               7800, atk: 9200, def: 5500, spd: 8600, mana: 9999,
  skill_name:       'Summon Nightmare',
  skill_description:'Opens the Grimoire of Nightmares. Hits ALL enemies for massive magic damage. Ignores DEF completely.',
  skill_effect:     JSON.stringify({ type:'magic_aoe', target:'all_enemies', power:8800, ignore_def:true }),
},
{
  card_key:         'sur_aoyuki',
  name:             'Aoyuki',
  card_type:        'summon',
  rarity:           'SUR',
  description:      'Monster Tamer of the Abyss. Commands dragons and beasts. Can turn enemies into allies mid-battle.',
  icon:             'game-icons:dragon',
  icon_color:       '#30cc88',
  hp:               8800, atk: 8200, def: 8600, spd: 7800, mana: 8400,
  skill_name:       'Beast Tame',
  skill_description:'Tames one enemy and forces them to fight for your party for the remainder of the battle.',
  skill_effect:     JSON.stringify({ type:'tame', target:'single_enemy', duration:'battle' }),
},
{
  card_key:         'sur_light',
  name:             'Light',
  card_type:        'summon',
  rarity:           'SUR',
  description:      'The Dungeon Castaway. Wielder of the Infinite Gacha. Rises from betrayal to build the mightiest empire.',
  icon:             'game-icons:spear-head',
  icon_color:       '#f0c040',
  hp:               9500, atk: 9000, def: 7500, spd: 8800, mana: 9200,
  skill_name:       'Infinite Gacha',
  skill_description:'Pulls a random magic card from the void and casts it instantly at no mana cost.',
  skill_effect:     JSON.stringify({ type:'random_magic', target:'auto', free:true }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — UR (Lv.4000–9000)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ur_fenrir',
  name:             'Founder Fenrir',
  card_type:        'summon',
  rarity:           'UR',
  description:      'Ancient monster of the deep abyss. Level 9000 creature bound by Light\'s gacha. Primal destructive force.',
  icon:             'game-icons:wolf-head',
  icon_color:       '#ff8c00',
  hp:               7200, atk: 8800, def: 6800, spd: 7000, mana: 5000,
  skill_name:       'Primal Howl',
  skill_description:'Releases a devastating howl that reduces ALL enemy ATK by 40% for 2 turns and deals AoE damage.',
  skill_effect:     JSON.stringify({ type:'aoe_debuff', target:'all_enemies', stat:'atk', value:0.4, duration:2 }),
},
{
  card_key:         'ur_golem',
  name:             'Abyss Golem',
  card_type:        'summon',
  rarity:           'UR',
  description:      'A 3-meter mana-powered battle construct summoned from the gacha. Near-impenetrable armor.',
  icon:             'game-icons:stone-crafting',
  icon_color:       '#888888',
  hp:               9800, atk: 6500, def: 9500, spd: 3000, mana: 4000,
  skill_name:       'Iron Fortress',
  skill_description:'Takes all incoming damage for the party this turn. Reduces all damage taken by 80%.',
  skill_effect:     JSON.stringify({ type:'taunt_shield', target:'self', dmg_reduce:0.8, duration:1 }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — SSSR (Lv.1000–4000)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sssr_gold',
  name:             'Gold',
  card_type:        'summon',
  rarity:           'SSSR',
  description:      'Elite guard of the Giant Tower. Golden warrior with overwhelming physical power.',
  icon:             'game-icons:knight-helmet',
  icon_color:       '#f0c040',
  hp:               5500, atk: 6200, def: 5000, spd: 5800, mana: 4200,
  skill_name:       'Golden Slash',
  skill_description:'A blinding golden strike. Deals ATK ×2.5 damage and stuns the target for 1 turn.',
  skill_effect:     JSON.stringify({ type:'attack_stun', target:'single_enemy', atk_mult:2.5, stun_duration:1 }),
},
{
  card_key:         'sssr_mera',
  name:             'Mera',
  card_type:        'summon',
  rarity:           'SSSR',
  description:      'Elite mage of the Giant Tower. Her fire magic melts through any defense.',
  icon:             'game-icons:fire-ray',
  icon_color:       '#ff4422',
  hp:               4800, atk: 6800, def: 3800, spd: 6200, mana: 7500,
  skill_name:       'Inferno Column',
  skill_description:'Summons a column of fire on all enemies. AoE fire damage and applies Burn for 3 turns.',
  skill_effect:     JSON.stringify({ type:'magic_aoe_dot', target:'all_enemies', power:5500, dot:'burn', dot_duration:3 }),
},
{
  card_key:         'sssr_suzu',
  name:             'Suzu',
  card_type:        'summon',
  rarity:           'SSSR',
  description:      'Support specialist of the Giant Tower. Heals allies and bolsters defenses.',
  icon:             'game-icons:healing',
  icon_color:       '#30ff90',
  hp:               5000, atk: 3500, def: 5500, spd: 6800, mana: 8200,
  skill_name:       'Abyss Mending',
  skill_description:'Heals the entire party for 35% of max HP and removes all debuffs.',
  skill_effect:     JSON.stringify({ type:'heal_cleanse', target:'all_allies', heal_pct:0.35 }),
},
{
  card_key:         'sssr_jack',
  name:             'Jack',
  card_type:        'summon',
  rarity:           'SSSR',
  description:      'Dual-blade warrior of the Giant Tower. Rapid strikes that hit multiple times per turn.',
  icon:             'game-icons:crossed-swords',
  icon_color:       '#3090ff',
  hp:               5200, atk: 6500, def: 4200, spd: 8500, mana: 3500,
  skill_name:       'Blade Storm',
  skill_description:'Unleashes 5 rapid strikes on random enemies. Each hit deals ATK × 0.8 damage.',
  skill_effect:     JSON.stringify({ type:'multi_hit', target:'random_enemy', hits:5, atk_mult:0.8 }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — SSR (Lv.500–1000)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ssr_dark_elf',
  name:             'Dark Elf Archer',
  card_type:        'summon',
  rarity:           'SSR',
  description:      'An elite dark elf archer from the Elf Queendom. Precise shots that hit weak points.',
  icon:             'game-icons:arrow-flights',
  icon_color:       '#30cc88',
  hp:               3800, atk: 5200, def: 2800, spd: 7200, mana: 3200,
  skill_name:       'Vital Shot',
  skill_description:'Fires an arrow at the enemy\'s weak point. 50% chance to deal triple damage.',
  skill_effect:     JSON.stringify({ type:'attack_crit_chance', target:'single_enemy', atk_mult:1.5, crit_mult:3.0, crit_chance:0.5 }),
},
{
  card_key:         'ssr_shadow_knight',
  name:             'Shadow Knight',
  card_type:        'summon',
  rarity:           'SSR',
  description:      'A knight forged in shadow magic. Can step between dimensions to avoid attacks.',
  icon:             'game-icons:shadow-follower',
  icon_color:       '#6030aa',
  hp:               4200, atk: 4800, def: 4000, spd: 5800, mana: 3800,
  skill_name:       'Shadow Step',
  skill_description:'Steps into shadow dimension, making the party untargetable for 1 turn.',
  skill_effect:     JSON.stringify({ type:'evade', target:'all_allies', duration:1 }),
},
{
  card_key:         'ssr_ice_witch',
  name:             'Ice Witch',
  card_type:        'summon',
  rarity:           'SSR',
  description:      'A powerful witch who commands ice magic. Slows enemies with frozen spells.',
  icon:             'game-icons:ice-spell-cast',
  icon_color:       '#88ddff',
  hp:               3500, atk: 5500, def: 2500, spd: 5500, mana: 7000,
  skill_name:       'Absolute Zero',
  skill_description:'Freezes all enemies solid. Deals ice magic damage and reduces SPD by 70% for 2 turns.',
  skill_effect:     JSON.stringify({ type:'magic_aoe_debuff', target:'all_enemies', power:4200, stat:'spd', value:0.7, duration:2 }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — SR (Lv.100–500)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sr_dungeon_guard',
  name:             'Dungeon Guardian',
  card_type:        'summon',
  rarity:           'SR',
  description:      'A powerful guardian of the deep dungeon levels. Sturdy and reliable.',
  icon:             'game-icons:dungeon-gate',
  icon_color:       '#3090ff',
  hp:               2800, atk: 2500, def: 3200, spd: 2000, mana: 1800,
  skill_name:       'Stone Wall',
  skill_description:'Raises a barrier. Reduces damage to all allies by 30% for 2 turns.',
  skill_effect:     JSON.stringify({ type:'buff_defense', target:'all_allies', value:0.3, duration:2 }),
},
{
  card_key:         'sr_fire_mage',
  name:             'Fire Mage',
  card_type:        'summon',
  rarity:           'SR',
  description:      'A mage trained in fire magic arts. Reliable damage dealer from the back row.',
  icon:             'game-icons:fire-ray',
  icon_color:       '#ff6030',
  hp:               2200, atk: 3500, def: 1500, spd: 3200, mana: 5000,
  skill_name:       'Fireball',
  skill_description:'Launches a fireball at one enemy. Deals magic damage and has 30% chance to Burn.',
  skill_effect:     JSON.stringify({ type:'magic_single', target:'single_enemy', power:3200, dot_chance:0.3, dot:'burn' }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — R (Lv.50–100)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'r_mohawk_warrior',
  name:             'Mohawk Warrior',
  card_type:        'summon',
  rarity:           'R',
  description:      'A fierce warrior from the surface world. Strong for his level.',
  icon:             'game-icons:barbarian',
  icon_color:       '#888',
  hp:               800,  atk: 700,  def: 600,  spd: 750,  mana: 300,
  skill_name:       'War Cry',
  skill_description:'Lets out a battle cry. Increases party ATK by 20% for 2 turns.',
  skill_effect:     JSON.stringify({ type:'buff_atk', target:'all_allies', value:0.2, duration:2 }),
},
{
  card_key:         'r_abyss_fairy',
  name:             'Abyss Fairy',
  card_type:        'summon',
  rarity:           'R',
  description:      'A small magical fairy from the dungeon depths. Provides mana support.',
  icon:             'game-icons:fairy',
  icon_color:       '#cc88ff',
  hp:               500,  atk: 400,  def: 400,  spd: 900,  mana: 1200,
  skill_name:       'Mana Surge',
  skill_description:'Channels mana energy into the party. Restores 30% of the party\'s mana pool.',
  skill_effect:     JSON.stringify({ type:'restore_mana', target:'all_allies', value:0.3 }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — N (Lv.20–25)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'n_dungeon_rat',
  name:             'Dungeon Rat',
  card_type:        'summon',
  rarity:           'N',
  description:      'A common dungeon rat. Weak but fast.',
  icon:             'game-icons:rat',
  icon_color:       '#666',
  hp:               120, atk: 80,  def: 50,  spd: 200, mana: 50,
  skill_name:       'Scurry',
  skill_description:'Dashes past the enemy. 20% chance to dodge the next attack.',
  skill_effect:     JSON.stringify({ type:'dodge_chance', target:'self', value:0.2, duration:1 }),
},
{
  card_key:         'n_slime',
  name:             'Abyss Slime',
  card_type:        'summon',
  rarity:           'N',
  description:      'A basic slime from the dungeon. Soft but sticky.',
  icon:             'game-icons:slime',
  icon_color:       '#44aa44',
  hp:               180, atk: 60,  def: 120, spd: 80,  mana: 80,
  skill_name:       'Sticky Coat',
  skill_description:'Covers one enemy in slime. Reduces their SPD by 30% for 1 turn.',
  skill_effect:     JSON.stringify({ type:'debuff', target:'single_enemy', stat:'spd', value:0.3, duration:1 }),
},

/* ═══════════════════════════════════════════════════════════
   SUMMON CARDS — E (Error/Junk)
═══════════════════════════════════════════════════════════ */
{
  card_key:         'e_bent_fork',
  name:             'Bent Fork',
  card_type:        'summon',
  rarity:           'E',
  description:      'A bent fork pulled from the gacha. Utterly useless. Auto-refunds 5 crystals.',
  icon:             'game-icons:fork-knife-spoon',
  icon_color:       '#444',
  hp:               1, atk: 1, def: 1, spd: 1, mana: 1,
  skill_name:       'Bend',
  skill_description:'It bends further. Does absolutely nothing.',
  skill_effect:     JSON.stringify({ type:'nothing' }),
},
{
  card_key:         'e_rotten_apple',
  name:             'Rotten Apple',
  card_type:        'summon',
  rarity:           'E',
  description:      'A rotten apple. Why was this even in the gacha? Auto-refunds 5 crystals.',
  icon:             'game-icons:apples',
  icon_color:       '#444',
  hp:               1, atk: 1, def: 1, spd: 1, mana: 1,
  skill_name:       'Rot',
  skill_description:'It rots further. Does nothing useful.',
  skill_effect:     JSON.stringify({ type:'nothing' }),
},

/* ═══════════════════════════════════════════════════════════
   EQUIPMENT CARDS — EX / Genesis Class
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ex_gungnir',
  name:             'Divine Burial Gungnir',
  card_type:        'equipment',
  rarity:           'EX',
  description:      'A Genesis-Class black divine spear with 5 sealed forms. Even sealed it is catastrophic. Can erase souls, absorb energy, and slay gods.',
  icon:             'game-icons:winged-spear',
  icon_color:       '#ff30ff',
  equip_type:       'weapon',
  equip_class:      'Genesis',
  atk_bonus:        9999, def_bonus: 0, spd_bonus: 500, mana_bonus: 2000,
  equip_effect:     'All attacks ignore DEF. 10% chance to instantly KO any non-boss enemy. Unique — only 1 per account.',
},

/* ═══════════════════════════════════════════════════════════
   EQUIPMENT CARDS — SUR / Phantasma Class
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sur_beast_chain',
  name:             'Phantasma Beast Chain',
  card_type:        'equipment',
  rarity:           'SUR',
  description:      'Aoyuki\'s signature chains. Bound to the Monster Tamer\'s will. Dramatically boosts beast-taming power.',
  icon:             'game-icons:chain',
  icon_color:       '#f0c040',
  equip_type:       'weapon',
  equip_class:      'Phantasma',
  atk_bonus:        4200, def_bonus: 1800, spd_bonus: 800, mana_bonus: 1200,
  equip_effect:     'Beast Tame skill success rate increased to 100%. Tamed enemies deal 50% bonus damage.',
},
{
  card_key:         'sur_vier_grimoires',
  name:             'The Vier Grimoires',
  card_type:        'equipment',
  rarity:           'SUR',
  description:      'Ellie\'s four forbidden grimoires. Each holds unspeakable magical power. Massively amplifies magic output.',
  icon:             'game-icons:spell-book',
  icon_color:       '#9b30ff',
  equip_type:       'weapon',
  equip_class:      'Phantasma',
  atk_bonus:        1000, def_bonus: 0, spd_bonus: 200, mana_bonus: 5000,
  equip_effect:     'All magic spells deal 2× damage. Magic cards are not consumed on cast (infinite use for one battle).',
},

/* ═══════════════════════════════════════════════════════════
   EQUIPMENT CARDS — UR / Epic Class
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ur_wind_spear',
  name:             'Wind Spear Uragan',
  card_type:        'equipment',
  rarity:           'UR',
  description:      'A legendary wind-infused spear. Pierces steel-scale monsters. Boosts wind and lightning magic.',
  icon:             'game-icons:winged-spear',
  icon_color:       '#ff8c00',
  equip_type:       'weapon',
  equip_class:      'Epic',
  atk_bonus:        3200, def_bonus: 0, spd_bonus: 1200, mana_bonus: 600,
  equip_effect:     'Attacks pierce 50% of enemy DEF. Wind/lightning magic deals 40% bonus damage.',
},
{
  card_key:         'ur_golem_armor',
  name:             'Golem Armor',
  card_type:        'equipment',
  rarity:           'UR',
  description:      'A 3-meter mana-powered battle suit. Near-impenetrable defense.',
  icon:             'game-icons:chest-armor',
  icon_color:       '#888888',
  equip_type:       'armor',
  equip_class:      'Epic',
  atk_bonus:        0, def_bonus: 4800, spd_bonus: -200, mana_bonus: 800,
  equip_effect:     'Reduces all physical damage by 35%. Immune to stun effects.',
},
{
  card_key:         'ur_identity_hood',
  name:             'Identity Hood',
  card_type:        'equipment',
  rarity:           'UR',
  description:      'A magical hood that conceals your status from all Appraisal skills. Enemies cannot read your stats.',
  icon:             'game-icons:hood',
  icon_color:       '#6030aa',
  equip_type:       'accessory',
  equip_class:      'Epic',
  atk_bonus:        0, def_bonus: 1200, spd_bonus: 400, mana_bonus: 0,
  equip_effect:     'Immune to Appraisal. Enemies have 30% reduced accuracy against this character.',
},

/* ═══════════════════════════════════════════════════════════
   EQUIPMENT CARDS — SSR / Artifact Class
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ssr_illusion_mask',
  name:             'Illusion Mask',
  card_type:        'equipment',
  rarity:           'SSR',
  description:      'A mask that projects illusions. Confuses enemies and increases evasion.',
  icon:             'game-icons:domino-mask',
  icon_color:       '#9b30ff',
  equip_type:       'accessory',
  equip_class:      'Artifact',
  atk_bonus:        400, def_bonus: 600, spd_bonus: 800, mana_bonus: 400,
  equip_effect:     '25% chance to evade physical attacks. Confused enemies attack random targets.',
},
{
  card_key:         'ssr_mana_crystal_ring',
  name:             'Mana Crystal Ring',
  card_type:        'equipment',
  rarity:           'SSR',
  description:      'A ring embedded with a concentrated mana crystal. Greatly boosts spell power.',
  icon:             'game-icons:ring',
  icon_color:       '#3090ff',
  equip_type:       'accessory',
  equip_class:      'Artifact',
  atk_bonus:        200, def_bonus: 0, spd_bonus: 0, mana_bonus: 2800,
  equip_effect:     'All magic spells deal 25% bonus damage. Mana regenerates 15% faster each turn.',
},
{
  card_key:         'ssr_battle_sword',
  name:             'Abyss Battle Sword',
  card_type:        'equipment',
  rarity:           'SSR',
  description:      'A sword forged from dungeon ore. Reliable high-ATK weapon.',
  icon:             'game-icons:broadsword',
  icon_color:       '#3090ff',
  equip_type:       'weapon',
  equip_class:      'Artifact',
  atk_bonus:        2200, def_bonus: 200, spd_bonus: 0, mana_bonus: 0,
  equip_effect:     'Critical hits deal 180% damage instead of 150%.',
},

/* ═══════════════════════════════════════════════════════════
   EQUIPMENT CARDS — SR / Relic Class
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sr_iron_shield',
  name:             'Iron Tower Shield',
  card_type:        'equipment',
  rarity:           'SR',
  description:      'A heavy iron tower shield. Great for front-line fighters.',
  icon:             'game-icons:shield',
  icon_color:       '#888',
  equip_type:       'armor',
  equip_class:      'Relic',
  atk_bonus:        0, def_bonus: 1800, spd_bonus: -100, mana_bonus: 0,
  equip_effect:     'Blocks 20% of all incoming damage.',
},
{
  card_key:         'sr_swift_boots',
  name:             'Abyss Swift Boots',
  card_type:        'equipment',
  rarity:           'SR',
  description:      'Enchanted boots that grant supernatural speed.',
  icon:             'game-icons:boots',
  icon_color:       '#30cc88',
  equip_type:       'accessory',
  equip_class:      'Relic',
  atk_bonus:        0, def_bonus: 0, spd_bonus: 1500, mana_bonus: 0,
  equip_effect:     'This character always acts first in the turn order.',
},

/* ═══════════════════════════════════════════════════════════
   MAGIC CARDS — SUR Tier
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sur_appraisal',
  name:             'Appraisal',
  card_type:        'magic',
  rarity:           'SUR',
  description:      'The Truth-Seeker card. Reveals ALL hidden stats, resistances, weaknesses, and remaining HP of all enemies.',
  icon:             'game-icons:magnifying-glass',
  icon_color:       '#f0c040',
  magic_class:      'Strategical',
  magic_effect:     JSON.stringify({ type:'appraisal', target:'all_enemies', reveal:'all' }),
  magic_cost:       500,
  is_single_use:    false,
},
{
  card_key:         'sur_summon_nightmare',
  name:             'Summon Nightmare',
  card_type:        'magic',
  rarity:           'SUR',
  description:      'Summons a nightmare entity that tears through all enemies. Ignores DEF. Massive AoE magic damage.',
  icon:             'game-icons:abstract-106',
  icon_color:       '#9b30ff',
  magic_class:      'Strategical',
  magic_effect:     JSON.stringify({ type:'magic_aoe', target:'all_enemies', power:9000, ignore_def:true }),
  magic_cost:       2000,
  is_single_use:    true,
},

/* ═══════════════════════════════════════════════════════════
   MAGIC CARDS — UR Tier
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ur_magic_jamming',
  name:             'Magic Jamming',
  card_type:        'magic',
  rarity:           'UR',
  description:      'Deploys a field that nullifies ALL magic for 3 turns. Neither side can cast spells.',
  icon:             'game-icons:cancel',
  icon_color:       '#ff8c00',
  magic_class:      'Strategical',
  magic_effect:     JSON.stringify({ type:'magic_nullify', target:'all', duration:3 }),
  magic_cost:       1500,
  is_single_use:    true,
},
{
  card_key:         'ur_telepathy',
  name:             'Telepathy',
  card_type:        'magic',
  rarity:           'UR',
  description:      'Links minds with an enemy, reading their next action before they take it. Guarantees a dodge on the next enemy attack.',
  icon:             'game-icons:telepathy',
  icon_color:       '#3090ff',
  magic_class:      'Strategical',
  magic_effect:     JSON.stringify({ type:'predict_dodge', target:'all_allies', duration:1 }),
  magic_cost:       800,
  is_single_use:    false,
},

/* ═══════════════════════════════════════════════════════════
   MAGIC CARDS — SSSR Tier
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sssr_feast_of_dead',
  name:             'Feast of the Dead',
  card_type:        'magic',
  rarity:           'SSSR',
  description:      'Calls forth undead spirits that devour enemies in extreme pain. Deals massive damage over 3 turns and cannot be healed.',
  icon:             'game-icons:skull-crossed-bones',
  icon_color:       '#ff4422',
  magic_class:      'Tactical',
  magic_effect:     JSON.stringify({ type:'dot_aoe', target:'all_enemies', power:3000, dot_duration:3, dot_type:'undead', no_heal:true }),
  magic_cost:       1200,
  is_single_use:    true,
},
{
  card_key:         'sssr_blue_rose_fire',
  name:             'Blue Rose Fire',
  card_type:        'magic',
  rarity:           'SSSR',
  description:      'An explosion of blue magical fire roses. Massive AoE fire magic. Burns all enemies for 2 turns.',
  icon:             'game-icons:rose',
  icon_color:       '#3090ff',
  magic_class:      'Tactical',
  magic_effect:     JSON.stringify({ type:'magic_aoe_dot', target:'all_enemies', power:5500, dot:'burn', dot_duration:2 }),
  magic_cost:       1000,
  is_single_use:    true,
},

/* ═══════════════════════════════════════════════════════════
   MAGIC CARDS — SSR Tier
═══════════════════════════════════════════════════════════ */
{
  card_key:         'ssr_hypnosis',
  name:             'Hypnosis',
  card_type:        'magic',
  rarity:           'SSR',
  description:      'Hypnotizes one enemy, forcing them to reveal all their secrets and skip their next turn.',
  icon:             'game-icons:hypnotic-eyes',
  icon_color:       '#9b30ff',
  magic_class:      'Advanced',
  magic_effect:     JSON.stringify({ type:'hypnosis', target:'single_enemy', skip_turns:1, reveal:true }),
  magic_cost:       600,
  is_single_use:    true,
},
{
  card_key:         'ssr_slumber',
  name:             'Slumber',
  card_type:        'magic',
  rarity:           'SSR',
  description:      'Puts all enemies into a deep magical sleep for 2 turns. Sleeping enemies cannot act.',
  icon:             'game-icons:sleeping',
  icon_color:       '#88aaff',
  magic_class:      'Advanced',
  magic_effect:     JSON.stringify({ type:'sleep_aoe', target:'all_enemies', duration:2 }),
  magic_cost:       700,
  is_single_use:    true,
},
{
  card_key:         'ssr_firewall',
  name:             'Firewall',
  card_type:        'magic',
  rarity:           'SSR',
  description:      'Raises a wall of magical fire. Deals moderate damage to all enemies and reduces their ATK.',
  icon:             'game-icons:fire-ray',
  icon_color:       '#ff6030',
  magic_class:      'Advanced',
  magic_effect:     JSON.stringify({ type:'magic_aoe_debuff', target:'all_enemies', power:3500, stat:'atk', value:0.25, duration:2 }),
  magic_cost:       500,
  is_single_use:    true,
},

/* ═══════════════════════════════════════════════════════════
   MAGIC CARDS — SR Tier
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sr_ice_sword',
  name:             'Ice Sword',
  card_type:        'magic',
  rarity:           'SR',
  description:      'Conjures a sword of pure ice and strikes one enemy. Reduces their SPD.',
  icon:             'game-icons:ice-spell-cast',
  icon_color:       '#88ddff',
  magic_class:      'Tactician',
  magic_effect:     JSON.stringify({ type:'magic_single_debuff', target:'single_enemy', power:2200, stat:'spd', value:0.3, duration:2 }),
  magic_cost:       300,
  is_single_use:    true,
},
{
  card_key:         'sr_lightning_strike',
  name:             'Lightning Strike',
  card_type:        'magic',
  rarity:           'SR',
  description:      'Calls down a bolt of lightning on one enemy. High damage, chance to stun.',
  icon:             'game-icons:lightning-trio',
  icon_color:       '#ffee44',
  magic_class:      'Tactician',
  magic_effect:     JSON.stringify({ type:'magic_single_stun', target:'single_enemy', power:2800, stun_chance:0.35, stun_duration:1 }),
  magic_cost:       350,
  is_single_use:    true,
},

/* ═══════════════════════════════════════════════════════════
   MAGIC CARDS — R Tier
═══════════════════════════════════════════════════════════ */
{
  card_key:         'r_basic_fire',
  name:             'Fire Arrow',
  card_type:        'magic',
  rarity:           'R',
  description:      'A basic fire arrow spell. Hits one enemy for moderate fire damage.',
  icon:             'game-icons:fire-ray',
  icon_color:       '#ff8844',
  magic_class:      'Combat',
  magic_effect:     JSON.stringify({ type:'magic_single', target:'single_enemy', power:1200 }),
  magic_cost:       150,
  is_single_use:    true,
},
{
  card_key:         'r_wind_blade',
  name:             'Wind Blade',
  card_type:        'magic',
  rarity:           'R',
  description:      'A crescent-shaped wind blade. Hits one enemy for wind damage.',
  icon:             'game-icons:wind-slap',
  icon_color:       '#88ffcc',
  magic_class:      'Combat',
  magic_effect:     JSON.stringify({ type:'magic_single', target:'single_enemy', power:1100 }),
  magic_cost:       120,
  is_single_use:    true,
},

/* ═══════════════════════════════════════════════════════════
   CONSUMABLE ITEMS — SR to N
═══════════════════════════════════════════════════════════ */
{
  card_key:         'sr_revival_herb',
  name:             'Revival Herb',
  card_type:        'consumable',
  rarity:           'SR',
  description:      'A rare herb from the deep dungeon. Revives one fallen ally at 50% HP.',
  icon:             'game-icons:plant-roots',
  icon_color:       '#30ff90',
  magic_class:      null,
  magic_effect:     JSON.stringify({ type:'revive', target:'single_ally_dead', heal_pct:0.5 }),
  magic_cost:       0,
  is_single_use:    true,
},
{
  card_key:         'r_mana_potion',
  name:             'Mana Potion',
  card_type:        'consumable',
  rarity:           'R',
  description:      'A shimmering potion that restores mana. Refills the party mana pool by 500.',
  icon:             'game-icons:potion-ball',
  icon_color:       '#9b30ff',
  magic_class:      null,
  magic_effect:     JSON.stringify({ type:'restore_mana', target:'party', amount:500 }),
  magic_cost:       0,
  is_single_use:    true,
},
{
  card_key:         'r_power_shard',
  name:             'Power Shard',
  card_type:        'consumable',
  rarity:           'R',
  description:      'A shard of raw magical power. Boosts one character\'s ATK by 50% for 3 turns.',
  icon:             'game-icons:crystal-cluster',
  icon_color:       '#ff8c00',
  magic_class:      null,
  magic_effect:     JSON.stringify({ type:'buff_atk_single', target:'single_ally', value:0.5, duration:3 }),
  magic_cost:       0,
  is_single_use:    true,
},
{
  card_key:         'n_shadow_veil',
  name:             'Shadow Veil',
  card_type:        'consumable',
  rarity:           'N',
  description:      'A cloak of shadows. Makes one character untargetable by enemies for 1 turn.',
  icon:             'game-icons:cloak-dagger',
  icon_color:       '#6030aa',
  magic_class:      null,
  magic_effect:     JSON.stringify({ type:'stealth', target:'single_ally', duration:1 }),
  magic_cost:       0,
  is_single_use:    true,
},
{
  card_key:         'n_heal_potion',
  name:             'Healing Potion',
  card_type:        'consumable',
  rarity:           'N',
  description:      'A basic healing potion. Restores 200 HP to one ally.',
  icon:             'game-icons:health-potion',
  icon_color:       '#ff3355',
  magic_class:      null,
  magic_effect:     JSON.stringify({ type:'heal_single', target:'single_ally', amount:200 }),
  magic_cost:       0,
  is_single_use:    true,
},
{
  card_key:         'n_crystal_fragment',
  name:             'Crystal Fragment',
  card_type:        'consumable',
  rarity:           'N',
  description:      'A small fragment of Abyss Crystal. Can be converted to 20 crystals at any time.',
  icon:             'game-icons:crystals',
  icon_color:       '#f0c040',
  magic_class:      null,
  magic_effect:     JSON.stringify({ type:'convert_crystals', amount:20 }),
  magic_cost:       0,
  is_single_use:    true,
},

]; // end CARD_DATA

/* ═══════════════════════════════════════════════════════════
   GACHA POOL CONFIG
   Controls which cards appear in the gacha and at what rates
═══════════════════════════════════════════════════════════ */

window.GACHA_CONFIG = {
  // Cost per pull
  single_cost: 100,
  ten_cost:    900,

  // Pity thresholds
  pity_ssr:  90,   // guaranteed SSR+ every N pulls
  pity_sur:  180,  // guaranteed SUR every N pulls

  // Type distribution (what type of card you get)
  type_weights: {
    summon:     50,
    equipment:  30,
    magic:      15,
    consumable: 5,
  },

  // Rarity rates (per pull, %)
  rarity_rates: {
    E:    10,
    N:    35,
    R:    25,
    SR:   16,
    SSR:   8,
    SSSR:  4,
    UR:    1.5,
    SUR:   0.4,
    EX:    0.1,
  },

  // Duplicate refund amounts (crystals)
  dupe_refund: {
    E: 0, N: 5, R: 10, SR: 20,
    SSR: 50, SSSR: 80, UR: 120, SUR: 200, EX: 500,
  },
};

/* ═══════════════════════════════════════════════════════════
   HELPER: Get all cards of a given type and rarity
═══════════════════════════════════════════════════════════ */
window.getCardsByTypeAndRarity = function(type, rarity) {
  return window.CARD_DATA.filter(c =>
    c.card_type === type && c.rarity === rarity
  );
};

/* ═══════════════════════════════════════════════════════════
   HELPER: Get card icon color for display
═══════════════════════════════════════════════════════════ */
window.getCardIconHtml = function(card, size = 32) {
  const color = card.icon_color || '#888';
  return `<iconify-icon icon="${card.icon}" width="${size}" height="${size}" style="color:${color}"></iconify-icon>`;
};
