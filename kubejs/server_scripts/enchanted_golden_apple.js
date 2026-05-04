// BestTechRpg: Enchanted Golden Apple craftable.
//
// Vanilla 1.21 leaves enchanted_golden_apple uncraftable (chest loot only).
// We re-add a recipe gated behind ATM + vibranium, so it's a vibranium-tier
// reward rather than RNG loot.
//
// Pattern alternates allthemodium and vibranium blocks around a golden apple:
//   A V A
//   V G V    (4 allthemodium blocks at corners, 4 vibranium blocks at edges)
//   A V A

ServerEvents.recipes(event => {
	event.shaped(
		"minecraft:enchanted_golden_apple",
		["AVA", "VGV", "AVA"],
		{
			A: "allthemodium:allthemodium_block",
			V: "allthemodium:vibranium_block",
			G: "minecraft:golden_apple"
		}
	).id("besttechrpg:enchanted_golden_apple");
});
