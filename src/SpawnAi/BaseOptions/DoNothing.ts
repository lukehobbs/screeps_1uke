import { Option } from "../../UtilityAi/Option";
import { Action, ActionStatus } from "../../UtilityAi/Action";
import { Score } from "../../UtilityAi/Score";


export class DoNothingOption extends Option {
  action: DoNothingAction;

  constructor() {
    super("do-nothing", []);
    this.action = new DoNothingAction();
    this.scores.push(new Score("default", (): number => 0));
  }
}

class DoNothingAction extends Action {

  constructor() {
    super();
  }

  run(context: IContext): ActionStatus {
    return ActionStatus.SUCCESS;
  }
}

