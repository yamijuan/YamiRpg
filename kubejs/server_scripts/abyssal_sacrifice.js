// BestTechRpg: Abyssal Sacrifice recipe gating.
//
// The Abyssal Sacrifice (cataclysm:abyssal_sacrifice) is the item used to summon
// Scylla. The default Cataclysm recipe is too cheap for our tier progression — we
// gate it behind allthemodium + vibranium so it can only be crafted post-ATM tier.

ServerEvents.recipes(event => {
  event.remove({ output: 'cataclysm:abyssal_sacrifice' });

  event.shaped(
    'cataclysm:abyssal_sacrifice',
    ['ANV', 'DHE', 'IXG'],
    {
      A: 'allthemodium:allthemodium_block',
      N: 'minecraft:nautilus_shell',
      V: 'allthemodium:vibranium_block',
      D: 'minecraft:diamond_block',
      H: 'minecraft:heart_of_the_sea',
      E: 'minecraft:emerald_block',
      I: 'minecraft:iron_block',
      X: 'minecraft:netherite_block',
      G: 'minecraft:gold_block'
    }
  ).id('besttechrpg:abyssal_sacrifice');
});
