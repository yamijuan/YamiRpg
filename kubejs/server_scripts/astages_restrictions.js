// BestTechRpg: AStages restrictions registered via the AStages KubeJS API.
//
// Each restriction has:
//   - a unique ID (used internally and for /astages_simple remove)
//   - a stage name (the restriction is active until the player has that stage)
//   - one or more targets (mob/structure/item/etc.)
//
// Stage chain (granted by FTB Quest sentinels):
//   tier_start (login) -> tier_iron -> tier_diamond -> tier_netherite -> tier_allthemodium
//   -> tier_vibranium -> tier_unobtanium_pearl -> tier_unobtanium_ore -> tier_unobtanium_bosses
//   -> tier_endgame
//
// "permanent_disabled" is a stage no quest ever grants. Used to lock the 4 unused eyes forever.
//
// Schema reference: https://github.com/Alessandro-Casale/AStages/wiki

(function () {
	// ---------- register stages ----------
	// Stages must be registered (via customizeStage) before /astages add will accept them.
	[
		"tier_copper",
		"tier_iron",
		"tier_diamond",
		"tier_netherite",
		"tier_allthemodium",
		"tier_vibranium",
		"tier_unobtanium_pearl",
		"tier_unobtanium_ore",
		"tier_unobtanium_bosses",
		"tier_endgame",
		"permanent_disabled"
	].forEach(stage => {
		AStages.customizeStage(stage);
	});

	// ---------- helpers ----------

	function blockState(id) {
		const b = Block.getBlock(id);
		if (!b) {
			console.error(`[BestTechRpg] AStages: block not found: ${id}`);
			return null;
		}
		return b.defaultBlockState();
	}

	function gateMobs(prefix, stage, mobs) {
		// Lower-tier players can't damage or interact with the mob, but the mob still
		// spawns. Avoids the "structure-placed boss generates empty during low-tier
		// chunk-gen and never respawns" problem — the restriction is mob-bound, so it
		// also follows the boss if it leaves the structure.
		mobs.forEach((m, i) => {
			AStages.addRestrictionForMob(`${prefix}/mob_${i}`, stage, m)
				.setCanBeAttacked(false)
				.setCanBeRightClicked(false);
		});
	}

	function gateStructures(prefix, stage, structures) {
		structures.forEach((s, i) => {
			AStages.addRestrictionForStructure(`${prefix}/struct_${i}`, stage, s)
				.setCanAttackEntities(false)
				.setCanInteract(false)
				.setCanBlockBeBroken(false)
				.setCanBlockBePlaced(false);
		});
	}

	function gateDimension(id, stage, dimension) {
		AStages.addRestrictionForDimension(id, stage, dimension)
			.setBidirectional(true);
	}

	function gateOres(prefix, stage, oreReplacementPairs) {
		oreReplacementPairs.forEach(([oreId, replacementId], i) => {
			const orig = blockState(oreId);
			const repl = blockState(replacementId);
			if (!orig || !repl) return;
			AStages.addRestrictionForOre(`${prefix}/ore_${i}`, stage, orig, repl)
				.setStageAllBlockStates(true)
				.setAffectsPlayerActions(true);
		});
	}

	function gateItems(prefix, stage, items) {
		items.forEach((it, i) => {
			AStages.addRestrictionForItem(`${prefix}/item_${i}`, stage, it)
				.setCanBeStoredInInventory(false)
				.setCanBeStoredInContainers(false)
				.setCanBeEquipped(false)
				.setCanPickedUp(false)
				.setHideTooltip(true)
				.setRenderItemName(false)
				.setHideInJEI(true)
				.setCanBePlaced(false)
				.setCanItemBeLeftClicked(false)
				.setCanItemBeRightClicked(false)
				.setCanInteractWithBlock(false);
		});
	}

	function gateRecipes(prefix, stage, recipeTypeAndIdPairs) {
		recipeTypeAndIdPairs.forEach(([recipeType, recipeId], i) => {
			AStages.addRestrictionForRecipe(`${prefix}/recipe_${i}`, stage, recipeType, recipeId);
		});
	}

	function gateTags(prefix, stage, tags) {
		tags.forEach((tag, i) => {
			AStages.addRestrictionForTag(`${prefix}/tag_${i}`, stage, tag)
				.setCanBeStoredInInventory(false)
				.setCanBeStoredInContainers(false)
				.setCanBeEquipped(false)
				.setCanPickedUp(false)
				.setHideTooltip(true)
				.setRenderItemName(false)
				.setHideInJEI(true)
				.setCanBePlaced(false)
				.setCanItemBeLeftClicked(false)
				.setCanItemBeRightClicked(false)
				.setCanInteractWithBlock(false);
		});
	}

	// ---------- tier_iron ----------
	gateMobs("besttechrpg/iron", "tier_iron", [
		"twilightforest:naga",
		"twilightforest:lich",
		"mowziesmobs:ferrous_wroughtnaut",
		"iceandfire:cyclops",
		"bosses_of_mass_destruction:gauntlet",
		"block_factorys_bosses:sandworm"
	]);
	gateStructures("besttechrpg/iron", "tier_iron", [
		"twilightforest:naga_courtyard",
		"twilightforest:lich_tower",
		"bosses_of_mass_destruction:gauntlet_arena",
		"block_factorys_bosses:sandworm_nest"
	]);
	// Iron-tier materials (ingots / raw / blocks / nuggets) are NOT tag-gated. Copper
	// players can collect iron loot from ungated dungeons and stockpile it. Crafting it
	// into iron tools/armor is still blocked by the gateItems call below until tier_iron.
	// Mining iron ore directly is still blocked by the gateOres replacement (ore appears
	// as stone for copper players).
	gateDimension("besttechrpg/iron/tf", "tier_iron", "twilightforest:twilight_forest");
	gateOres("besttechrpg/iron", "tier_iron", [
		["minecraft:iron_ore",          "minecraft:stone"],
		["minecraft:deepslate_iron_ore","minecraft:deepslate"],
		["minecraft:gold_ore",          "minecraft:stone"],
		["minecraft:deepslate_gold_ore","minecraft:deepslate"],
		["minecraft:nether_gold_ore",   "minecraft:netherrack"],
		["minecraft:raw_iron_block",    "minecraft:stone"],
		["minecraft:raw_gold_block",    "minecraft:stone"]
	]);
	gateItems("besttechrpg/iron", "tier_iron", [
		"endrem:exotic_eye", "endrem:undead_eye",
		// Iron-tier tools and armor (vanilla)
		"minecraft:iron_helmet", "minecraft:iron_chestplate", "minecraft:iron_leggings", "minecraft:iron_boots",
		"minecraft:iron_pickaxe", "minecraft:iron_sword", "minecraft:iron_axe", "minecraft:iron_shovel", "minecraft:iron_hoe",
		"minecraft:golden_helmet", "minecraft:golden_chestplate", "minecraft:golden_leggings", "minecraft:golden_boots",
		"minecraft:golden_pickaxe", "minecraft:golden_sword", "minecraft:golden_axe", "minecraft:golden_shovel", "minecraft:golden_hoe",
		"minecraft:chainmail_helmet", "minecraft:chainmail_chestplate", "minecraft:chainmail_leggings", "minecraft:chainmail_boots",
		// Iron-tier utility items
		"minecraft:lava_bucket", "minecraft:powder_snow_bucket",
		"minecraft:iron_door", "minecraft:iron_bars", "minecraft:iron_trapdoor",
		"minecraft:shears", "minecraft:flint_and_steel", "minecraft:shield", "minecraft:bell",
		"minecraft:anvil", "minecraft:chipped_anvil", "minecraft:damaged_anvil", "minecraft:cauldron",
		"minecraft:compass", "minecraft:hopper",
		// Enchanting unlocks at iron: table + TF canopy bookshelves (15 maxEterna)
		"minecraft:enchanting_table",
		"twilightforest:canopy_bookshelf", "twilightforest:chiseled_canopy_bookshelf",
		// Iron-tier boss drops (uncraftable, must come from killing the gated boss)
		// TF naga
		"twilightforest:naga_scale", "twilightforest:naga_trophy",
		// TF lich (scepters + trophy)
		"twilightforest:twilight_scepter", "twilightforest:lifedrain_scepter",
		"twilightforest:zombie_scepter", "twilightforest:fortification_scepter",
		"twilightforest:lich_trophy",
		// Mowzies ferrous wroughtnaut
		"mowziesmobs:wrought_helmet", "mowziesmobs:wrought_axe",
		// IaF cyclops
		"iceandfire:cyclops_eye", "iceandfire:cyclops_skull",
		// BlockFactory sandworm
		"block_factorys_bosses:sandworm_gauntlet"
	]);
	gateRecipes("besttechrpg/iron", "tier_iron", [
		["minecraft:crafting", "endrem:exotic_eye"],
		["minecraft:crafting", "endrem:undead_eye"],
		// Iron tools / armor (vanilla)
		["minecraft:crafting", "minecraft:iron_helmet"], ["minecraft:crafting", "minecraft:iron_chestplate"],
		["minecraft:crafting", "minecraft:iron_leggings"], ["minecraft:crafting", "minecraft:iron_boots"],
		["minecraft:crafting", "minecraft:iron_pickaxe"], ["minecraft:crafting", "minecraft:iron_sword"],
		["minecraft:crafting", "minecraft:iron_axe"], ["minecraft:crafting", "minecraft:iron_shovel"],
		["minecraft:crafting", "minecraft:iron_hoe"],
		// Gold tools / armor
		["minecraft:crafting", "minecraft:golden_helmet"], ["minecraft:crafting", "minecraft:golden_chestplate"],
		["minecraft:crafting", "minecraft:golden_leggings"], ["minecraft:crafting", "minecraft:golden_boots"],
		["minecraft:crafting", "minecraft:golden_pickaxe"], ["minecraft:crafting", "minecraft:golden_sword"],
		["minecraft:crafting", "minecraft:golden_axe"], ["minecraft:crafting", "minecraft:golden_shovel"],
		["minecraft:crafting", "minecraft:golden_hoe"],
		// Iron utility
		["minecraft:crafting", "minecraft:iron_door"], ["minecraft:crafting", "minecraft:iron_bars"],
		["minecraft:crafting", "minecraft:iron_trapdoor"],
		["minecraft:crafting", "minecraft:shears"], ["minecraft:crafting", "minecraft:flint_and_steel"],
		["minecraft:crafting", "minecraft:shield"],
		["minecraft:crafting", "minecraft:anvil"], ["minecraft:crafting", "minecraft:cauldron"],
		["minecraft:crafting", "minecraft:compass"], ["minecraft:crafting", "minecraft:hopper"],
		// Iron-tier enchanting
		["minecraft:crafting", "minecraft:enchanting_table"],
		["minecraft:crafting", "twilightforest:canopy_bookshelf"],
		["minecraft:crafting", "twilightforest:chiseled_canopy_bookshelf"]
	]);

	// ---------- tiered per-enchant level caps ----------
	// Three restrictions per enchant create a ramp as the player progresses:
	//   pre-diamond (copper/iron):        cap = floor(vanilla / 2), min 1
	//   diamond  (lifts at tier_netherite):    cap = vanilla
	//   netherite (lifts at tier_allthemodium): cap = vanilla + floor((modded - vanilla) / 2)
	//   atm+:                              no cap (modded max usable)
	//
	// Apothic Enchanting raises max levels (e.g. sharpness 5 → 9). The 3rd column below is
	// the modded max from config/apotheosis/enchantments.cfg. Restrictions at or above
	// modded max are skipped (no-op).
	//
	// AStages.addRestrictionForEnchant(id, stage, ench, comparator, level) — the restriction
	// LIFTS at `stage` and uses comparator "great" (level > N → restricted).
	//
	// In MC 1.21 enchantments are a data-driven registry, NOT bound when server_scripts
	// load. Registering at script-load time throws "Can't interpret 'minecraft:protection'
	// as 'minecraft:enchantment': registry not found". We defer to ServerEvents.loaded,
	// which fires after the enchantment registry is bound.
	const __enchantCaps = [
		// [id, vanillaMax, moddedMax]
		["minecraft:protection",            4,  8],
		["minecraft:fire_protection",       4,  9],
		["minecraft:feather_falling",       4, 11],
		["minecraft:blast_protection",      4,  9],
		["minecraft:projectile_protection", 4, 11],
		["minecraft:respiration",           3,  7],
		["minecraft:thorns",                3,  5],
		["minecraft:depth_strider",         3,  7],
		["minecraft:frost_walker",          2,  7],
		["minecraft:soul_speed",            3,  7],
		["minecraft:swift_sneak",           3,  5],
		["minecraft:sharpness",             5,  9],
		["minecraft:smite",                 5, 10],
		["minecraft:bane_of_arthropods",    5, 10],
		["minecraft:knockback",             2,  5],
		["minecraft:fire_aspect",           2,  5],
		["minecraft:looting",               3,  8],
		["minecraft:sweeping_edge",         3,  8],
		["minecraft:efficiency",            5,  9],
		["minecraft:unbreaking",            3,  8],
		["minecraft:fortune",               3,  8],
		["minecraft:power",                 5,  9],
		["minecraft:punch",                 2,  5],
		["minecraft:luck_of_the_sea",       3,  8],
		["minecraft:lure",                  3,  8],
		["minecraft:loyalty",               3,  9],
		["minecraft:impaling",              5, 10],
		["minecraft:riptide",               3,  9],
		["minecraft:quick_charge",          3,  5],
		["minecraft:piercing",              4,  8],
		["minecraft:density",               5, 10],
		["minecraft:breach",                4,  8],
		["minecraft:wind_burst",            3,  8]
	];

	function rampForEnchant(vanillaMax, moddedMax) {
		const ironCap      = Math.max(1, Math.floor(vanillaMax / 2));
		const netheriteCap = vanillaMax + Math.floor((moddedMax - vanillaMax) / 2);
		return [
			{ stage: "tier_diamond",      cap: ironCap      },
			{ stage: "tier_netherite",    cap: vanillaMax   },
			{ stage: "tier_allthemodium", cap: netheriteCap }
		].filter(s => s.cap < moddedMax); // skip no-op caps at/above modded max
	}

	let __enchantCapsRegistered = false;
	ServerEvents.loaded(e => {
		if (__enchantCapsRegistered) return;
		__enchantCapsRegistered = true;
		let registered = 0;
		__enchantCaps.forEach(([ench, vanillaMax, moddedMax], i) => {
			rampForEnchant(vanillaMax, moddedMax).forEach((step, j) => {
				try {
					AStages.addRestrictionForEnchant(
						`besttechrpg/ench/${i}_${j}`,
						step.stage, ench, "great", step.cap
					);
					registered++;
				} catch (err) {
					console.warn(`[YamiRPG] enchant cap registration failed for ${ench} @ ${step.stage}: ${err}`);
				}
			});
		});
		console.info(`[YamiRPG] Registered ${registered} tiered enchant caps across ${__enchantCaps.length} enchants.`);
	});

	// ---------- tier_diamond ----------
	gateMobs("besttechrpg/diamond", "tier_diamond", [
		"minecraft:wither",
		"minecraft:elder_guardian",
		"twilightforest:minoshroom",
		"twilightforest:hydra",
		"mowziesmobs:frostmaw",
		"iceandfire:death_worm",
		"bosses_of_mass_destruction:lich",
		"block_factorys_bosses:yeti",
		"block_factorys_bosses:underworld_knight"
	]);
	gateStructures("besttechrpg/diamond", "tier_diamond", [
		"twilightforest:labyrinth",
		"twilightforest:hydra_lair",
		"bosses_of_mass_destruction:lich_tower",
		"block_factorys_bosses:yeti_hideout",
		"block_factorys_bosses:underworld_arena",
		// When Dungeons Arise, diamond-tier loot (verified: chests contain diamond gear, no netherite)
		"dungeons_arise:bandit_towers",
		"dungeons_arise:infested_temple",
		"dungeons_arise:mushroom_village",
		"dungeons_arise:plague_asylum",
		"dungeons_arise:mining_complex",
		"dungeons_arise:mining_system",
		"dungeons_arise:mushroom_mines",
		"dungeons_arise:illager_fort",
		"dungeons_arise:illager_windmill",
		"dungeons_arise:ceryneian_hind",
		"dungeons_arise:heavenly_rider",
		// Seven Seas, diamond-tier ships
		"dungeons_arise_seven_seas:pirate_junk",
		"dungeons_arise_seven_seas:unicorn_galleon",
		"dungeons_arise_seven_seas:victory_frigate"
	]);
	gateTags("besttechrpg/diamond/mat", "tier_diamond", [
		"c:gems/diamond", "c:gems/emerald",
		"c:storage_blocks/diamond", "c:storage_blocks/emerald"
	]);
	gateOres("besttechrpg/diamond", "tier_diamond", [
		["minecraft:diamond_ore",          "minecraft:stone"],
		["minecraft:deepslate_diamond_ore","minecraft:deepslate"],
		["minecraft:redstone_ore",         "minecraft:stone"],
		["minecraft:deepslate_redstone_ore","minecraft:deepslate"],
		["minecraft:emerald_ore",          "minecraft:stone"],
		["minecraft:deepslate_emerald_ore","minecraft:deepslate"],
		["minecraft:lapis_ore",            "minecraft:stone"],
		["minecraft:deepslate_lapis_ore",  "minecraft:deepslate"]
	]);
	gateItems("besttechrpg/diamond", "tier_diamond", [
		"endrem:rogue_eye", "endrem:lost_eye",
		// Diamond-tier tools and armor
		"minecraft:diamond_helmet", "minecraft:diamond_chestplate", "minecraft:diamond_leggings", "minecraft:diamond_boots",
		"minecraft:diamond_pickaxe", "minecraft:diamond_sword", "minecraft:diamond_axe", "minecraft:diamond_shovel", "minecraft:diamond_hoe",
		"minecraft:trident",
		// Diamond-tier utility (enchanting_table available earlier; golden apples ungated)
		"minecraft:beacon", "minecraft:ender_chest",
		// Aquaculture Neptunium armor gated to diamond
		"aquaculture:neptunium_helmet", "aquaculture:neptunium_chestplate",
		"aquaculture:neptunium_leggings", "aquaculture:neptunium_boots",
		"aquaculture:neptunium_sword", "aquaculture:neptunium_axe",
		"aquaculture:neptunium_bow",
		// ATM nether-source bookshelves (maxEterna 30). ancient_bookshelf is The-Other-only, gated at ATM
		"allthemodium:demonic_bookshelf", "allthemodium:soul_bookshelf",
		// Diamond-tier boss drops (uncraftable, must come from killing the gated boss)
		// TF minoshroom
		"twilightforest:minoshroom_trophy", "twilightforest:diamond_minotaur_axe",
		// TF hydra (fiery_blood is the unique drop; hydra_chop is food)
		"twilightforest:hydra_chop", "twilightforest:fiery_blood", "twilightforest:hydra_trophy",
		// Mowzies frostmaw
		"mowziesmobs:ice_crystal", "mowziesmobs:music_disc_petiole",
		// IaF death_worm — chitin, gauntlets, eggs, full armor sets (red/white/yellow), tongue
		"iceandfire:deathworm_chitin_red", "iceandfire:deathworm_chitin_white", "iceandfire:deathworm_chitin_yellow",
		"iceandfire:deathworm_egg", "iceandfire:deathworm_egg_giant",
		"iceandfire:deathworm_gauntlet_red", "iceandfire:deathworm_gauntlet_white", "iceandfire:deathworm_gauntlet_yellow",
		"iceandfire:deathworm_red_helmet", "iceandfire:deathworm_red_chestplate", "iceandfire:deathworm_red_leggings", "iceandfire:deathworm_red_boots",
		"iceandfire:deathworm_white_helmet", "iceandfire:deathworm_white_chestplate", "iceandfire:deathworm_white_leggings", "iceandfire:deathworm_white_boots",
		"iceandfire:deathworm_yellow_helmet", "iceandfire:deathworm_yellow_chestplate", "iceandfire:deathworm_yellow_leggings", "iceandfire:deathworm_yellow_boots",
		"iceandfire:deathworm_tounge",
		// BOMD lich
		"bosses_of_mass_destruction:soul_star", "bosses_of_mass_destruction:obsidian_heart",
		// BlockFactory yeti + underworld_knight
		"block_factorys_bosses:ice_gauntlet",
		"block_factorys_bosses:knight_sword"
	]);
	gateRecipes("besttechrpg/diamond", "tier_diamond", [
		["minecraft:crafting", "endrem:rogue_eye"],
		["minecraft:crafting", "endrem:lost_eye"],
		// Diamond tools / armor
		["minecraft:crafting", "minecraft:diamond_helmet"], ["minecraft:crafting", "minecraft:diamond_chestplate"],
		["minecraft:crafting", "minecraft:diamond_leggings"], ["minecraft:crafting", "minecraft:diamond_boots"],
		["minecraft:crafting", "minecraft:diamond_pickaxe"], ["minecraft:crafting", "minecraft:diamond_sword"],
		["minecraft:crafting", "minecraft:diamond_axe"], ["minecraft:crafting", "minecraft:diamond_shovel"],
		["minecraft:crafting", "minecraft:diamond_hoe"],
		// Diamond utility
		["minecraft:crafting", "minecraft:beacon"], ["minecraft:crafting", "minecraft:ender_chest"],
		// Aquaculture Neptunium gear
		["minecraft:crafting", "aquaculture:neptunium_helmet"], ["minecraft:crafting", "aquaculture:neptunium_chestplate"],
		["minecraft:crafting", "aquaculture:neptunium_leggings"], ["minecraft:crafting", "aquaculture:neptunium_boots"],
		["minecraft:crafting", "aquaculture:neptunium_sword"], ["minecraft:crafting", "aquaculture:neptunium_axe"],
		["minecraft:crafting", "aquaculture:neptunium_bow"],
		// ATM nether-source bookshelves
		["minecraft:crafting", "allthemodium:demonic_bookshelf"],
		["minecraft:crafting", "allthemodium:soul_bookshelf"]
	]);

	// ---------- tier_netherite ----------
	gateMobs("besttechrpg/netherite", "tier_netherite", [
		"cataclysm:ender_guardian",
		"cataclysm:ender_golem",
		"twilightforest:ur_ghast",
		"twilightforest:knight_phantom",
		"iceandfire:fire_dragon",
		"iceandfire:ice_dragon",
		"bosses_of_mass_destruction:void_blossom",
		"block_factorys_bosses:infernal_dragon"
	]);
	gateStructures("besttechrpg/netherite", "tier_netherite", [
		"cataclysm:ruined_citadel",
		"twilightforest:dark_tower",
		"twilightforest:knight_stronghold",
		"block_factorys_bosses:dragon_tower",
		// When Dungeons Arise, netherite-tier loot (verified: chests contain netherite armor/scraps)
		"dungeons_arise:shiraz_palace",
		"dungeons_arise:scorched_mines",
		"dungeons_arise:kisegi_sanctuary",
		"dungeons_arise:aviary",
		"dungeons_arise:mechanical_nest",
		"dungeons_arise:keep_kayra",
		"dungeons_arise:foundry",
		"dungeons_arise:heavenly_challenger",
		"dungeons_arise:heavenly_conqueror"
	]);
	gateTags("besttechrpg/netherite/mat", "tier_netherite", [
		"c:ingots/netherite", "c:storage_blocks/netherite",
		"c:scraps/netherite",
		// Uranium intentionally ungated (tech-mod material, balanced by Mekanism/Powah recipe progression)
		"c:ingots/osmium", "c:ingots/platinum", "c:ingots/zinc",
		"c:storage_blocks/osmium", "c:storage_blocks/platinum", "c:storage_blocks/zinc",
		"c:raw_materials/osmium", "c:raw_materials/platinum", "c:raw_materials/zinc"
	]);
	gateDimension("besttechrpg/netherite/undergarden", "tier_netherite", "undergarden:undergarden");
	gateOres("besttechrpg/netherite", "tier_netherite", [
		["minecraft:ancient_debris",   "minecraft:netherrack"],
		["minecraft:nether_quartz_ore","minecraft:netherrack"]
	]);
	gateItems("besttechrpg/netherite", "tier_netherite", [
		"endrem:nether_eye", "endrem:wither_eye",
		// Netherite-tier tools and armor
		"minecraft:netherite_helmet", "minecraft:netherite_chestplate", "minecraft:netherite_leggings", "minecraft:netherite_boots",
		"minecraft:netherite_pickaxe", "minecraft:netherite_sword", "minecraft:netherite_axe", "minecraft:netherite_shovel", "minecraft:netherite_hoe",
		// Netherite-tier utility
		"minecraft:netherite_block", "minecraft:respawn_anchor",
		// Vanilla + Quark bookshelves (maxEterna 15) unlock at netherite
		"minecraft:bookshelf",
		"quark:acacia_bookshelf", "quark:ancient_bookshelf", "quark:azalea_bookshelf",
		"quark:bamboo_bookshelf", "quark:birch_bookshelf", "quark:blossom_bookshelf",
		"quark:cherry_bookshelf", "quark:crimson_bookshelf", "quark:dark_oak_bookshelf",
		"quark:jungle_bookshelf", "quark:mangrove_bookshelf", "quark:spruce_bookshelf",
		"quark:warped_bookshelf",
		// Base Apothic hellshelf + seashelf (maxEterna 45). Moved from ATM tier
		"apothic_enchanting:hellshelf", "apothic_enchanting:seashelf",
		// Netherite-tier boss drops (uncraftable, must come from killing the gated boss)
		// Cataclysm ender_guardian + ender_golem
		"cataclysm:gauntlet_of_guard", "cataclysm:void_core",
		// TF ur_ghast
		"twilightforest:carminite", "twilightforest:fiery_tears", "twilightforest:ur_ghast_trophy",
		// TF knight_phantom (knightmetal weapons + phantom armor pieces)
		"twilightforest:knightmetal_sword", "twilightforest:knightmetal_pickaxe", "twilightforest:knightmetal_axe",
		"twilightforest:phantom_helmet", "twilightforest:phantom_chestplate",
		"twilightforest:knight_phantom_trophy",
		// IaF fire dragon (red/bronze/gray/green scales, fire skull, dragonsteel-fire family)
		"iceandfire:dragonscale_red", "iceandfire:dragonscale_bronze", "iceandfire:dragonscale_gray", "iceandfire:dragonscale_green",
		"iceandfire:dragonscales_red", "iceandfire:dragonscales_bronze", "iceandfire:dragonscales_gray", "iceandfire:dragonscales_green",
		"iceandfire:dragon_skull_fire",
		"iceandfire:dragonsteel_fire_ingot", "iceandfire:dragonsteel_fire_block",
		"iceandfire:dragonsteel_fire_helmet", "iceandfire:dragonsteel_fire_chestplate", "iceandfire:dragonsteel_fire_leggings", "iceandfire:dragonsteel_fire_boots",
		"iceandfire:dragonsteel_fire_pickaxe", "iceandfire:dragonsteel_fire_sword", "iceandfire:dragonsteel_fire_axe", "iceandfire:dragonsteel_fire_shovel", "iceandfire:dragonsteel_fire_hoe",
		"iceandfire:dragonbone_sword_fire",
		// IaF ice dragon (silver/blue/white/sapphire scales, ice skull, dragonsteel-ice family)
		"iceandfire:dragonscale_silver", "iceandfire:dragonscale_blue", "iceandfire:dragonscale_white", "iceandfire:dragonscale_sapphire",
		"iceandfire:dragonscales_silver", "iceandfire:dragonscales_blue", "iceandfire:dragonscales_white", "iceandfire:dragonscales_sapphire",
		"iceandfire:dragon_skull_ice",
		"iceandfire:dragonsteel_ice_ingot", "iceandfire:dragonsteel_ice_block",
		"iceandfire:dragonsteel_ice_helmet", "iceandfire:dragonsteel_ice_chestplate", "iceandfire:dragonsteel_ice_leggings", "iceandfire:dragonsteel_ice_boots",
		"iceandfire:dragonsteel_ice_pickaxe", "iceandfire:dragonsteel_ice_sword", "iceandfire:dragonsteel_ice_axe", "iceandfire:dragonsteel_ice_shovel", "iceandfire:dragonsteel_ice_hoe",
		"iceandfire:dragonbone_sword_ice",
		// IaF dragonbone base + tools (drop from any dragon kill — both fire and ice are netherite tier)
		"iceandfire:dragonbone", "iceandfire:dragonbone_arrow",
		"iceandfire:dragonbone_pickaxe", "iceandfire:dragonbone_sword", "iceandfire:dragonbone_axe", "iceandfire:dragonbone_shovel", "iceandfire:dragonbone_hoe", "iceandfire:dragonbone_bow",
		// BOMD void_blossom
		"bosses_of_mass_destruction:void_thorn", "bosses_of_mass_destruction:crystal_fruit", "bosses_of_mass_destruction:void_lily",
		// BlockFactory infernal_dragon
		"block_factorys_bosses:dragon_bone", "block_factorys_bosses:dragon_skull"
	]);
	gateRecipes("besttechrpg/netherite", "tier_netherite", [
		["minecraft:crafting", "endrem:nether_eye"],
		["minecraft:crafting", "endrem:wither_eye"],
		// Netherite gear is upgraded via smithing template (recipe type "minecraft:smithing_transform")
		// — items are item-gated above, but we don't gate the smithing recipe IDs here because
		// they vary across NeoForge versions and the diamond pre-gear is already tier_diamond-gated.
		// Netherite-tier crafting (block + utility)
		["minecraft:crafting", "minecraft:netherite_block"],
		["minecraft:crafting", "minecraft:respawn_anchor"],
		// Vanilla + Quark bookshelves (maxEterna 15)
		["minecraft:crafting", "minecraft:bookshelf"],
		["minecraft:crafting", "quark:acacia_bookshelf"], ["minecraft:crafting", "quark:ancient_bookshelf"],
		["minecraft:crafting", "quark:azalea_bookshelf"], ["minecraft:crafting", "quark:bamboo_bookshelf"],
		["minecraft:crafting", "quark:birch_bookshelf"], ["minecraft:crafting", "quark:blossom_bookshelf"],
		["minecraft:crafting", "quark:cherry_bookshelf"], ["minecraft:crafting", "quark:crimson_bookshelf"],
		["minecraft:crafting", "quark:dark_oak_bookshelf"], ["minecraft:crafting", "quark:jungle_bookshelf"],
		["minecraft:crafting", "quark:mangrove_bookshelf"], ["minecraft:crafting", "quark:spruce_bookshelf"],
		["minecraft:crafting", "quark:warped_bookshelf"],
		// Apothic base shelves
		["minecraft:crafting", "apothic_enchanting:hellshelf"],
		["minecraft:crafting", "apothic_enchanting:seashelf"]
	]);

	// ---------- tier_allthemodium ----------
	gateMobs("besttechrpg/atm", "tier_allthemodium", [
		"cataclysm:maledictus",
		"twilightforest:alpha_yeti",
		"iceandfire:lightning_dragon",
		"bosses_of_mass_destruction:obsidilith",
		"mowziesmobs:umvuthi"
	]);
	gateStructures("besttechrpg/atm", "tier_allthemodium", [
		"cataclysm:frosted_prison",
		"bosses_of_mass_destruction:obsidilith_arena",
		"twilightforest:yeti_cave"
	]);
	// ATM ore is restricted via ATM's natural placement (only generates in The Other dim,
	// which is itself only practically accessible after netherite gear); stage-gating via
	// recipe + item restrictions further blocks pre-tier mining of any spawned blocks.
	gateOres("besttechrpg/atm", "tier_allthemodium", [
		["allthemodium:allthemodium_ore",        "minecraft:stone"],
		["allthemodium:end_allthemodium_ore",    "minecraft:end_stone"],
		["allthemodium:nether_allthemodium_ore", "minecraft:netherrack"]
	]);
	gateItems("besttechrpg/atm", "tier_allthemodium", [
		"endrem:cold_eye", "endrem:guardian_eye",
		// AllTheModium tier materials, tools, and armor
		"allthemodium:allthemodium_ingot", "allthemodium:raw_allthemodium",
		"allthemodium:allthemodium_block", "allthemodium:raw_allthemodium_block",
		"allthemodium:allthemodium_helmet", "allthemodium:allthemodium_chestplate",
		"allthemodium:allthemodium_leggings", "allthemodium:allthemodium_boots",
		"allthemodium:allthemodium_pickaxe", "allthemodium:allthemodium_sword",
		"allthemodium:allthemodium_axe", "allthemodium:allthemodium_shovel", "allthemodium:allthemodium_hoe",
		// ATM food (high regen/saturation): gated until ATM tier
		"allthemodium:allthemodium_apple", "allthemodium:allthemodium_carrot",
		// ATM ancient_bookshelf: only Ancient wood from The Other dim, naturally gated here
		"allthemodium:ancient_bookshelf",
		// Cataclysm boss-drop materials (ingots, blocks, nuggets) - all gated until ATM tier
		"cataclysm:ancient_metal_ingot", "cataclysm:ancient_metal_nugget", "cataclysm:ancient_metal_block",
		"cataclysm:ignitium_ingot", "cataclysm:ignitium_block",
		"cataclysm:cursium_ingot", "cataclysm:cursium_block",
		"cataclysm:black_steel_ingot", "cataclysm:black_steel_nugget", "cataclysm:black_steel_block",
		"cataclysm:witherite_ingot", "cataclysm:witherite_block",
		// Apothic upgraded hellshelf/seashelf variants (maxEterna 60-65). Base hellshelf+seashelf moved to netherite
		"apothic_enchanting:blazing_hellshelf",
		"apothic_enchanting:glowing_hellshelf", "apothic_enchanting:infused_hellshelf",
		"apothic_enchanting:crystal_seashelf",
		"apothic_enchanting:heart_seashelf", "apothic_enchanting:infused_seashelf",
		"apothic_enchanting:beeshelf", "apothic_enchanting:melonshelf",
		"apothic_enchanting:stoneshelf", "apothic_enchanting:treasure_shelf",
		"apothic_enchanting:geode_shelf",
		"apothic_enchanting:sightshelf",
		// ATM-tier boss drops (uncraftable, must come from killing the gated boss)
		// Cataclysm maledictus (cursium_ingot already in this list above)
		"cataclysm:music_disc_maledictus",
		// TF alpha_yeti
		"twilightforest:alpha_yeti_fur", "twilightforest:ice_bomb", "twilightforest:alpha_yeti_trophy",
		// IaF lightning_dragon (electric/amethyst scales, lightning skull, dragonsteel-lightning family)
		"iceandfire:dragonscale_electric", "iceandfire:dragonscale_amethyst",
		"iceandfire:dragonscales_electric", "iceandfire:dragonscales_amethyst",
		"iceandfire:dragon_skull_lightning",
		"iceandfire:dragonsteel_lightning_ingot", "iceandfire:dragonsteel_lightning_block",
		"iceandfire:dragonsteel_lightning_helmet", "iceandfire:dragonsteel_lightning_chestplate", "iceandfire:dragonsteel_lightning_leggings", "iceandfire:dragonsteel_lightning_boots",
		"iceandfire:dragonsteel_lightning_pickaxe", "iceandfire:dragonsteel_lightning_sword", "iceandfire:dragonsteel_lightning_axe", "iceandfire:dragonsteel_lightning_shovel", "iceandfire:dragonsteel_lightning_hoe",
		"iceandfire:dragonbone_sword_lightning",
		// BOMD obsidilith
		"bosses_of_mass_destruction:ancient_anima",
		// Mowzies umvuthi
		"mowziesmobs:sol_visage"
	]);
	gateRecipes("besttechrpg/atm", "tier_allthemodium", [
		["minecraft:crafting", "endrem:cold_eye"],
		["minecraft:crafting", "endrem:guardian_eye"],
		// Allthemodium gear + blocks
		["minecraft:crafting", "allthemodium:allthemodium_helmet"], ["minecraft:crafting", "allthemodium:allthemodium_chestplate"],
		["minecraft:crafting", "allthemodium:allthemodium_leggings"], ["minecraft:crafting", "allthemodium:allthemodium_boots"],
		["minecraft:crafting", "allthemodium:allthemodium_pickaxe"], ["minecraft:crafting", "allthemodium:allthemodium_sword"],
		["minecraft:crafting", "allthemodium:allthemodium_axe"], ["minecraft:crafting", "allthemodium:allthemodium_shovel"],
		["minecraft:crafting", "allthemodium:allthemodium_hoe"],
		["minecraft:crafting", "allthemodium:allthemodium_block"], ["minecraft:crafting", "allthemodium:raw_allthemodium_block"],
		["minecraft:crafting", "allthemodium:ancient_bookshelf"],
		// Apothic upgraded shelves
		["minecraft:crafting", "apothic_enchanting:blazing_hellshelf"],
		["minecraft:crafting", "apothic_enchanting:glowing_hellshelf"],
		["minecraft:crafting", "apothic_enchanting:infused_hellshelf"],
		["minecraft:crafting", "apothic_enchanting:crystal_seashelf"],
		["minecraft:crafting", "apothic_enchanting:heart_seashelf"],
		["minecraft:crafting", "apothic_enchanting:infused_seashelf"],
		["minecraft:crafting", "apothic_enchanting:beeshelf"],
		["minecraft:crafting", "apothic_enchanting:melonshelf"],
		["minecraft:crafting", "apothic_enchanting:stoneshelf"],
		["minecraft:crafting", "apothic_enchanting:treasure_shelf"],
		["minecraft:crafting", "apothic_enchanting:geode_shelf"],
		["minecraft:crafting", "apothic_enchanting:sightshelf"]
	]);

	// ---------- tier_vibranium ----------
	gateMobs("besttechrpg/vibranium", "tier_vibranium", [
		"cataclysm:netherite_monstrosity",
		"cataclysm:the_leviathan",
		"cataclysm:scylla",
		"cataclysm:clawdian",
		"twilightforest:snow_queen",
		"mowziesmobs:sculptor"
	]);
	gateStructures("besttechrpg/vibranium", "tier_vibranium", [
		"cataclysm:soul_black_smith",
		"cataclysm:sunken_city",
		"twilightforest:aurora_palace"
	]);
	gateDimension("besttechrpg/vibranium/dnd", "tier_vibranium", "deeperdarker:otherside");
	gateOres("besttechrpg/vibranium", "tier_vibranium", [
		["allthemodium:vibranium_ore",        "minecraft:stone"],
		["allthemodium:end_vibranium_ore",    "minecraft:end_stone"],
		["allthemodium:nether_vibranium_ore", "minecraft:netherrack"]
	]);
	gateItems("besttechrpg/vibranium", "tier_vibranium", [
		"endrem:cursed_eye", "endrem:corrupted_eye",
		// Vibranium tier materials, tools, and armor
		"allthemodium:vibranium_ingot", "allthemodium:raw_vibranium",
		"allthemodium:vibranium_block", "allthemodium:raw_vibranium_block",
		"allthemodium:vibranium_helmet", "allthemodium:vibranium_chestplate",
		"allthemodium:vibranium_leggings", "allthemodium:vibranium_boots",
		"allthemodium:vibranium_pickaxe", "allthemodium:vibranium_sword",
		"allthemodium:vibranium_axe", "allthemodium:vibranium_shovel", "allthemodium:vibranium_hoe",
		// Apothic Enchanting mid-tier shelves: unlock at vibranium (cap ~level 70)
		"apothic_enchanting:deepshelf", "apothic_enchanting:dormant_deepshelf",
		"apothic_enchanting:echoing_deepshelf", "apothic_enchanting:soul_touched_deepshelf",
		"apothic_enchanting:filtering_shelf",
		// Vibranium-tier boss drops (uncraftable, must come from killing the gated boss)
		// Cataclysm netherite_monstrosity
		"cataclysm:infernal_forge", "cataclysm:monstrous_horn", "cataclysm:lava_power_cell",
		"cataclysm:music_disc_netherite_monstrosity",
		// Cataclysm leviathan
		"cataclysm:tidal_claws", "cataclysm:abyssal_egg", "cataclysm:music_disc_the_leviathan",
		// Cataclysm scylla
		"cataclysm:lacrima", "cataclysm:essence_of_the_storm", "cataclysm:music_disc_scylla",
		// Cataclysm clawdian
		"cataclysm:chitin_claw",
		// TF snow_queen
		"twilightforest:triple_bow", "twilightforest:seeker_bow", "twilightforest:snow_queen_trophy",
		// Mowzies sculptor (geomancer set + staff)
		"mowziesmobs:sculptor_staff", "mowziesmobs:geomancer_beads", "mowziesmobs:geomancer_robe",
		"mowziesmobs:geomancer_belt", "mowziesmobs:geomancer_sandals"
	]);
	gateRecipes("besttechrpg/vibranium", "tier_vibranium", [
		["minecraft:crafting", "endrem:cursed_eye"],
		["minecraft:crafting", "endrem:corrupted_eye"],
		// Vibranium gear + blocks
		["minecraft:crafting", "allthemodium:vibranium_helmet"], ["minecraft:crafting", "allthemodium:vibranium_chestplate"],
		["minecraft:crafting", "allthemodium:vibranium_leggings"], ["minecraft:crafting", "allthemodium:vibranium_boots"],
		["minecraft:crafting", "allthemodium:vibranium_pickaxe"], ["minecraft:crafting", "allthemodium:vibranium_sword"],
		["minecraft:crafting", "allthemodium:vibranium_axe"], ["minecraft:crafting", "allthemodium:vibranium_shovel"],
		["minecraft:crafting", "allthemodium:vibranium_hoe"],
		["minecraft:crafting", "allthemodium:vibranium_block"], ["minecraft:crafting", "allthemodium:raw_vibranium_block"],
		// Apothic deep shelves
		["minecraft:crafting", "apothic_enchanting:deepshelf"],
		["minecraft:crafting", "apothic_enchanting:dormant_deepshelf"],
		["minecraft:crafting", "apothic_enchanting:echoing_deepshelf"],
		["minecraft:crafting", "apothic_enchanting:soul_touched_deepshelf"],
		["minecraft:crafting", "apothic_enchanting:filtering_shelf"]
	]);

	// ---------- tier_unobtanium_pearl ----------
	// No explicit AStages restriction needed: the ultimate pearl recipe requires vibranium_ingot
	// + nether_star + netherite_ingot. Vibranium is gated until tier_vibranium, and the FTB Quest
	// vibranium-chapter sentinel grants tier_unobtanium_pearl simultaneously. Natural ingredient
	// progression is the gate.

	// ---------- tier_unobtanium_ore ----------
	gateOres("besttechrpg/unob_ore", "tier_unobtanium_ore", [
		["allthemodium:unobtainium_ore",        "minecraft:stone"],
		["allthemodium:end_unobtainium_ore",    "minecraft:end_stone"],
		["allthemodium:nether_unobtainium_ore", "minecraft:netherrack"]
	]);
	gateItems("besttechrpg/unob_ore", "tier_unobtanium_ore", [
		"allthemodium:unobtainium_ingot",
		"allthemodium:raw_unobtainium",
		"allthemodium:raw_unobtainium_block",
		"allthemodium:unobtainium_block",
		"allthemodium:unobtainium_sword",
		"allthemodium:unobtainium_pickaxe",
		"allthemodium:unobtainium_axe",
		"allthemodium:unobtainium_shovel",
		"allthemodium:unobtainium_hoe",
		"allthemodium:unobtainium_helmet",
		"allthemodium:unobtainium_chestplate",
		"allthemodium:unobtainium_leggings",
		"allthemodium:unobtainium_boots"
	]);
	gateRecipes("besttechrpg/unob_ore", "tier_unobtanium_ore", [
		// Unobtainium gear + blocks
		["minecraft:crafting", "allthemodium:unobtainium_helmet"], ["minecraft:crafting", "allthemodium:unobtainium_chestplate"],
		["minecraft:crafting", "allthemodium:unobtainium_leggings"], ["minecraft:crafting", "allthemodium:unobtainium_boots"],
		["minecraft:crafting", "allthemodium:unobtainium_pickaxe"], ["minecraft:crafting", "allthemodium:unobtainium_sword"],
		["minecraft:crafting", "allthemodium:unobtainium_axe"], ["minecraft:crafting", "allthemodium:unobtainium_shovel"],
		["minecraft:crafting", "allthemodium:unobtainium_hoe"],
		["minecraft:crafting", "allthemodium:unobtainium_block"], ["minecraft:crafting", "allthemodium:raw_unobtainium_block"]
	]);

	// ---------- tier_unobtanium_bosses ----------
	gateMobs("besttechrpg/unob_bosses", "tier_unobtanium_bosses", [
		"cataclysm:ancient_remnant",
		"cataclysm:the_harbinger",
		"cataclysm:ignis",
		"deeperdarker:stalker"
	]);
	gateStructures("besttechrpg/unob_bosses", "tier_unobtanium_bosses", [
		"cataclysm:cursed_pyramid",
		"cataclysm:ancient_factory",
		"cataclysm:burning_arena"
	]);
	gateItems("besttechrpg/unob_bosses", "tier_unobtanium_bosses", [
		"endrem:cryptic_eye", "endrem:evil_eye",
		// Apothic Enchanting top-tier shelves: unlock at endgame (no cap)
		"apothic_enchanting:endshelf", "apothic_enchanting:draconic_endshelf",
		"apothic_enchanting:pearl_endshelf",
		"apothic_enchanting:echoing_sculkshelf", "apothic_enchanting:soul_touched_sculkshelf",
		// Unobtanium-bosses-tier boss drops (uncraftable, must come from killing the gated boss)
		// Cataclysm ancient_remnant
		"cataclysm:sandstorm_in_a_bottle", "cataclysm:remnant_skull",
		"cataclysm:music_disc_ancient_remnant",
		// Cataclysm the_harbinger (witherite_block already in atm gateItems)
		"cataclysm:music_disc_the_harbinger",
		// Cataclysm ignis (ignitium_ingot already in atm gateItems)
		"cataclysm:music_disc_ignis",
		// DeeperDarker stalker
		"deeperdarker:soul_crystal"
	]);
	gateRecipes("besttechrpg/unob_bosses", "tier_unobtanium_bosses", [
		["minecraft:crafting", "endrem:cryptic_eye"],
		["minecraft:crafting", "endrem:evil_eye"],
		// Apothic top-tier shelves
		["minecraft:crafting", "apothic_enchanting:endshelf"],
		["minecraft:crafting", "apothic_enchanting:draconic_endshelf"],
		["minecraft:crafting", "apothic_enchanting:pearl_endshelf"],
		["minecraft:crafting", "apothic_enchanting:echoing_sculkshelf"],
		["minecraft:crafting", "apothic_enchanting:soul_touched_sculkshelf"]
	]);

	// ---------- tier_endgame ----------
	gateDimension("besttechrpg/endgame/end", "tier_endgame", "minecraft:the_end");

	// ---------- permanent_disabled (no stage of this name is ever granted) ----------
	gateItems("besttechrpg/disabled", "permanent_disabled", [
		"endrem:black_eye",
		"endrem:magical_eye",
		"endrem:witch_eye",
		"endrem:old_eye"
	]);
	gateRecipes("besttechrpg/disabled", "permanent_disabled", [
		["minecraft:crafting", "endrem:black_eye"],
		["minecraft:crafting", "endrem:magical_eye"],
		["minecraft:crafting", "endrem:witch_eye"],
		["minecraft:crafting", "endrem:old_eye"]
	]);

	console.info("[BestTechRpg] AStages restrictions registered.");
})();
