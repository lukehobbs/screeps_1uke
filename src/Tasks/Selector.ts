import { Strategy } from "../Strategies/Strategy";
import { Task, TaskStatus } from "./Task";

export class Selector extends Task {
  constructor() {
    super();
  }

  run(strategy: Strategy, creep: Creep): TaskStatus {
    for (let child of super.children) {
      const childStatus = child.run(strategy, creep);
      if (childStatus === TaskStatus.FAILURE) {
        continue;
      }
      return childStatus;
    }
    return TaskStatus.FAILURE;
  }
}