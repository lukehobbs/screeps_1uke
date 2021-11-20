import { UtilityAi } from "./UtilityAi/UtilityAi";
import { SpawnBaseCreepOption } from "./Behaviors/Options/SpawnOptions/SpawnBaseCreepOption";
import { DoNothingOption } from "./Behaviors/Options/GenericOptions/DoNothingOption";
import { SpawnSmurfOption } from "./Behaviors/Options/SpawnOptions/SpawnSmurfOption";
import { SpawnOffenseOption } from "./Behaviors/Options/SpawnOptions/SpawnOffenseOption";
import { SpawnWarriorOption } from "./Behaviors/Options/SpawnOptions/SpawnWarriorOption";

export class SpawnUtilityAi extends UtilityAi {
}

export const initializeSpawnOptions = (ai: SpawnUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());
  ai.addOption(new SpawnBaseCreepOption(room));
  ai.addOption(new SpawnSmurfOption(room));
  // ai.addOption(new SpawnDefenderOption(room));
  // ai.addOption(new SpawnSettlerOption(room));
  // ai.addOption(new SpawnHealerOption(room));
  // ai.addOption(new SpawnMiningCreepOption(room));
  ai.addOption(new SpawnOffenseOption(room));
  ai.addOption(new SpawnWarriorOption(room));
};