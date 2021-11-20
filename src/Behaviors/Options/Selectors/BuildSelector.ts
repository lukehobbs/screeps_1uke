import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { BuildAction } from "../../Actions/BuildAction";

export class BuildSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Build ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = new Selector();
    this.action.addChild(new BuildAction(this.destinationId));
    this.action.addChild(new MoveAction<ConstructionSite>(this.destinationId));
  }
}