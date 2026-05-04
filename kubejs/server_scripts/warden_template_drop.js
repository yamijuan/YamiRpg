// BestTechRpg: Warden drops Vibranium Upgrade Smithing Template at 20% chance.
//
// This is a secondary source for the template — primary source is brushing
// suspicious soul sand in Bastion treasure rooms. The Warden drop gives
// players a deterministic farming option once they've reached netherite tier.
//
// Implemented via EntityEvents.death because ServerEvents.entityLootTables
// was removed in KubeJS 2101.x.

const WARDEN_VIBRANIUM_DROP_CHANCE = 0.20;

EntityEvents.death(event => {
	const entity = event.entity;
	if (entity.type !== "minecraft:warden") return;
	if (Math.random() >= WARDEN_VIBRANIUM_DROP_CHANCE) return;

	entity.block.popItem(Item.of("allthemodium:vibranium_upgrade_smithing_template"));
});
