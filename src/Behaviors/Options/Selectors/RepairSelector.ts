import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { RepairAction } from "../../Actions/RepairAction";

export class RepairSelector extends Option {
  action: Action;
  targetId: string;

  constructor(targetId: string) {
    super(`Repair ${targetId}`, []);
    this.targetId = targetId;

    this.action = this.MoveOrRepairSelector();
  }

  MoveOrRepairSelector = (): Action => {
    const selector = new Selector();

    selector.addChild(new RepairAction(this.targetId));
    selector.addChild(new MoveAction<AnyStructure>(this.targetId));

    return selector;
  };
}