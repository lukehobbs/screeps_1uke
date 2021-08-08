import { Task, TaskStatus } from "../Tasks/Task";

export const Strategies: Record<string, Strategy> = {};
export const PrioritizedStrategies: Strategy[] = []

declare global {
  interface CreepMemory {
    strategy?: string;
    loadTarget?: string;
    unloadTarget?: string;
  }
}

export abstract class Strategy {
  public id: string;
  public assigned: Id<Creep>[] = [];
  abstract behaviorTree: Task;
  abstract behaviorTreeStatus: TaskStatus = TaskStatus.NONE;

  constructor(public priority: number = 5) {
    this.id = this.constructor.name;
  }

  abstract start(creep: Creep): void;

  update(creep: Creep): void {
    if (this.behaviorTreeStatus === TaskStatus.NONE || this.behaviorTreeStatus === TaskStatus.RUNNING) {
      this.behaviorTreeStatus = this.behaviorTree.run(this, creep);
    }
  }
}