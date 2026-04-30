// BestTechRpg: physically remove End Remastered crafting recipes from JEI.
//
// End Remastered ships crafting recipes for 3 eyes (exotic, undead, witch); the other
// 13 eyes are loot-injected only. Since all 12 used eyes are quest-only rewards in this
// pack, the recipes should not appear in JEI at all. AStages Recipe restrictions still
// gate any recipe that may exist, but this strips the recipes from the registry so
// players don't see "you need stage X to craft this" prompts in JEI either.

ServerEvents.recipes(event => {
  [
    'endrem:exotic_eye',
    'endrem:undead_eye',
    'endrem:witch_eye'
  ].forEach(id => event.remove({ id: id }));
});
