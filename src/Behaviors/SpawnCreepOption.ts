import { Option } from "../UtilityAi/Option";
import { CreepType, SpawnCreepAction } from "./SpawnCreepAction";

export abstract class SpawnCreepOption extends Option {
  action: SpawnCreepAction;

  protected constructor(id: string, creepType: CreepType) {
    super(id, []);
    this.action = new SpawnCreepAction(creepType);
  }
}

