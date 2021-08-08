import { Task, TaskStatus } from "../Task";

export class TransferAction extends Task {
  private readonly resourceType: ResourceConstant;
  private readonly targetId?: string;

  constructor(targetId?: string, resourceType?: ResourceConstant) {
    super();
    this.resourceType = resourceType ?? RESOURCE_ENERGY;
    this.targetId = targetId;
  }

  run(strategy: any, creep: Creep): TaskStatus {
    const target = Game.getObjectById(this.targetId as Id<any>);

    if (!target) return TaskStatus.FAILURE;

    const err = creep.transfer(target, this.resourceType);

    if (err === OK) {
      return TaskStatus.SUCCESS;
    } else {
      return TaskStatus.FAILURE;
    }
  }
}