import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MineAction } from "../../Actions/MineAction";
import { MoveAction } from "../../Actions/MoveAction";

export class MineSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Mine ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new MineAction(this.destinationId));
    this.action.addChild(new MoveAction<Source>(this.destinationId));
  }
}