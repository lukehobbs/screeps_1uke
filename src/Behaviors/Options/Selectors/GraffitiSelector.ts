import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { GraffitiAction } from "../../Actions/GraffitiAction";

export class GraffitiSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Graffiti ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new GraffitiAction(this.destinationId));
    this.action.addChild(new MoveAction<StructureController>(this.destinationId));
  }
}