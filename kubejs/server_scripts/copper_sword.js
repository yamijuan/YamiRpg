// BestTechRpg: copper sword crafted pre-enchanted with Smite II.
// BetterCopper's vanilla copper sword has very low enchantmentValue (~1-3) so
// Apothic Enchanting refuses to enchant it. As a starter perk, the recipe is
// replaced with one that outputs a copper sword pre-enchanted with Smite II.

ServerEvents.recipes(event => {
	event.remove({ id: "bettercopper:copper_sword" });
	event.shaped(
		Item.of("bettercopper:copper_sword").enchant("minecraft:smite", 2),
		[
			"X",
			"X",
			"#"
		],
		{
			X: "minecraft:copper_ingot",
			"#": "minecraft:stick"
		}
	).id("besttechrpg:copper_sword_smite2");
});
