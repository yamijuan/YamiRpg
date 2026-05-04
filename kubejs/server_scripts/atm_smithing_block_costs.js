// BestTechRpg: ATM smithing recipes use blocks instead of ingots.
//
// Vanilla ATM smithing recipes for armor and most tools cost 1 ingot of the
// target tier. Mace recipes already cost a block. We promote the rest to
// match — every armor/tool upgrade costs 1 block (= 9 ingots) of its tier.
//
// Tiers: allthemodium → base is netherite_*, addition becomes allthemodium_block
//        vibranium    → base is allthemodium_*, addition becomes vibranium_block
//        unobtainium  → base is vibranium_*,    addition becomes unobtainium_block
//
// Skips mace (already block-based in vanilla ATM recipes).

const ATM_PIECES = [
	{ piece: "axe",        baseNs: "minecraft" },
	{ piece: "boots",      baseNs: "minecraft" },
	{ piece: "chestplate", baseNs: "minecraft" },
	{ piece: "helmet",     baseNs: "minecraft" },
	{ piece: "hoe",        baseNs: "minecraft" },
	{ piece: "leggings",   baseNs: "minecraft" },
	{ piece: "pickaxe",    baseNs: "minecraft" },
	{ piece: "shovel",     baseNs: "minecraft" },
	{ piece: "sword",      baseNs: "minecraft" }
];

// Each tier upgrades from the previous tier's item (allthemodium upgrades from
// vanilla netherite, vibranium from allthemodium, unobtainium from vibranium).
const ATM_TIERS = [
	{ tier: "allthemodium", basePrefix: "minecraft:netherite_",         block: "allthemodium:allthemodium_block" },
	{ tier: "vibranium",    basePrefix: "allthemodium:allthemodium_",   block: "allthemodium:vibranium_block"    },
	{ tier: "unobtainium",  basePrefix: "allthemodium:vibranium_",      block: "allthemodium:unobtainium_block"  }
];

ServerEvents.recipes(event => {
	ATM_TIERS.forEach(t => {
		ATM_PIECES.forEach(p => {
			const recipeId = `allthemodium:smithing/${t.tier}_${p.piece}_smithing`;
			const baseItem = `${t.basePrefix}${p.piece}`;
			const resultItem = `allthemodium:${t.tier}_${p.piece}`;
			const templateItem = `allthemodium:${t.tier}_upgrade_smithing_template`;

			event.remove({ id: recipeId });

			event.custom({
				type: "minecraft:smithing_transform",
				template: { item: templateItem },
				base: { item: baseItem },
				addition: { item: t.block },
				result: { id: resultItem, count: 1 }
			}).id(`besttechrpg:${t.tier}_${p.piece}_smithing`);
		});
	});
});
