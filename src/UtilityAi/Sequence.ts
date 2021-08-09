import { Action, ActionStatus } from "./Action";

export class Sequence extends Action {
  constructor() {
    super();
  }

  run(creep: Creep): ActionStatus {
    for (let child of super.children) {
      const childStatus = child.run(creep);
      if (childStatus === ActionStatus.SUCCESS) {
        continue;
      }
      return childStatus;
    }
    return ActionStatus.SUCCESS;
  }
}