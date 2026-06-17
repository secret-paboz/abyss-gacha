/* ═══════════════════════════════════════════════════════════
   ABYSS GACHA — DATA/STAGES.JS
   Chapter and stage definitions, rewards, unlock conditions
═══════════════════════════════════════════════════════════ */

window.STAGE_DATA = [

/* ═══════════════════════════════════════════════════════════
   CHAPTER 1: THE ABYSS
═══════════════════════════════════════════════════════════ */
{
  chapter:        1,
  name:           'The Abyss',
  subtitle:       'Crawl up from the depths of despair',
  icon:           'game-icons:cave-entrance',
  icon_color:     '#9b30ff',
  bg_class:       'chapter-1',
  unlock_chapter: null, // always unlocked
  stages: [
    {
      stage:           1,
      name:            'Hellhound Den',
      enemy_key:       'c1_s1',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 2000,
      story_text:      'The depths of the Abyss. Strange creatures lurk in the dark...',
    },
    {
      stage:           2,
      name:            'Stone Passage',
      enemy_key:       'c1_s2',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 5000,
      story_text:      'A massive golem blocks the only path forward.',
    },
    {
      stage:           3,
      name:            'Betrayer\'s Garrison',
      enemy_key:       'c1_s3',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 12000,
      story_text:      'Former allies now stand in your way. They chose this.',
    },
    {
      stage:           0,
      name:            'BOSS: Betrayer Kaito',
      enemy_key:       'c1_s0',
      is_boss:         true,
      first_clear_crystals: 500,
      stamina_cost:    0,
      recommended_power: 30000,
      story_text:      'The leader of those who cast you into the abyss. It ends here.',
    },
  ],
},

/* ═══════════════════════════════════════════════════════════
   CHAPTER 2: SURFACE WORLD
═══════════════════════════════════════════════════════════ */
{
  chapter:        2,
  name:           'Surface World',
  subtitle:       'The world above holds no welcome for you',
  icon:           'game-icons:pine-tree',
  icon_color:     '#30cc88',
  bg_class:       'chapter-2',
  unlock_chapter: 1, // unlocks after clearing chapter 1 boss
  stages: [
    {
      stage:           1,
      name:            'Kingdom Outskirts',
      enemy_key:       'c2_s1',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 50000,
      story_text:      'The surface kingdom sends soldiers to repel all outsiders.',
    },
    {
      stage:           2,
      name:            'Cursed Forest',
      enemy_key:       'c2_s2',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 80000,
      story_text:      'A forest corrupted by dark magic. Something massive stirs within.',
    },
    {
      stage:           3,
      name:            'Dark Sanctum',
      enemy_key:       'c2_s3',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 120000,
      story_text:      'A dark priest and his knight guardian stand between you and your revenge.',
    },
    {
      stage:           0,
      name:            'BOSS: Betrayer Yanark',
      enemy_key:       'c2_s0',
      is_boss:         true,
      first_clear_crystals: 500,
      stamina_cost:    0,
      recommended_power: 200000,
      story_text:      'The second betrayer. He sold your life for power. Now he pays.',
    },
  ],
},

/* ═══════════════════════════════════════════════════════════
   CHAPTER 3: ELF QUEENDOM
═══════════════════════════════════════════════════════════ */
{
  chapter:        3,
  name:           'Elf Queendom',
  subtitle:       'Ancient power and hidden secrets',
  icon:           'game-icons:oak-leaf',
  icon_color:     '#44ffaa',
  bg_class:       'chapter-3',
  unlock_chapter: 2,
  stages: [
    {
      stage:           1,
      name:            'Elven Border',
      enemy_key:       'c3_s1',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 350000,
      story_text:      'The Elf Queendom\'s border is guarded by elite warriors. None may pass.',
    },
    {
      stage:           2,
      name:            'Sacred Grove',
      enemy_key:       'c3_s2',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 500000,
      story_text:      'Deep within the sacred grove, an archmage guards forbidden knowledge.',
    },
    {
      stage:           3,
      name:            'Royal Palace Gate',
      enemy_key:       'c3_s3',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 800000,
      story_text:      'Commander Vashiel blocks the palace entrance. He has never been defeated.',
    },
    {
      stage:           0,
      name:            'BOSS: Queen Sasha',
      enemy_key:       'c3_s0',
      is_boss:         true,
      first_clear_crystals: 500,
      stamina_cost:    0,
      recommended_power: 1500000,
      story_text:      'The Queen herself descends to face you. Ancient power flows through her veins.',
    },
  ],
},

/* ═══════════════════════════════════════════════════════════
   CHAPTER 4: HUMAN KINGDOM
═══════════════════════════════════════════════════════════ */
{
  chapter:        4,
  name:           'Human Kingdom',
  subtitle:       'The corrupt throne must fall',
  icon:           'game-icons:castle',
  icon_color:     '#4466cc',
  bg_class:       'chapter-4',
  unlock_chapter: 3,
  stages: [
    {
      stage:           1,
      name:            'Castle District',
      enemy_key:       'c4_s1',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 3000000,
      story_text:      'The Human Kingdom\'s elite forces defend the castle district.',
    },
    {
      stage:           2,
      name:            'General\'s Hall',
      enemy_key:       'c4_s2',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 5000000,
      story_text:      'The corrupted general commands the inner defense. His power is unnatural.',
    },
    {
      stage:           3,
      name:            'Throne Room Approach',
      enemy_key:       'c4_s3',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 8000000,
      story_text:      'The royal guard captain will die before he lets anyone through.',
    },
    {
      stage:           0,
      name:            'BOSS: Princess Lilith',
      enemy_key:       'c4_s0',
      is_boss:         true,
      first_clear_crystals: 500,
      stamina_cost:    0,
      recommended_power: 15000000,
      story_text:      'The Princess has been corrupted by the Nine Principalities\' dark power. Save her or destroy her.',
    },
  ],
},

/* ═══════════════════════════════════════════════════════════
   CHAPTER 5: NINE PRINCIPALITY SUMMIT
═══════════════════════════════════════════════════════════ */
{
  chapter:        5,
  name:           'Nine Principality Summit',
  subtitle:       'The source of all corruption',
  icon:           'game-icons:thor-hammer',
  icon_color:     '#ff4422',
  bg_class:       'chapter-5',
  unlock_chapter: 4,
  stages: [
    {
      stage:           1,
      name:            'Summit Gates',
      enemy_key:       'c5_s1',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 30000000,
      story_text:      'The Nine Principalities deploy their finest warriors at the Summit gates.',
    },
    {
      stage:           2,
      name:            'Council Chambers',
      enemy_key:       'c5_s2',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 50000000,
      story_text:      'The Council\'s enforcer stands between you and the final confrontation.',
    },
    {
      stage:           3,
      name:            'The Undefeated',
      enemy_key:       'c5_s3',
      is_boss:         false,
      first_clear_crystals: 200,
      stamina_cost:    0,
      recommended_power: 80000000,
      story_text:      'Champion Veld. Never lost. Never will — until today.',
    },
    {
      stage:           0,
      name:            'FINAL BOSS: The Three Elders',
      enemy_key:       'c5_s0',
      is_boss:         true,
      first_clear_crystals: 1000,
      stamina_cost:    0,
      recommended_power: 150000000,
      story_text:      'Three Elders of the Nine Principalities. The source of all corruption. The reason for everything. This is what you crawled out of the Abyss for.',
    },
  ],
},

]; // end STAGE_DATA

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

