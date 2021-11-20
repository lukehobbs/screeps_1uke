import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { RecycleCreepAction } from "../../Actions/RecycleCreepAction";

export class RecycleCreepSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Recycle ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new RecycleCreepAction(this.destinationId));
    this.action.addChild(new MoveAction<StructureSpawn>(this.destinationId));
  }
}