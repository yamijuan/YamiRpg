// BestTechRpg: single-source-of-truth eye-to-tier map.
// Used as documentation; actual gating is via AStages [Item]+[Recipe] restrictions
// and FTB Quest sentinel rewards.

global.EYE_TIERS = {
  tier_iron:               ['endrem:exotic_eye',   'endrem:undead_eye'],
  tier_diamond:            ['endrem:rogue_eye',    'endrem:lost_eye'],
  tier_netherite:          ['endrem:nether_eye',   'endrem:wither_eye'],
  tier_allthemodium:       ['endrem:cold_eye',     'endrem:guardian_eye'],
  tier_vibranium:          ['endrem:cursed_eye',   'endrem:corrupted_eye'],
  tier_endgame:            ['endrem:cryptic_eye',  'endrem:evil_eye']
};

// Disabled (4 of 16): black, magical, witch, old.
global.EYES_DISABLED = ['endrem:black_eye', 'endrem:magical_eye', 'endrem:witch_eye', 'endrem:old_eye'];
