import { Action, ActionStatus } from "./Action";

export class Sequence extends Action {
  constructor() {
    super();
  }

  run(context: IContext): ActionStatus {
    for (let child of super.children) {
      const childStatus = child.run(context);
      if (childStatus === ActionStatus.SUCCESS) {
        continue;
      }
      return childStatus;
    }
    return ActionStatus.SUCCESS;
  }
}