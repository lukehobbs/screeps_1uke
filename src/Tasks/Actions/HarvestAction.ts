import { Task, TaskStatus } from "../Task";

export class HarvestAction extends Task {
  private readonly targetId?: string;

  constructor(targetId?: string) {
    super();
    this.targetId = targetId;
  }

  run(strategy: any, creep: Creep): TaskStatus {
    const target = Game.getObjectById(this.targetId as Id<any>);

    if (!target) return TaskStatus.FAILURE;

    const err = creep.harvest(target);

    if (err === OK) {
      return TaskStatus.SUCCESS;
    } else {
      return TaskStatus.FAILURE;
    }
  }
}