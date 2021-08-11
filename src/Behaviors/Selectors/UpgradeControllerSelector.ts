import { Option } from "../../UtilityAi/Option";
import { Action } from "../../UtilityAi/Action";
import { Selector } from "../../UtilityAi/Selector";
import { MoveAction } from "../Actions/MoveAction";
import { TransferAction } from "../Actions/TransferAction";

export class UpgradeControllerSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Upgrade ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new MoveAction<StructureController>(this.destinationId));
    this.action.addChild(new TransferAction(this.destinationId));
  }
}