// BestTechRpg: Cataclysm Dungeon Block craftable.
//
// The dungeon_block is normally only obtainable via creative or structure
// loot. We add a shaped recipe (8 obsidian + 1 crying obsidian center) and
// gate it via AStages at tier_unobtanium_pearl.

ServerEvents.recipes(event => {
	event.shaped(
		"cataclysm:dungeon_block",
		["OOO", "OCO", "OOO"],
		{
			O: "minecraft:obsidian",
			C: "minecraft:crying_obsidian"
		}
	).id("besttechrpg:dungeon_block");
});
