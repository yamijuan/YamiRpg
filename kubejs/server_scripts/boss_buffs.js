// BestTechRpg: boss attribute buffs + per-player scaling.
//
// 1. Spawn buff: every entity in BOSS_BUFFS gets its base attributes multiplied
//    once at spawn (persistentData "besttechrpg:buffed" marker prevents
//    re-applying on chunk reload).
// 2. Engagement scaling: at first hit, count nearby players within
//    ENGAGE_RADIUS and scale max_health by +50% per extra player and
//    attack_damage by +20% per extra player. Once-per-boss via
//    "besttechrpg:engaged" marker — joiners don't bump up the difficulty
//    further, leavers don't reduce it.

const BOSS_BUFFS = {
	"twilightforest:naga":             { attack_damage_multiplier: 2.0 },
	"mowziesmobs:ferrous_wroughtnaut": { max_health_multiplier:    2.0 },
	"twilightforest:minoshroom":       { attack_damage_multiplier: 4.0, max_health_multiplier: 5.0 },
	"minecraft:wither":                { attack_damage_multiplier: 1.2, max_health_multiplier: 1.5 },
	"minecraft:elder_guardian":        { attack_damage_multiplier: 4.0, max_health_multiplier: 5.0 },
	"mowziesmobs:frostmaw":            { attack_damage_multiplier: 2.5, max_health_multiplier: 5.0 },
	"twilightforest:knight_phantom":   { attack_damage_multiplier: 12.0, max_health_multiplier: 8.0 },
	"bosses_of_mass_destruction:void_blossom": { attack_damage_multiplier: 1.6, max_health_multiplier: 3.0 },
	"bosses_of_mass_destruction:obsidilith":   { attack_damage_multiplier: 2.5, max_health_multiplier: 5.0 },
	"cataclysm:ender_golem":           { attack_damage_multiplier: 2.5, max_health_multiplier: 3.0 },
	"cataclysm:ender_guardian":        { attack_damage_multiplier: 1.8, max_health_multiplier: 2.5 },
	"twilightforest:alpha_yeti":       { attack_damage_multiplier: 100.0, max_health_multiplier: 7.0 },
	"cataclysm:draugr":                { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:elite_draugr":          { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:royal_draugr":          { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:aptrgangr":             { attack_damage_multiplier: 4.0,  max_health_multiplier: 5.0  },
	"cataclysm:maledictus":            { attack_damage_multiplier: 1.4,  max_health_multiplier: 4.0  },
	"cataclysm:netherite_monstrosity": { attack_damage_multiplier: 3.0,  max_health_multiplier: 3.0  },
	"mowziesmobs:umvuthi":             { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"mowziesmobs:umvuthana":           { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"mowziesmobs:umvuthana_raptor":    { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"mowziesmobs:umvuthana_crane":     { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"minecraft:warden":                { attack_damage_multiplier: 1.8, max_health_multiplier: 5.0 },
	"twilightforest:snow_queen":       { attack_damage_multiplier: 10.0, max_health_multiplier: 30.0 },
	"cataclysm:hippocamtus":           { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:symbiocto":             { attack_damage_multiplier: 10.0, max_health_multiplier: 20.0 },
	"cataclysm:drowned_host":          { attack_damage_multiplier: 10.0, max_health_multiplier: 20.0 },
	"cataclysm:cindaria":              { attack_damage_multiplier: 10.0, max_health_multiplier: 15.0 },
	"cataclysm:clawdian":              { attack_damage_multiplier: 8.0,  max_health_multiplier: 10.0  },
	"cataclysm:scylla":                { attack_damage_multiplier: 5.0,  max_health_multiplier: 3.0  },
	"cataclysm:scylla_ceraunus":       { attack_damage_multiplier: 2.0,  max_health_multiplier: 2.0  },
	"block_factorys_bosses:kraken":    { attack_damage_multiplier: 7.0,  max_health_multiplier: 10.0 },
	"mowziesmobs:bluff":               { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:deepling":              { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:deepling_brute":        { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:deepling_angler":       { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:deepling_priest":       { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:deepling_warlock":      { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:coral_golem":           { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:coralssus":             { attack_damage_multiplier: 10.0, max_health_multiplier: 10.0 },
	"cataclysm:the_leviathan":         { attack_damage_multiplier: 5.0,  max_health_multiplier: 4.0  },
	"cataclysm:ancient_remnant":       { attack_damage_multiplier: 5.0, max_health_multiplier: 10.0 },
	"cataclysm:the_harbinger":         { attack_damage_multiplier: 10.0, max_health_multiplier: 15.0 },
	"cataclysm:ignis":                 { attack_damage_multiplier: 5.0, max_health_multiplier: 50.0 },
	"deeperdarker:stalker":            { attack_damage_multiplier: 2.0, max_health_multiplier: 20.0 },
	"twilightforest:lich":             { attack_damage_multiplier: 3.0,  max_health_multiplier: 5.0  },
	"iceandfire:fire_dragon":          { attack_damage_multiplier: 1.5,  max_health_multiplier: 2.0  },
	"iceandfire:ice_dragon":           { attack_damage_multiplier: 1.5,  max_health_multiplier: 2.0  },
	"iceandfire:lightning_dragon":     { attack_damage_multiplier: 1.5,  max_health_multiplier: 2.0  }
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

const ENGAGE_RADIUS = 64;
const PER_PLAYER_HP = 0.2;   // +20% max HP per extra player
const PER_PLAYER_DMG = 0.08;  // +10% attack damage per extra player

EntityEvents.beforeHurt(event => {
	const boss = event.entity;
	if (!BOSS_BUFFS[boss.type]) return;
	if (boss.persistentData.getBoolean("besttechrpg:engaged")) return;

	const radiusSq = ENGAGE_RADIUS * ENGAGE_RADIUS;
	const players = boss.level.players.filter(p => boss.distanceToSqr(p) <= radiusSq);
	const extras = Math.max(0, players.length - 1);

	if (extras > 0) {
		var hpAttr = boss.getAttribute("minecraft:generic.max_health");
		if (hpAttr) {
			hpAttr.setBaseValue(hpAttr.baseValue * (1 + PER_PLAYER_HP * extras));
			boss.setHealth(boss.maxHealth);
		}
		var dmgAttr = boss.getAttribute("minecraft:generic.attack_damage");
		if (dmgAttr) {
			dmgAttr.setBaseValue(dmgAttr.baseValue * (1 + PER_PLAYER_DMG * extras));
		}
	}

	boss.persistentData.putBoolean("besttechrpg:engaged", true);
});
