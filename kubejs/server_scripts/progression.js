// BestTechRpg: progression bootstrap.
// Grants tier_copper (the start tier) to every player on first join. AStages stage
// chain is then driven by FTB Quest sentinel quests calling /astages add @p tier_<next>.

PlayerEvents.loggedIn(event => {
  const name = event.player.username;
  event.player.runCommandSilent(`astages add ${name} tier_copper`);
});
