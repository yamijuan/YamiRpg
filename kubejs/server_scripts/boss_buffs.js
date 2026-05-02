// BestTechRpg: boss attribute buffs.
//
// Modifies entity attributes at spawn. The persistentData marker ensures the
// buff is applied once per entity — without it, EntityEvents.spawned firing on
// chunk reload would compound the multiplier each time the entity is loaded.

const BOSS_BUFFS = {
	"twilightforest:naga":             { attack_damage_multiplier: 2.0 },
	"mowziesmobs:ferrous_wroughtnaut": { max_health_multiplier:    2.0 },
	"twilightforest:minoshroom":       { attack_damage_multiplier: 4.0, max_health_multiplier: 5.0 },
	"minecraft:wither":                { attack_damage_multiplier: 1.2, max_health_multiplier: 1.5 },
	"minecraft:elder_guardian":        { attack_damage_multiplier: 4.0, max_health_multiplier: 5.0 }
};

EntityEvents.spawned(event => {
	const e = event.entity;
	const buff = BOSS_BUFFS[e.type];
	if (!buff) return;
	if (e.persistentData.getBoolean("besttechrpg:buffed")) return;

	if (buff.attack_damage_multiplier) {
		const attr = e.getAttribute("minecraft:generic.attack_damage");
		if (attr) attr.setBaseValue(attr.baseValue * buff.attack_damage_multiplier);
	}

	if (buff.max_health_multiplier) {
		const attr = e.getAttribute("minecraft:generic.max_health");
		if (attr) {
			attr.setBaseValue(attr.baseValue * buff.max_health_multiplier);
			e.setHealth(e.maxHealth); // top up so the entity isn't half-empty after the bump
		}
	}

	e.persistentData.putBoolean("besttechrpg:buffed", true);
});
