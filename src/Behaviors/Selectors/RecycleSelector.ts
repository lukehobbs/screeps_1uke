import { Option } from "../../UtilityAi/Option";
import { Action } from "../../UtilityAi/Action";
import { Selector } from "../../UtilityAi/Selector";
import { MoveAction } from "../Actions/MoveAction";
import { RecycleAction } from "../Actions/RecycleAction";

export class RecycleSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Recycle ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new RecycleAction(this.destinationId));
    this.action.addChild(new MoveAction<StructureSpawn>(this.destinationId));
  }
}