/**
 * Get chapter data by chapter number
 */
window.getChapter = function(chapterNum) {
  return window.STAGE_DATA.find(c => c.chapter === chapterNum) || null;
};

/**
 * Get a specific stage definition
 * @param {number} chapter
 * @param {number} stage  - 0 = boss
 */
window.getStage = function(chapter, stage) {
  const ch = window.getChapter(chapter);
  if (!ch) return null;
  return ch.stages.find(s => s.stage === stage) || null;
};

/**
 * Check if a chapter is unlocked for the player
 * @param {number} chapterNum
 */
window.isChapterUnlocked = function(chapterNum) {
  const ch = window.getChapter(chapterNum);
  if (!ch) return false;
  if (!ch.unlock_chapter) return true; // Chapter 1 always unlocked

  // Chapter N unlocks when chapter N-1 boss is cleared
  return isStageClear(ch.unlock_chapter, 0); // stage 0 = boss
};

/**
 * Check if a specific stage is unlocked
 * Normal stages unlock sequentially (1→2→3→boss)
 * Boss unlocks after all normal stages cleared
 */
window.isStageUnlocked = function(chapter, stage) {
  if (!window.isChapterUnlocked(chapter)) return false;
  if (stage === 1) return true; // First stage always unlocked if chapter is

  if (stage === 0) {
    // Boss unlocks after stages 1, 2, 3 all cleared
    return isStageClear(chapter, 1) &&
           isStageClear(chapter, 2) &&
           isStageClear(chapter, 3);
  }

  // Stage N unlocks after stage N-1 cleared
  return isStageClear(chapter, stage - 1);
};

/**
 * Get total first-clear crystals available in a chapter
 */
window.getChapterMaxCrystals = function(chapterNum) {
  const ch = window.getChapter(chapterNum);
  if (!ch) return 0;
  return ch.stages.reduce((sum, s) => sum + (s.first_clear_crystals || 0), 0);
};

/**
 * Get total crystals earned from all cleared stages
 */
window.getTotalClearedCrystals = function() {
  let total = 0;
  for (const ch of window.STAGE_DATA) {
    for (const stage of ch.stages) {
      if (isStageClear(ch.chapter, stage.stage)) {
        total += stage.first_clear_crystals;
      }
    }
  }
  return total;
};

/**
 * Get how many stages cleared in a chapter
 */
window.getChapterClearCount = function(chapterNum) {
  const ch = window.getChapter(chapterNum);
  if (!ch) return { cleared: 0, total: 0 };
  const total   = ch.stages.length;
  const cleared = ch.stages.filter(s => isStageClear(chapterNum, s.stage)).length;
  return { cleared, total };
};

/**
 * Get difficulty label and color for display
 */
window.getDifficultyDisplay = function(challenge) {
  const map = {
    easy:       { label: 'Easy',       color: 'var(--color-success)' },
    normal:     { label: 'Normal',     color: 'var(--color-info)' },
    hard:       { label: 'Hard',       color: 'var(--rarity-ur)' },
    impossible: { label: 'Impossible', color: 'var(--color-danger)' },
  };
  return map[challenge] || map.normal;
};

/**
 * Calculate total first-clear rewards across all chapters
 */
window.TOTAL_STAGE_CRYSTALS = window.STAGE_DATA.reduce((sum, ch) =>
  sum + ch.stages.reduce((s2, st) => s2 + (st.first_clear_crystals || 0), 0), 0
);
