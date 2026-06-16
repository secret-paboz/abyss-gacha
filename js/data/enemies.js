/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — DATA/ENEMIES.JS
   All enemy definitions for every stage and boss
═══════════════════════════════════════════════════════════ */

window.ENEMY_DATA = {

/* ═══════════════════════════════════════════════════════════
   CHAPTER 1: THE ABYSS
   Theme: Dark dungeon depths, betrayal, escape
═══════════════════════════════════════════════════════════ */

  // Stage 1-1
  'c1_s1': [
    {
      enemy_key:   'snake_hellhound',
      name:        'Snake Hellhound',
      icon:        'game-icons:wolf-head',
      icon_color:  '#884422',
      level:       50,
      hp:          1200, atk: 180, def: 80, spd: 120,
      is_boss:     false,
      actions:     ['attack','attack','attack'],
      skills:      [],
      description: 'A serpentine hound from the dungeon depths. Hunts in packs.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'dungeon_spider',
      name:        'Dungeon Spider',
      icon:        'game-icons:spider-face',
      icon_color:  '#444',
      level:       45,
      hp:          800, atk: 150, def: 60, spd: 180,
      is_boss:     false,
      actions:     ['attack','poison','attack'],
      skills:      [{ name:'Venom Bite', effect:{ type:'dot', stat:'hp', value:80, duration:2 }, cooldown:3 }],
      description: 'A venomous spider that poisons its prey.',
      drop_crystals: 0,
    },
  ],

  // Stage 1-2
  'c1_s2': [
    {
      enemy_key:   'abyss_golem_enemy',
      name:        'Abyss Stone Golem',
      icon:        'game-icons:stone-crafting',
      icon_color:  '#666',
      level:       100,
      hp:          4500, atk: 280, def: 350, spd: 60,
      is_boss:     false,
      actions:     ['attack','defend','attack','attack'],
      skills:      [{ name:'Tremor Slam', effect:{ type:'aoe_damage', power:220, stun_chance:0.3 }, cooldown:4 }],
      description: 'A massive stone construct guarding the dungeon passage.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'rock_bat',
      name:        'Rock Bat',
      icon:        'game-icons:bat-wing',
      icon_color:  '#886644',
      level:       80,
      hp:          1800, atk: 220, def: 100, spd: 260,
      is_boss:     false,
      actions:     ['attack','attack','flee_attempt','attack'],
      skills:      [{ name:'Sonic Screech', effect:{ type:'debuff', stat:'spd', value:0.4, duration:2 }, cooldown:3 }],
      description: 'A bat with stone-hard wings that emits paralyzing screeches.',
      drop_crystals: 0,
    },
  ],

  // Stage 1-3
  'c1_s3': [
    {
      enemy_key:   'elite_dungeon_guard',
      name:        'Elite Dungeon Guard',
      icon:        'game-icons:knight-helmet',
      icon_color:  '#888',
      level:       200,
      hp:          8000, atk: 420, def: 380, spd: 180,
      is_boss:     false,
      actions:     ['attack','skill','attack','defend','attack'],
      skills:      [
        { name:'Shield Bash', effect:{ type:'attack_stun', power:380, stun_chance:0.5, stun_duration:1 }, cooldown:3 },
        { name:'Guard Formation', effect:{ type:'buff_def', target:'self', value:0.5, duration:2 }, cooldown:5 },
      ],
      description: 'A hardened guard who abandoned Light deep in the dungeon.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'dungeon_mage',
      name:        'Dungeon Mage',
      icon:        'game-icons:wizard-staff',
      icon_color:  '#9b30ff',
      level:       180,
      hp:          5500, atk: 350, def: 150, spd: 280,
      is_boss:     false,
      actions:     ['magic','attack','magic','defend'],
      skills:      [{ name:'Dark Bolt', effect:{ type:'magic_single', power:480, ignore_def:false }, cooldown:2 }],
      description: 'A mage who serves the betrayers. Casts dark bolts from range.',
      drop_crystals: 0,
    },
  ],

  // Stage 1-BOSS
  'c1_s0': [
    {
      enemy_key:   'kaito_betrayer',
      name:        'Betrayer Kaito',
      icon:        'game-icons:cowled',
      icon_color:  '#ff3355',
      level:       500,
      hp:          35000, atk: 820, def: 600, spd: 350,
      is_boss:     true,
      actions:     ['attack','skill','attack','attack','skill','boss_special'],
      skills:      [
        { name:'Betrayal Slash', effect:{ type:'attack_multi', hits:3, atk_mult:0.9 }, cooldown:3 },
        { name:'Rally Cry', effect:{ type:'buff_atk', target:'all_allies', value:0.3, duration:2 }, cooldown:5 },
      ],
      boss_special: { name:'Dungeon Collapse', effect:{ type:'aoe_damage', power:950, ignore_def:false }, trigger_turn:6 },
      description: 'The leader of the betrayers who cast Light into the abyss. Wields a cursed blade.',
      drop_crystals: 0,
    },
  ],

/* ═══════════════════════════════════════════════════════════
   CHAPTER 2: SURFACE WORLD
   Theme: First revenge, surface civilization
═══════════════════════════════════════════════════════════ */

  // Stage 2-1
  'c2_s1': [
    {
      enemy_key:   'surface_soldier',
      name:        'Kingdom Soldier',
      icon:        'game-icons:knight-helmet',
      icon_color:  '#4488cc',
      level:       280,
      hp:          9000, atk: 550, def: 480, spd: 240,
      is_boss:     false,
      actions:     ['attack','attack','skill','attack'],
      skills:      [{ name:'Formation Strike', effect:{ type:'attack_multi', hits:2, atk_mult:0.8 }, cooldown:3 }],
      description: 'A well-trained soldier of the surface kingdom.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'kingdom_archer',
      name:        'Kingdom Archer',
      icon:        'game-icons:arrow-flights',
      icon_color:  '#88aa44',
      level:       260,
      hp:          7000, atk: 620, def: 280, spd: 380,
      is_boss:     false,
      actions:     ['attack','attack','skill','attack','attack'],
      skills:      [{ name:'Volley', effect:{ type:'aoe_damage', power:480, target:'all_allies' }, cooldown:4 }],
      description: 'A skilled archer who rains arrows from a distance.',
      drop_crystals: 0,
    },
  ],

  // Stage 2-2
  'c2_s2': [
    {
      enemy_key:   'cursed_beast',
      name:        'Cursed Forest Beast',
      icon:        'game-icons:bear-head',
      icon_color:  '#664422',
      level:       380,
      hp:          16000, atk: 720, def: 520, spd: 300,
      is_boss:     false,
      actions:     ['attack','attack','skill','attack','attack','skill'],
      skills:      [
        { name:'Feral Rage', effect:{ type:'buff_atk', target:'self', value:0.6, duration:3 }, cooldown:5 },
        { name:'Rend', effect:{ type:'attack_dot', power:680, dot:'bleed', dot_duration:2 }, cooldown:3 },
      ],
      description: 'A massive beast corrupted by dark magic. Grows stronger when wounded.',
      drop_crystals: 0,
    },
  ],

  // Stage 2-3
  'c2_s3': [
    {
      enemy_key:   'dark_priest',
      name:        'Dark Priest',
      icon:        'game-icons:cultist',
      icon_color:  '#550055',
      level:       500,
      hp:          18000, atk: 680, def: 400, spd: 320,
      is_boss:     false,
      actions:     ['magic','skill','magic','defend','magic'],
      skills:      [
        { name:'Dark Blessing', effect:{ type:'heal_enemy', target:'all_enemies', heal_pct:0.15 }, cooldown:4 },
        { name:'Curse', effect:{ type:'debuff_atk', target:'single_ally', value:0.4, duration:3 }, cooldown:3 },
      ],
      description: 'A priest who worships the dark forces. Heals allies and curses enemies.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'dark_knight',
      name:        'Dark Knight',
      icon:        'game-icons:dark-squad',
      icon_color:  '#333366',
      level:       520,
      hp:          22000, atk: 850, def: 700, spd: 260,
      is_boss:     false,
      actions:     ['attack','attack','skill','attack','defend'],
      skills:      [{ name:'Dark Charge', effect:{ type:'attack_pierce', power:920, pierce_def:0.5 }, cooldown:4 }],
      description: 'A knight sworn to darkness. His strikes pierce through armor.',
      drop_crystals: 0,
    },
  ],

  // Stage 2-BOSS
  'c2_s0': [
    {
      enemy_key:   'yanark_betrayer',
      name:        'Betrayer Yanark',
      icon:        'game-icons:cowled',
      icon_color:  '#ff6600',
      level:       800,
      hp:          65000, atk: 1100, def: 850, spd: 480,
      is_boss:     true,
      actions:     ['attack','skill','attack','attack','skill','attack','boss_special'],
      skills:      [
        { name:'Betrayal Spear', effect:{ type:'attack_pierce', power:1050, pierce_def:0.6 }, cooldown:3 },
        { name:'Taunt', effect:{ type:'force_target', target:'self', duration:2 }, cooldown:5 },
      ],
      boss_special: { name:'Betrayer\'s Wrath', effect:{ type:'aoe_damage', power:1400, ignore_def:true }, trigger_turn:7 },
      description: 'Second betrayer of Light\'s party. A spear master consumed by greed.',
      drop_crystals: 0,
    },
  ],

/* ═══════════════════════════════════════════════════════════
   CHAPTER 3: ELF QUEENDOM
   Theme: Political intrigue, elven power
═══════════════════════════════════════════════════════════ */

  // Stage 3-1
  'c3_s1': [
    {
      enemy_key:   'elf_guardian',
      name:        'Elf Royal Guardian',
      icon:        'game-icons:elf-helmet',
      icon_color:  '#22cc66',
      level:       700,
      hp:          28000, atk: 980, def: 820, spd: 480,
      is_boss:     false,
      actions:     ['attack','skill','attack','attack'],
      skills:      [{ name:'Nature\'s Wrath', effect:{ type:'magic_aoe', power:880, element:'nature' }, cooldown:4 }],
      description: 'An elite elf guardian of the Queendom\'s inner sanctum.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'elf_ranger',
      name:        'Elf Ranger',
      icon:        'game-icons:arrow-flights',
      icon_color:  '#44bb44',
      level:       680,
      hp:          22000, atk: 1100, def: 580, spd: 680,
      is_boss:     false,
      actions:     ['attack','attack','skill','attack','attack'],
      skills:      [{ name:'Elven Arrow Rain', effect:{ type:'aoe_damage', power:920, target:'all_allies' }, cooldown:4 }],
      description: 'A highly skilled elf ranger with supernatural accuracy.',
      drop_crystals: 0,
    },
  ],

  // Stage 3-2
  'c3_s2': [
    {
      enemy_key:   'elf_archmage',
      name:        'Elf Archmage',
      icon:        'game-icons:magic-swirl',
      icon_color:  '#44ffaa',
      level:       900,
      hp:          32000, atk: 850, def: 620, spd: 560,
      is_boss:     false,
      actions:     ['magic','magic','skill','magic','defend'],
      skills:      [
        { name:'Ancient Forest Magic', effect:{ type:'magic_aoe', power:1200, element:'nature', ignore_def:false }, cooldown:3 },
        { name:'Mana Drain', effect:{ type:'drain_mana', target:'all_allies', amount:300 }, cooldown:5 },
      ],
      description: 'An archmage who has mastered ancient elven magic passed down for millennia.',
      drop_crystals: 0,
    },
  ],

  // Stage 3-3
  'c3_s3': [
    {
      enemy_key:   'elf_commander',
      name:        'Elf Commander Vashiel',
      icon:        'game-icons:knight-helmet',
      icon_color:  '#33dd77',
      level:       1100,
      hp:          48000, atk: 1350, def: 1100, spd: 520,
      is_boss:     false,
      actions:     ['attack','skill','attack','attack','skill','attack'],
      skills:      [
        { name:'Command Strike', effect:{ type:'attack_multi', hits:2, atk_mult:1.1 }, cooldown:3 },
        { name:'Battle Hymn', effect:{ type:'buff_all', stat:'atk', value:0.3, target:'all_enemies', duration:3 }, cooldown:6 },
      ],
      description: 'The fearsome commander of the Elf Queendom\'s army.',
      drop_crystals: 0,
    },
  ],

  // Stage 3-BOSS
  'c3_s0': [
    {
      enemy_key:   'queen_sasha',
      name:        'Queen Sasha',
      icon:        'game-icons:queen-crown',
      icon_color:  '#44ffaa',
      level:       1500,
      hp:          120000, atk: 1800, def: 1400, spd: 680,
      is_boss:     true,
      actions:     ['attack','skill','magic','attack','skill','attack','boss_special'],
      skills:      [
        { name:'Royal Decree', effect:{ type:'debuff_all', stat:'atk', value:0.5, target:'all_allies', duration:3 }, cooldown:4 },
        { name:'Elven Judgement', effect:{ type:'magic_aoe', power:1600, ignore_def:false }, cooldown:5 },
        { name:'Nature\'s Embrace', effect:{ type:'heal_enemy', target:'self', heal_pct:0.2 }, cooldown:4 },
      ],
      boss_special: { name:'Wrath of the Forest', effect:{ type:'aoe_damage', power:2200, ignore_def:true }, trigger_turn:8 },
      description: 'The proud and ruthless Queen of the Elf Queendom. Wields ancient royal magic.',
      drop_crystals: 0,
    },
  ],

/* ═══════════════════════════════════════════════════════════
   CHAPTER 4: HUMAN KINGDOM
   Theme: Political corruption, false nobility
═══════════════════════════════════════════════════════════ */

  // Stage 4-1
  'c4_s1': [
    {
      enemy_key:   'royal_knight',
      name:        'Royal Knight',
      icon:        'game-icons:knight-helmet',
      icon_color:  '#4466cc',
      level:       1400,
      hp:          55000, atk: 1600, def: 1500, spd: 580,
      is_boss:     false,
      actions:     ['attack','defend','skill','attack','attack'],
      skills:      [
        { name:'Royal Slash', effect:{ type:'attack_pierce', power:1550, pierce_def:0.3 }, cooldown:3 },
        { name:'Shield Wall', effect:{ type:'buff_def', target:'self', value:0.6, duration:2 }, cooldown:5 },
      ],
      description: 'An elite knight of the Human Kingdom sworn to protect the corrupt throne.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'court_mage',
      name:        'Court Mage',
      icon:        'game-icons:wizard-staff',
      icon_color:  '#6644cc',
      level:       1380,
      hp:          42000, atk: 1400, def: 880, spd: 720,
      is_boss:     false,
      actions:     ['magic','skill','magic','magic','defend'],
      skills:      [
        { name:'Arcane Barrage', effect:{ type:'magic_multi', hits:3, power:800 }, cooldown:3 },
        { name:'Mana Shield', effect:{ type:'magic_barrier', target:'self', absorb:8000, duration:2 }, cooldown:6 },
      ],
      description: 'A powerful court mage who serves the Human King with dangerous arcane magic.',
      drop_crystals: 0,
    },
  ],

  // Stage 4-2
  'c4_s2': [
    {
      enemy_key:   'corrupted_general',
      name:        'Corrupted General',
      icon:        'game-icons:rank-3',
      icon_color:  '#cc4444',
      level:       1800,
      hp:          85000, atk: 2000, def: 1700, spd: 620,
      is_boss:     false,
      actions:     ['attack','skill','attack','attack','skill','attack'],
      skills:      [
        { name:'General\'s Order', effect:{ type:'buff_atk', target:'all_enemies', value:0.35, duration:3 }, cooldown:5 },
        { name:'Execute', effect:{ type:'attack_execute', power:2100, execute_threshold:0.25 }, cooldown:4 },
      ],
      description: 'A general whose soul has been corrupted by dark power. Immensely dangerous.',
      drop_crystals: 0,
    },
  ],

  // Stage 4-3
  'c4_s3': [
    {
      enemy_key:   'royal_guard_captain',
      name:        'Royal Guard Captain',
      icon:        'game-icons:rank-3',
      icon_color:  '#ccaa00',
      level:       2200,
      hp:          110000, atk: 2400, def: 2100, spd: 680,
      is_boss:     false,
      actions:     ['attack','skill','attack','defend','attack','skill'],
      skills:      [
        { name:'Captain\'s Fury', effect:{ type:'attack_multi', hits:4, atk_mult:0.85 }, cooldown:3 },
        { name:'Iron Will', effect:{ type:'self_revive', hp_pct:0.3, trigger:'on_death', once:true }, cooldown:999 },
      ],
      description: 'The captain of the royal guard. Fights with fanatical devotion even near death.',
      drop_crystals: 0,
    },
  ],

  // Stage 4-BOSS
  'c4_s0': [
    {
      enemy_key:   'princess_lilith',
      name:        'Corrupted Princess Lilith',
      icon:        'game-icons:queen-crown',
      icon_color:  '#cc44aa',
      level:       3000,
      hp:          280000, atk: 3200, def: 2600, spd: 820,
      is_boss:     true,
      actions:     ['attack','skill','magic','attack','skill','attack','magic','boss_special'],
      skills:      [
        { name:'Dark Curse', effect:{ type:'debuff_all', stat:'all', value:0.3, target:'all_allies', duration:4 }, cooldown:4 },
        { name:'Soul Drain', effect:{ type:'drain_hp', target:'single_ally', steal_pct:0.15 }, cooldown:3 },
        { name:'Shadow Barrier', effect:{ type:'magic_barrier', target:'self', absorb:50000, duration:3 }, cooldown:7 },
      ],
      boss_special: { name:'Corruption Nova', effect:{ type:'aoe_damage', power:4000, ignore_def:true, apply_debuff:'all_stats_down' }, trigger_turn:8 },
      description: 'The Princess of the Human Kingdom, corrupted by the Nine Principality\'s dark influence. Terrifyingly powerful.',
      drop_crystals: 0,
    },
  ],

/* ═══════════════════════════════════════════════════════════
   CHAPTER 5: NINE PRINCIPALITY SUMMIT
   Theme: Final confrontation, world powers
═══════════════════════════════════════════════════════════ */

  // Stage 5-1
  'c5_s1': [
    {
      enemy_key:   'principality_soldier',
      name:        'Principality Elite',
      icon:        'game-icons:knight-helmet',
      icon_color:  '#cc3300',
      level:       3500,
      hp:          180000, atk: 3800, def: 3200, spd: 880,
      is_boss:     false,
      actions:     ['attack','skill','attack','attack','defend'],
      skills:      [{ name:'Elite Strike', effect:{ type:'attack_pierce', power:4000, pierce_def:0.4 }, cooldown:3 }],
      description: 'An elite soldier representing one of the Nine Principalities.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'principality_mage',
      name:        'Principality Mage',
      icon:        'game-icons:magic-swirl',
      icon_color:  '#cc6600',
      level:       3400,
      hp:          140000, atk: 3500, def: 2200, spd: 980,
      is_boss:     false,
      actions:     ['magic','magic','skill','magic'],
      skills:      [{ name:'Annihilation Beam', effect:{ type:'magic_single', power:5500, ignore_def:true }, cooldown:4 }],
      description: 'A mage of terrifying caliber serving the Nine Principalities.',
      drop_crystals: 0,
    },
  ],

  // Stage 5-2
  'c5_s2': [
    {
      enemy_key:   'council_enforcer',
      name:        'Council Enforcer',
      icon:        'game-icons:rank-3',
      icon_color:  '#880000',
      level:       4500,
      hp:          320000, atk: 4800, def: 4200, spd: 920,
      is_boss:     false,
      actions:     ['attack','skill','attack','attack','skill','attack'],
      skills:      [
        { name:'Council Judgement', effect:{ type:'aoe_damage', power:4500, ignore_def:false }, cooldown:4 },
        { name:'Absolute Authority', effect:{ type:'debuff_all', stat:'spd', value:0.5, target:'all_allies', duration:3 }, cooldown:6 },
      ],
      description: 'The fearsome enforcer of the Nine Principality Council. Shows no mercy.',
      drop_crystals: 0,
    },
  ],

  // Stage 5-3
  'c5_s3': [
    {
      enemy_key:   'council_champion',
      name:        'Council Champion Veld',
      icon:        'game-icons:knight-helmet',
      icon_color:  '#660000',
      level:       5500,
      hp:          480000, atk: 5500, def: 5000, spd: 1000,
      is_boss:     false,
      actions:     ['attack','skill','attack','attack','skill','magic','attack'],
      skills:      [
        { name:'Champion\'s Blade', effect:{ type:'attack_multi', hits:5, atk_mult:0.9 }, cooldown:3 },
        { name:'Undying Champion', effect:{ type:'self_revive', hp_pct:0.4, trigger:'on_death', once:true }, cooldown:999 },
        { name:'Aura of Power', effect:{ type:'buff_all', stat:'atk', value:0.5, target:'all_enemies', duration:999 }, cooldown:999 },
      ],
      description: 'The undefeated champion of the Nine Principalities. Has never lost a battle.',
      drop_crystals: 0,
    },
  ],

  // Stage 5-BOSS (Final)
  'c5_s0': [
    {
      enemy_key:   'council_elder_1',
      name:        'Elder Ragnor',
      icon:        'game-icons:wizard-staff',
      icon_color:  '#880022',
      level:       7000,
      hp:          600000, atk: 6500, def: 5500, spd: 1100,
      is_boss:     true,
      actions:     ['magic','skill','attack','magic','skill','boss_special'],
      skills:      [
        { name:'World Annihilation', effect:{ type:'magic_aoe', power:7000, ignore_def:true }, cooldown:4 },
        { name:'Elder\'s Ward', effect:{ type:'magic_barrier', target:'all_enemies', absorb:80000, duration:3 }, cooldown:6 },
      ],
      boss_special: { name:'Cataclysm', effect:{ type:'aoe_damage', power:9000, ignore_def:true }, trigger_turn:9 },
      description: 'The eldest and most powerful member of the Nine Principality Council. A god among men.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'council_elder_2',
      name:        'Elder Seraphine',
      icon:        'game-icons:queen-crown',
      icon_color:  '#220088',
      level:       7000,
      hp:          550000, atk: 6000, def: 5000, spd: 1300,
      is_boss:     true,
      actions:     ['magic','skill','magic','defend','skill','boss_special'],
      skills:      [
        { name:'Time Freeze', effect:{ type:'skip_ally_turn', target:'all_allies', duration:1 }, cooldown:5 },
        { name:'Soul Crush', effect:{ type:'drain_hp', target:'single_ally', steal_pct:0.25 }, cooldown:3 },
      ],
      boss_special: { name:'Reality Shatter', effect:{ type:'aoe_damage', power:8500, ignore_def:true, instant_kill_chance:0.1 }, trigger_turn:9 },
      description: 'The second elder of the Nine Principality Council. Manipulates space and time.',
      drop_crystals: 0,
    },
    {
      enemy_key:   'council_elder_3',
      name:        'Elder Mordecai',
      icon:        'game-icons:crown',
      icon_color:  '#884400',
      level:       7000,
      hp:          580000, atk: 7000, def: 4800, spd: 1050,
      is_boss:     true,
      actions:     ['attack','skill','attack','attack','magic','boss_special'],
      skills:      [
        { name:'Tyrant\'s Decree', effect:{ type:'debuff_all', stat:'all', value:0.4, target:'all_allies', duration:4 }, cooldown:4 },
        { name:'Execution Order', effect:{ type:'attack_execute', power:8000, execute_threshold:0.3 }, cooldown:5 },
      ],
      boss_special: { name:'Divine Punishment', effect:{ type:'aoe_damage', power:10000, ignore_def:true }, trigger_turn:9 },
      description: 'The third elder and head of the Council. His word is law. His power is absolute.',
      drop_crystals: 0,
    },
  ],

}; // end ENEMY_DATA

