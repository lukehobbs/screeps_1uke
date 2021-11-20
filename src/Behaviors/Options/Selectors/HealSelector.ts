import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { HealAction } from "../../Actions/HealAction";

export class HealSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Heal ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new HealAction(this.destinationId));
    this.action.addChild(new MoveAction<Creep>(this.destinationId));
  }
}