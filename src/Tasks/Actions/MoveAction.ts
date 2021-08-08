import { Task, TaskStatus } from "../Task";

export class MoveAction extends Task {
  private readonly destinationId?: string;

  constructor(destinationId?: string) {
    super();
    this.destinationId = destinationId;
  }

  run(strategy: any, creep: Creep): TaskStatus {
    const dest = Game.getObjectById(this.destinationId as Id<any>);

    if (!dest) return TaskStatus.FAILURE;

    const err = creep.travelTo(dest);

    if (err === OK) {
      return TaskStatus.SUCCESS;
    } else {
      return TaskStatus.FAILURE;
    }
  }
}