/* ═══════════════════════════════════════════════════════════
   HELPER: Get enemies for a stage
   @param {number} chapter
   @param {number} stage  - 0 = boss
═══════════════════════════════════════════════════════════ */
window.getStageEnemies = function(chapter, stage) {
  const key = `c${chapter}_s${stage}`;
  const enemies = window.ENEMY_DATA[key];
  if (!enemies) return [];

  // Return deep copies so battle state doesn't mutate definitions
  return enemies.map(e => ({
    ...e,
    current_hp:    e.hp,
    max_hp:        e.hp,
    action_index:  0,
    status_effects:[],
    is_dead:       false,
  }));
};

/* ═══════════════════════════════════════════════════════════
   HELPER: Calculate total party power vs stage
   Returns 'easy' | 'normal' | 'hard' | 'impossible'
═══════════════════════════════════════════════════════════ */
window.getStageChallenge = function(chapter, stage, partyPower) {
  const enemies  = window.ENEMY_DATA[`c${chapter}_s${stage}`] || [];
  if (!enemies.length) return 'normal';
  const totalEnemyHp  = enemies.reduce((s, e) => s + e.hp, 0);
  const totalEnemyAtk = enemies.reduce((s, e) => s + e.atk, 0);
  const enemyPower    = totalEnemyHp * 0.4 + totalEnemyAtk * 100;
  const ratio         = partyPower / (enemyPower || 1);
  if (ratio >= 2.0)  return 'easy';
  if (ratio >= 1.0)  return 'normal';
  if (ratio >= 0.5)  return 'hard';
  return 'impossible';
};
