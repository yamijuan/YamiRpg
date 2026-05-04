// BestTechRpg: ATM/Vibranium/Unobtanium tier variants of Paladins netherite armor.
//
// Mirrors the weapon-variant approach (paladins_tier_variants.js):
//   - NBT-based variants on the netherite base item (preserves armor behavior + spell_engine)
//   - Custom_model_data switches inventory icon to a recolored variant texture
//   - Progressive smithing chain: net → atm → vib → unob
//
// Stat scaling — CRUSADER (uses ATM mod's armor table directly):
//   Slot   |  ATM(ar/at/kb)  |  VIB(ar/at/kb)  |  UNOB(ar/at/kb)
//   helmet |   4 / 5  / 0.5  |   6 / 9  / 0.8  |   8 / 15 / 1.0
//   chest  |   7 / 5  / 0.5  |   9 / 9  / 0.8  |  11 / 15 / 1.0
//   legs   |   9 / 5  / 0.5  |  11 / 9  / 0.8  |  13 / 15 / 1.0
//   boots  |   4 / 5  / 0.5  |   6 / 9  / 0.8  |   8 / 15 / 1.0
//   + healing power (flat add): net=+1, atm=+2, vib=+3, unob=+4 per piece
//
// Stat scaling — PRIOR (20% less than crusader, plus extra spell power %):
//   helmet |   3 / 4  / 0.4  |   5 / 7  / 0.6  |   6 / 12 / 0.8
//   chest  |   6 / 4  / 0.4  |   7 / 7  / 0.6  |   9 / 12 / 0.8
//   legs   |   7 / 4  / 0.4  |   9 / 7  / 0.6  |  10 / 12 / 0.8
//   boots  |   3 / 4  / 0.4  |   5 / 7  / 0.6  |   6 / 12 / 0.8
//   + healing power %: net=30%, atm=50%, vib=70%, unob=90% per piece (multiplicative)
//   + spell haste %:   net=4%,  atm=8%,  vib=12%, unob=16% per piece (additive)
//
// All tier variants are UNBREAKABLE.

// Renamed to ARMOR_-prefixed names to avoid global-scope const collision with
// paladins_tier_variants.js (KubeJS shares scope across server scripts).
const ARMOR_TIER_MATERIALS = {
	atm:        { block: "allthemodium:allthemodium_block", template: "allthemodium:allthemodium_upgrade_smithing_template", color: "#e89725", model_data: 1 },
	vibranium:  { block: "allthemodium:vibranium_block",    template: "allthemodium:vibranium_upgrade_smithing_template",    color: "#209187", model_data: 2 },
	unobtanium: { block: "allthemodium:unobtainium_block",  template: "allthemodium:unobtainium_upgrade_smithing_template",  color: "#7e35c3", model_data: 3 }
};
const ARMOR_TIER_DISPLAY = { atm: "Allthemodium", vibranium: "Vibranium", unobtanium: "Unobtanium" };
const ARMOR_TIER_REQUIRES_CMD = { atm: null, vibranium: 1, unobtanium: 2 };

// Per-slot, per-tier crusader stats (armor, toughness, knockback)
const CRUSADER_STATS = {
	head:  { atm: [4, 5, 0.5], vibranium: [6, 9, 0.8], unobtanium: [8, 15, 1.0] },
	chest: { atm: [7, 5, 0.5], vibranium: [9, 9, 0.8], unobtanium: [11, 15, 1.0] },
	legs:  { atm: [9, 5, 0.5], vibranium: [11, 9, 0.8], unobtanium: [13, 15, 1.0] },
	feet:  { atm: [4, 5, 0.5], vibranium: [6, 9, 0.8], unobtanium: [8, 15, 1.0] }
};

// Per-slot, per-tier prior stats (20% less, hand-rounded)
const PRIOR_STATS = {
	head:  { atm: [3, 4, 0.4], vibranium: [5, 7, 0.6], unobtanium: [6, 12, 0.8] },
	chest: { atm: [6, 4, 0.4], vibranium: [7, 7, 0.6], unobtanium: [9, 12, 0.8] },
	legs:  { atm: [7, 4, 0.4], vibranium: [9, 7, 0.6], unobtanium: [10, 12, 0.8] },
	feet:  { atm: [3, 4, 0.4], vibranium: [5, 7, 0.6], unobtanium: [6, 12, 0.8] }
};

// Crusader: flat healing power per piece per tier
const CRUSADER_HEALING_FLAT = { atm: 2.0, vibranium: 3.0, unobtanium: 4.0 };

// Prior: multiplicative healing % per piece per tier (0.5 = +50%)
const PRIOR_HEALING_PCT = { atm: 0.50, vibranium: 0.70, unobtanium: 0.90 };

// Prior: additive haste % per piece per tier
const PRIOR_HASTE_PCT = { atm: 0.08, vibranium: 0.12, unobtanium: 0.16 };

