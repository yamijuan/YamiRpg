// BestTechRpg: Gateways to Eternity pearl gating.
//
// The Copper-tier "easy" gateway is gateways:overworldian_nights, a "survive the night"
// arena of zombie/skeleton/spider/creeper waves, themed for early-game tier_copper.
// The original recipe needs an ender_eye; we swap it for a vanilla ender_pearl so the
// recipe is craftable from start (the player has no End Remastered eyes at tier_copper).
//
// All other vanilla Gateways pearl recipes are removed. The endgame "ultimate" pearl is
// defined in kubejs/data/besttechrpg/recipe/ultimate_pearl.json (gated by ingredient
// progression (needs vibranium ingot + nether star + netherite).

ServerEvents.recipes(event => {
  // Remove all 7 vanilla Gateways pearl recipes by their registry IDs
  // (KubeJS recipe IDs use namespace:path-without-"recipe/").
  [
    'gateways:basic/blaze',
    'gateways:basic/enderman',
    'gateways:basic/slime',
    'gateways:emerald_grove',
    'gateways:endless/blaze',
    'gateways:hellish_fortress',
    'gateways:overworldian_nights'
  ].forEach(id => event.remove({ id: id }));

  // Re-register the overworldian_nights pearl with a copper-tier-friendly center:
  // ender_pearl instead of ender_eye. All other ingredients unchanged from the original.
  event.custom({
    type: 'gateways:gate_recipe',
    group: 'gateways',
    pattern: ['DED', 'GAG', 'BFB'],
    key: {
      D: { tag: 'c:dusts/glowstone' },
      E: { item: 'minecraft:spider_eye' },
      G: { tag: 'c:gunpowders' },
      A: { item: 'minecraft:ender_pearl' },
      B: { tag: 'c:bones' },
      F: { item: 'minecraft:rotten_flesh' }
    },
    result: { id: 'gateways:gate_pearl' },
    gateway: 'gateways:overworldian_nights'
  }).id('besttechrpg:copper_pearl');
});
