// YamiRPG: auto-grant the next progression tier when all required bosses for the
// current tier have been killed. Fires on the LAST boss's death so the player gets
// their stage at the moment of victory, not when they alt-tab to the quest book.
//
// This is the only path that grants these stages — the FTB Quest checkmark for each
// tier no longer carries an `astages add` command. Item / XP / title rewards on the
// checkmark stay manual; the player still claims them via the quest book.
//
// TODO: add hidden admin/debug quests for manually granting any tier (and clearing
// the per-boss kill flags) to recover from progression bugs without /astages add.

const TIER_PROGRESSION = {
	tier_iron: {
		next: "tier_diamond",
		bosses: [
			"twilightforest:naga",
			"twilightforest:lich",
			"mowziesmobs:ferrous_wroughtnaut",
			"iceandfire:cyclops",
			"bosses_of_mass_destruction:gauntlet",
			"block_factorys_bosses:sandworm"
		]
	},
	tier_diamond: {
		next: "tier_netherite",
		bosses: [
			"minecraft:wither",
			"minecraft:elder_guardian",
			"twilightforest:minoshroom",
			"twilightforest:hydra",
			"mowziesmobs:frostmaw",
			"iceandfire:death_worm",
			"bosses_of_mass_destruction:lich",
			"block_factorys_bosses:yeti",
			"block_factorys_bosses:underworld_knight"
		]
	},
	tier_netherite: {
		next: "tier_allthemodium",
		bosses: [
			"cataclysm:ender_guardian",
			"cataclysm:ender_golem",
			"twilightforest:ur_ghast",
			"twilightforest:knight_phantom",
			"iceandfire:fire_dragon",
			"iceandfire:ice_dragon",
			"bosses_of_mass_destruction:void_blossom",
			"block_factorys_bosses:infernal_dragon"
		]
	},
	tier_allthemodium: {
		next: "tier_vibranium",
		bosses: [
			"cataclysm:maledictus",
			"twilightforest:alpha_yeti",
			"iceandfire:lightning_dragon",
			"bosses_of_mass_destruction:obsidilith",
			"mowziesmobs:umvuthi"
		]
	},
	tier_vibranium: {
		next: "tier_unobtanium_pearl",
		bosses: [
			"cataclysm:netherite_monstrosity",
			"cataclysm:the_leviathan",
			"cataclysm:scylla",
			"cataclysm:clawdian",
			"twilightforest:snow_queen",
			"mowziesmobs:sculptor"
		]
	},
	tier_unobtanium_bosses: {
		next: "tier_endgame",
		bosses: [
			"cataclysm:ancient_remnant",
			"cataclysm:the_harbinger",
			"cataclysm:ignis",
			"deeperdarker:stalker"
		]
	}
};

function flagKey(currentStage, bossId) {
	return `besttechrpg_${currentStage}_${bossId.replace(/[:/]/g, "_")}`;
}

EntityEvents.death(event => {
	const src = event.source;
	if (!src || !src.player) return;
	const player = src.player;
	const dyingType = String(event.entity.type);

	for (const currentStage in TIER_PROGRESSION) {
		const info = TIER_PROGRESSION[currentStage];
		if (info.bosses.indexOf(dyingType) < 0) continue;

		const data = player.persistentData;
		data.putBoolean(flagKey(currentStage, dyingType), true);

		const allKilled = info.bosses.every(b =>
			data.getBoolean(flagKey(currentStage, b))
		);
		if (!allKilled) continue;

		const grantedKey = `besttechrpg_${currentStage}_granted`;
		if (data.getBoolean(grantedKey)) continue;

		player.runCommandSilent(`astages add ${player.username} ${info.next}`);
		data.putBoolean(grantedKey, true);

		const nextLabel = info.next.substring(5).replace(/_/g, " ");
		player.tell(`§6[YamiRPG] §rAll ${currentStage.substring(5)} bosses defeated — §e${nextLabel}§r tier unlocked!`);
	}
});
