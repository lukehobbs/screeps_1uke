import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { ClaimControllerAction } from "../../Actions/ClaimControllerAction";
import { MoveToControllerInRoom } from "../../Actions/MoveToControllerInRoom";

export class ClaimControllerSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Claim ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new ClaimControllerAction(this.destinationId));
    this.action.addChild(new MoveToControllerInRoom());
  }
}