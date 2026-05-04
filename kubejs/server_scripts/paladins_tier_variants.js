// BestTechRpg: ATM/Vibranium/Unobtanium tier variants of Paladins netherite weapons.
//
// Approach B (NBT-based variants on netherite base): each tier variant is the
// same paladins:netherite_* item with custom data components added — preserves
// claymore/mace/staff/shield class behaviors AND spell_engine integration.
//
// Stat scaling (matches ATM tool progression):
//   ATM         = netherite × 2 dmg, +1 attack speed
//   Vibranium   = ATM       × 2 dmg, +1 attack speed (so × 4 vs netherite, +2 speed)
//   Unobtanium  = Vibranium × 1.5 (no extra speed bump)
//
// Holy staff scaling uses spell_power:healing analogously (×2, ×4, ×6).
// Kite shield: paladins gives netherite shield +1 armor_toughness and +4 max_health.
// Tier variants scale these by the same multipliers (×2, ×4, ×6).
// All tier variants (ATM and up) are UNBREAKABLE — matches ATM tool/armor convention
// where allthemodium-tier and above gear has infinite durability.
//
// Progressive smithing chain — each tier requires the previous variant as base:
//   ATM:        netherite_X (vanilla)             + atm_block        + atm_template       → atm_X variant
//   Vibranium:  netherite_X with custom_model_data:1 + vibranium_block  + vibranium_template → vib_X variant
//   Unobtanium: netherite_X with custom_model_data:2 + unobtanium_block + unob_template      → unob_X variant
// Vibranium + Unobtanium use neoforge:components ingredient to match the previous
// tier's custom_model_data marker on the base item.

const TIER_MATERIALS = {
	atm:        { block: "allthemodium:allthemodium_block", template: "allthemodium:allthemodium_upgrade_smithing_template", color: "#e89725", model_data: 1 },
	vibranium:  { block: "allthemodium:vibranium_block",    template: "allthemodium:vibranium_upgrade_smithing_template",    color: "#209187", model_data: 2 },
	unobtanium: { block: "allthemodium:unobtainium_block",  template: "allthemodium:unobtainium_upgrade_smithing_template",  color: "#7e35c3", model_data: 3 }
};

const TIER_DISPLAY = {
	atm:        "Allthemodium",
	vibranium:  "Vibranium",
	unobtanium: "Unobtanium"
};

// Multipliers vs netherite base
const TIER_DMG_MULT = { atm: 2.0, vibranium: 4.0, unobtanium: 6.0 };
const TIER_SPD_BONUS = { atm: 1.0, vibranium: 2.0, unobtanium: 2.0 }; 
const TIER_HEAL_MULT = { atm: 2.0, vibranium: 4.0, unobtanium: 6.0 };
// Shield stat multipliers — same scale as weapon dmg
const TIER_SHIELD_MULT = { atm: 2.0, vibranium: 4.0, unobtanium: 6.0 };

// Paladins netherite base stats
const NETHERITE_BASE = {
	netherite_claymore:    { dmg: 12.5, spd: 1.0 },
	netherite_mace:        { dmg: 10.6, spd: 1.2 },
	netherite_holy_staff:  { dmg: 5.0, spd: 1, healing: 7.0 },
	netherite_kite_shield: { toughness: 1.0, maxHealth: 4.0 }
};

function attrModifier(attr, value, slot, idSuffix) {
	return {
		type: attr,
		amount: value,
		operation: "add_value",
		slot: slot,
		id: "besttechrpg:tier_variant/" + idSuffix
	};
}

function buildComponents(weapon, tier) {
	const tm = TIER_MATERIALS[tier];
	const display = TIER_DISPLAY[tier];
	const base = NETHERITE_BASE["netherite_" + weapon];
	const tierLabel = weapon.replace("_", " ").replace(/^./, c => c.toUpperCase());
	const components = {
		"minecraft:custom_name": '{"text":"' + display + ' ' + tierLabel + '","color":"' + tm.color + '","italic":false}',
		"minecraft:custom_model_data": tm.model_data,
		"minecraft:rarity": "epic",
		"minecraft:unbreakable": {},
		"minecraft:lore": [ '{"text":"' + display + ' tier","color":"' + tm.color + '","italic":true}' ]
	};

	var modifiers = [];

	if (weapon === "claymore" || weapon === "mace") {
		var newDmg = base.dmg * TIER_DMG_MULT[tier];
		var newSpd = base.spd + TIER_SPD_BONUS[tier];
		modifiers.push(attrModifier("minecraft:generic.attack_damage", newDmg - 1, "mainhand", tier + "_" + weapon + "_dmg"));
		modifiers.push(attrModifier("minecraft:generic.attack_speed",  newSpd - 4.0, "mainhand", tier + "_" + weapon + "_spd"));
	}

	if (weapon === "holy_staff") {
		var staffDmg = base.dmg * TIER_DMG_MULT[tier];
		var staffSpd = base.spd + TIER_SPD_BONUS[tier];
		var staffHeal = base.healing * TIER_HEAL_MULT[tier];
		modifiers.push(attrModifier("minecraft:generic.attack_damage",     staffDmg - 1, "mainhand", tier + "_staff_dmg"));
		modifiers.push(attrModifier("minecraft:generic.attack_speed",      staffSpd - 4.0, "mainhand", tier + "_staff_spd"));
		modifiers.push(attrModifier("spell_power:healing",         staffHeal, "mainhand", tier + "_staff_healing"));
		modifiers.push(attrModifier("spell_power:critical_damage", 0.5 * TIER_DMG_MULT[tier], "mainhand", tier + "_staff_crit"));
	}

	if (weapon === "kite_shield") {
		var shieldTough = base.toughness * TIER_SHIELD_MULT[tier];
		var shieldHp = base.maxHealth * TIER_SHIELD_MULT[tier];
		modifiers.push(attrModifier("minecraft:generic.armor_toughness", shieldTough, "offhand", tier + "_shield_tough"));
		modifiers.push(attrModifier("minecraft:generic.max_health",      shieldHp,    "offhand", tier + "_shield_hp"));
	}

	if (modifiers.length > 0) {
		components["minecraft:attribute_modifiers"] = { modifiers: modifiers };
	}

	return components;
}

// Each tier requires the previous variant's NBT marker on the base item.
// ATM accepts vanilla netherite_X (no marker); vib requires CMD:1 (atm marker);
// unob requires CMD:2 (vib marker).
const TIER_REQUIRES_CMD = { atm: null, vibranium: 1, unobtanium: 2 };

function buildBaseIngredient(weapon, tier) {
	const itemId = "paladins:netherite_" + weapon;
	const requiredCmd = TIER_REQUIRES_CMD[tier];
	if (requiredCmd === null) {
		return { item: itemId };
	}
	// neoforge:components — partial-match ingredient that requires the listed
	// data components on the base item.
	return {
		type: "neoforge:components",
		items: itemId,
		components: { "minecraft:custom_model_data": requiredCmd }
	};
}

ServerEvents.recipes(event => {
	const WEAPONS = ["claymore", "mace", "holy_staff", "kite_shield"];
	WEAPONS.forEach(weapon => {
		Object.keys(TIER_MATERIALS).forEach(tier => {
			const tm = TIER_MATERIALS[tier];
			event.custom({
				type: "minecraft:smithing_transform",
				template: { item: tm.template },
				base:     buildBaseIngredient(weapon, tier),
				addition: { item: tm.block },
				result: {
					id: "paladins:netherite_" + weapon,
					count: 1,
					components: buildComponents(weapon, tier)
				}
			}).id("besttechrpg:" + tier + "_" + weapon + "_smithing");
		});
	});
});
