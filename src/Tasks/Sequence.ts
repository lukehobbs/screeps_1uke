import { Strategy } from "../Strategies/Strategy";
import { Task, TaskStatus } from "./Task";

export class Sequence extends Task {
  constructor() {
    super();
  }

  run(strategy: Strategy, creep: Creep): TaskStatus {
    for (let child of super.children) {
      const childStatus = child.run(strategy, creep);
      if (childStatus === TaskStatus.SUCCESS) {
        continue;
      }
      return childStatus;
    }
    return TaskStatus.SUCCESS;
  }
}