// 8 base armor items: 4 crusader + 4 prior. Map paladins suffix → equipment slot.
const ARMOR_PIECES = [
	{ kind: "crusader", suffix: "armor_head",  slot: "head"  },
	{ kind: "crusader", suffix: "armor_chest", slot: "chest" },
	{ kind: "crusader", suffix: "armor_legs",  slot: "legs"  },
	{ kind: "crusader", suffix: "armor_feet",  slot: "feet"  },
	{ kind: "prior",    suffix: "robe_head",   slot: "head"  },
	{ kind: "prior",    suffix: "robe_chest",  slot: "chest" },
	{ kind: "prior",    suffix: "robe_legs",   slot: "legs"  },
	{ kind: "prior",    suffix: "robe_feet",   slot: "feet"  }
];

// Renamed from attrModifier — paladins_tier_variants.js (weapons) defines a 4-arg
// version of attrModifier that conflicts here in KubeJS's shared script scope.
function armorAttrModifier(attr, value, op, slot, idSuffix) {
	return {
		type: attr,
		amount: value,
		operation: op,
		slot: slot,
		id: "besttechrpg:tier_variant/" + idSuffix
	};
}

function buildArmorComponents(piece, tier) {
	const tm = ARMOR_TIER_MATERIALS[tier];
	const display = ARMOR_TIER_DISPLAY[tier];
	const slotName = piece.slot.charAt(0).toUpperCase() + piece.slot.slice(1);
	const kindName = piece.kind.charAt(0).toUpperCase() + piece.kind.slice(1);
	const components = {
		"minecraft:custom_name": '{"text":"' + display + ' ' + kindName + ' ' + slotName + '","color":"' + tm.color + '","italic":false}',
		"minecraft:custom_model_data": tm.model_data,
		"minecraft:rarity": "epic",
		"minecraft:unbreakable": {},
		"minecraft:lore": [ '{"text":"' + display + ' tier","color":"' + tm.color + '","italic":true}' ]
	};

	var modifiers = [];
	const idPrefix = tier + "_" + piece.kind + "_" + piece.slot;

	if (piece.kind === "crusader") {
		const stats = CRUSADER_STATS[piece.slot][tier];  // [armor, toughness, kb]
		modifiers.push(armorAttrModifier("minecraft:generic.armor",                 stats[0], "add_value", piece.slot, idPrefix + "_armor"));
		modifiers.push(armorAttrModifier("minecraft:generic.armor_toughness",       stats[1], "add_value", piece.slot, idPrefix + "_tough"));
		modifiers.push(armorAttrModifier("minecraft:generic.knockback_resistance",  stats[2], "add_value", piece.slot, idPrefix + "_kb"));
		modifiers.push(armorAttrModifier("spell_power:healing", CRUSADER_HEALING_FLAT[tier], "add_value", piece.slot, idPrefix + "_heal"));
	}

	if (piece.kind === "prior") {
		const stats = PRIOR_STATS[piece.slot][tier];
		modifiers.push(armorAttrModifier("minecraft:generic.armor",                 stats[0], "add_value", piece.slot, idPrefix + "_armor"));
		modifiers.push(armorAttrModifier("minecraft:generic.armor_toughness",       stats[1], "add_value", piece.slot, idPrefix + "_tough"));
		modifiers.push(armorAttrModifier("minecraft:generic.knockback_resistance",  stats[2], "add_value", piece.slot, idPrefix + "_kb"));
		// spell_power's own enchantments use add_multiplied_base for percentage-style attributes
		// (healing, haste, etc.) — that operation is recognized by the tooltip formatter and
		// displays as "+X%" instead of raw decimal.
		modifiers.push(armorAttrModifier("spell_power:healing", PRIOR_HEALING_PCT[tier], "add_multiplied_base", piece.slot, idPrefix + "_heal_pct"));
		modifiers.push(armorAttrModifier("spell_power:haste",   PRIOR_HASTE_PCT[tier],   "add_multiplied_base", piece.slot, idPrefix + "_haste"));
	}

	components["minecraft:attribute_modifiers"] = { modifiers: modifiers };
	return components;
}

function buildArmorBase(piece, tier) {
	const itemId = "paladins:netherite_" + piece.kind + "_" + piece.suffix;
	const reqCmd = ARMOR_TIER_REQUIRES_CMD[tier];
	if (reqCmd === null) return { item: itemId };
	return {
		type: "neoforge:components",
		items: itemId,
		components: { "minecraft:custom_model_data": reqCmd }
	};
}

ServerEvents.recipes(event => {
	ARMOR_PIECES.forEach(piece => {
		Object.keys(ARMOR_TIER_MATERIALS).forEach(tier => {
			const tm = ARMOR_TIER_MATERIALS[tier];
			const itemId = "paladins:netherite_" + piece.kind + "_" + piece.suffix;
			event.custom({
				type: "minecraft:smithing_transform",
				template: { item: tm.template },
				base:     buildArmorBase(piece, tier),
				addition: { item: tm.block },
				result: {
					id: itemId,
					count: 1,
					components: buildArmorComponents(piece, tier)
				}
			}).id("besttechrpg:" + tier + "_" + piece.kind + "_" + piece.suffix + "_smithing");
		});
	});
});
