import { UtilityAi } from "./UtilityAi/UtilityAi";
import { SpawnBaseCreepOption } from "./Behaviors/SpawnOptions/SpawnBaseCreepOption";
import { DoNothingOption } from "./Behaviors/GenericOptions/DoNothingOption";
import { SpawnMiningCreepOption } from "./Behaviors/SpawnOptions/SpawnMiningCreepOption";

export class SpawnUtilityAi extends UtilityAi {
}

export const initializeSpawnOptions = (ai: SpawnUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());
  ai.addOption(new SpawnBaseCreepOption(room));
  // ai.addOption(new SpawnMiningCreepOption(room));
};