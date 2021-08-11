import { Action, ActionStatus } from "./Action";

export class Selector extends Action {
  constructor() {
    super();
  }

  run(context: IContext): ActionStatus {
    for (let child of this.children) {
      const childStatus = child.run(context);
      if (childStatus === ActionStatus.FAILURE) {
        continue;
      }
      return childStatus;
    }
    return ActionStatus.FAILURE;
  }
}