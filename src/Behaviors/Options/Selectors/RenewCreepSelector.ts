import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { RenewCreepAction } from "../../Actions/RenewCreepAction";

export class RenewCreepSelector extends Option {
  action: Action;
  spawnId: string;

  constructor(spawnId: string) {
    super(`Renew ${spawnId}`, []);
    this.spawnId = spawnId;

    this.action = new Selector();
    this.action.addChild(new RenewCreepAction(this.spawnId));
    this.action.addChild(new MoveAction<StructureSpawn>(this.spawnId));
  }
}