import { Option } from "../../../UtilityAi/Option";
import { DoNothingAction } from "../../Actions/DoNothingAction";


export class DoNothingOption extends Option {
  action: DoNothingAction;

  eval(context: IContext): number {
    return -1;
  }

  constructor() {
    super("do-nothing", []);
    this.action = new DoNothingAction();
  }
}

