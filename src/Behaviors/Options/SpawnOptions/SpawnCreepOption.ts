import { Option } from "../../../UtilityAi/Option";
import { CreepType, SpawnCreepAction } from "../../Actions/SpawnCreepAction";

export abstract class SpawnCreepOption extends Option {
  action: SpawnCreepAction;
  creepType: CreepType;

  protected constructor(id: string, creepType: CreepType) {
    super(id, []);
    this.action = new SpawnCreepAction(creepType);
    this.creepType = creepType;
    this.condition = ({ spawn: { spawning }, room: { memory: { lastSpawned } } }) => {
      return !lastSpawned ? true : (Game.time - lastSpawned) > 60 && !spawning;
    };
  }
}

