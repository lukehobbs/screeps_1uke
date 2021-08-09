import { UtilityAi } from "../UtilityAi/UtilityAi";
import { SpawnBaseCreepOption } from "./Options/SpawnBaseCreepOption";
import { DoNothingOption } from "./BaseOptions/DoNothing";

export class SpawnUtilityAi extends UtilityAi {
}

export const initializeSpawnOptions = (ai: SpawnUtilityAi) => {
  ai.addOption(new SpawnBaseCreepOption());
  ai.addOption(new DoNothingOption());
};