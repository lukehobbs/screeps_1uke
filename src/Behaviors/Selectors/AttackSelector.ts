import { Option } from "../../UtilityAi/Option";
import { Action } from "../../UtilityAi/Action";
import { Selector } from "../../UtilityAi/Selector";
import { MoveAction } from "../Actions/MoveAction";
import { AttackAction } from "../Actions/AttackAction";

export class AttackSelector extends Option {
  action: Action;
  targetId: string;

  constructor(targetId: string) {
    super(`Attack ${targetId}`, []);
    this.targetId = targetId;

    this.action = new Selector();

    this.action.addChild(new AttackAction(this.targetId));
    this.action.addChild(new MoveAction<AnyCreep>(this.targetId));
  }
}