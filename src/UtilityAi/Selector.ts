import { Action, ActionStatus } from "./Action";

export class Selector extends Action {
  constructor() {
    super();
  }

  run(creep: Creep): ActionStatus {
    for (let child of super.children) {
      const childStatus = child.run(creep);
      if (childStatus === ActionStatus.FAILURE) {
        continue;
      }
      return childStatus;
    }
    return ActionStatus.FAILURE;
  }
}