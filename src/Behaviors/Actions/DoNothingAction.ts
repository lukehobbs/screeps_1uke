import { Action, ActionStatus } from "../../UtilityAi/Action";

export class DoNothingAction extends Action {

  constructor() {
    super();
  }

  run(context: IContext): ActionStatus {
    return ActionStatus.SUCCESS;
  }
}