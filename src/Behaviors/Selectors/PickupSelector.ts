import { Option } from "../../UtilityAi/Option";
import { Action } from "../../UtilityAi/Action";
import { Selector } from "../../UtilityAi/Selector";
import { MoveAction } from "../Actions/MoveAction";
import { PickupAction } from "../Actions/PickupAction";

export class PickupSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Pickup ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new PickupAction(this.destinationId));
    this.action.addChild(new MoveAction<Resource>(this.destinationId));
  }
}