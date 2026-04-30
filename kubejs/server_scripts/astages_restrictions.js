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
		mobs.forEach((m, i) => {
			AStages.addRestrictionForMob(`${prefix}/mob_${i}`, stage, m)
				.setEnableMobSpawning(false);
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
	gateTags("besttechrpg/iron/mat", "tier_iron", [
		"c:ingots/iron", "c:ingots/gold", "c:ingots/silver", "c:ingots/nickel", "c:ingots/aluminum",
		"c:raw_materials/iron", "c:raw_materials/gold", "c:raw_materials/silver", "c:raw_materials/nickel", "c:raw_materials/aluminum",
		"c:storage_blocks/iron", "c:storage_blocks/gold", "c:storage_blocks/silver", "c:storage_blocks/nickel", "c:storage_blocks/aluminum",
		"c:storage_blocks/raw_iron", "c:storage_blocks/raw_gold",
		"c:nuggets/iron", "c:nuggets/gold"
	]);
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
		"minecraft:bucket", "minecraft:water_bucket", "minecraft:lava_bucket", "minecraft:milk_bucket", "minecraft:powder_snow_bucket",
		"minecraft:iron_door", "minecraft:iron_bars", "minecraft:iron_trapdoor",
		"minecraft:shears", "minecraft:flint_and_steel", "minecraft:shield", "minecraft:bell",
		"minecraft:anvil", "minecraft:chipped_anvil", "minecraft:damaged_anvil", "minecraft:cauldron",
		"minecraft:compass", "minecraft:hopper",
		// Enchanting unlocks at iron: table + TF canopy bookshelves (15 maxEterna)
		"minecraft:enchanting_table",
		"twilightforest:canopy_bookshelf", "twilightforest:chiseled_canopy_bookshelf"
	]);
	gateRecipes("besttechrpg/iron", "tier_iron", [
		["minecraft:crafting", "endrem:exotic_eye"],
		["minecraft:crafting", "endrem:undead_eye"]
	]);

	// ---------- iron-tier per-enchant cap: floor(vanillaMax / 2), min 1 ----------
	// AStages.addRestrictionForEnchant(id, stage, ench, comparator, level).
	// Restriction lifts at tier_diamond → applies for copper/iron players.
	// Comparator "less_equal" per user instruction; if behavior is inverted, swap to "great".
	//
	// In MC 1.21 enchantments are a data-driven registry, NOT bound when server_scripts
	// load. Registering at script-load time throws "Can't interpret 'minecraft:protection'
	// as 'minecraft:enchantment': registry not found". We defer to ServerEvents.loaded,
	// which fires after the enchantment registry is bound.
	const __enchantCaps = [
		["minecraft:protection", 4], ["minecraft:fire_protection", 4],
		["minecraft:feather_falling", 4], ["minecraft:blast_protection", 4],
		["minecraft:projectile_protection", 4], ["minecraft:respiration", 3],
		["minecraft:thorns", 3], ["minecraft:depth_strider", 3],
		["minecraft:frost_walker", 2], ["minecraft:soul_speed", 3],
		["minecraft:swift_sneak", 3],
		["minecraft:sharpness", 5], ["minecraft:smite", 5],
		["minecraft:bane_of_arthropods", 5], ["minecraft:knockback", 2],
		["minecraft:fire_aspect", 2], ["minecraft:looting", 3],
		["minecraft:sweeping_edge", 3],
		["minecraft:efficiency", 5], ["minecraft:unbreaking", 3],
		["minecraft:fortune", 3],
		["minecraft:power", 5], ["minecraft:punch", 2],
		["minecraft:luck_of_the_sea", 3], ["minecraft:lure", 3],
		["minecraft:loyalty", 3], ["minecraft:impaling", 5],
		["minecraft:riptide", 3], ["minecraft:quick_charge", 3],
		["minecraft:piercing", 4],
		["minecraft:density", 5], ["minecraft:breach", 4],
		["minecraft:wind_burst", 3]
	];
	let __enchantCapsRegistered = false;
	ServerEvents.loaded(e => {
		if (__enchantCapsRegistered) return;
		__enchantCapsRegistered = true;
		__enchantCaps.forEach(([ench, vanillaMax], i) => {
			const cap = Math.max(1, Math.floor(vanillaMax / 2));
			try {
				AStages.addRestrictionForEnchant(`besttechrpg/iron/ench_${i}`, "tier_diamond", ench, "great", cap);
			} catch (err) {
				console.warn(`[BestTechRpg] enchant cap registration failed for ${ench}: ${err}`);
			}
		});
		console.info(`[BestTechRpg] Registered ${__enchantCaps.length} iron-tier enchant caps.`);
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
		// Diamond-tier utility (enchanting_table available earlier; golden apples ungated)
		"minecraft:beacon", "minecraft:ender_chest",
		// Aquaculture Neptunium armor gated to diamond
		"aquaculture:neptunium_helmet", "aquaculture:neptunium_chestplate",
		"aquaculture:neptunium_leggings", "aquaculture:neptunium_boots",
		"aquaculture:neptunium_sword", "aquaculture:neptunium_axe",
		// ATM nether-source bookshelves (maxEterna 30). ancient_bookshelf is The-Other-only, gated at ATM
		"allthemodium:demonic_bookshelf", "allthemodium:soul_bookshelf"
	]);
	gateRecipes("besttechrpg/diamond", "tier_diamond", [
		["minecraft:crafting", "endrem:rogue_eye"],
		["minecraft:crafting", "endrem:lost_eye"]
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
		"c:ingots/uranium", "c:ingots/osmium", "c:ingots/platinum", "c:ingots/zinc",
		"c:storage_blocks/uranium", "c:storage_blocks/osmium", "c:storage_blocks/platinum", "c:storage_blocks/zinc",
		"c:raw_materials/uranium", "c:raw_materials/osmium", "c:raw_materials/platinum", "c:raw_materials/zinc"
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
		"apothic_enchanting:hellshelf", "apothic_enchanting:seashelf"
	]);
	gateRecipes("besttechrpg/netherite", "tier_netherite", [
		["minecraft:crafting", "endrem:nether_eye"],
		["minecraft:crafting", "endrem:wither_eye"]
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
		// ATM ancient_bookshelf: only Ancient wood from The Other dim, naturally gated here
		"allthemodium:ancient_bookshelf",
		// Apothic upgraded hellshelf/seashelf variants (maxEterna 60-65). Base hellshelf+seashelf moved to netherite
		"apothic_enchanting:blazing_hellshelf",
		"apothic_enchanting:glowing_hellshelf", "apothic_enchanting:infused_hellshelf",
		"apothic_enchanting:crystal_seashelf",
		"apothic_enchanting:heart_seashelf", "apothic_enchanting:infused_seashelf",
		"apothic_enchanting:beeshelf", "apothic_enchanting:melonshelf",
		"apothic_enchanting:stoneshelf", "apothic_enchanting:treasure_shelf",
		"apothic_enchanting:geode_shelf",
		"apothic_enchanting:sightshelf"
	]);
	gateRecipes("besttechrpg/atm", "tier_allthemodium", [
		["minecraft:crafting", "endrem:cold_eye"],
		["minecraft:crafting", "endrem:guardian_eye"]
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
		"apothic_enchanting:filtering_shelf"
	]);
	gateRecipes("besttechrpg/vibranium", "tier_vibranium", [
		["minecraft:crafting", "endrem:cursed_eye"],
		["minecraft:crafting", "endrem:corrupted_eye"]
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
		"apothic_enchanting:echoing_sculkshelf", "apothic_enchanting:soul_touched_sculkshelf"
	]);
	gateRecipes("besttechrpg/unob_bosses", "tier_unobtanium_bosses", [
		["minecraft:crafting", "endrem:cryptic_eye"],
		["minecraft:crafting", "endrem:evil_eye"]
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
