import { UtilityAi } from "./UtilityAi/UtilityAi";
import { SpawnBaseCreepOption } from "./Behaviors/SpawnOptions/SpawnBaseCreepOption";
import { DoNothingOption } from "./Behaviors/GenericOptions/DoNothingOption";

export class SpawnUtilityAi extends UtilityAi {
}

export const initializeSpawnOptions = (ai: SpawnUtilityAi) => {
  ai.addOption(new SpawnBaseCreepOption());
  ai.addOption(new DoNothingOption());
};