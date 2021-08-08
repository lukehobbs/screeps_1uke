import { Task, TaskStatus } from "../Task";

export enum StoreConstant {
  EMPTY = "empty",
  NOT_EMPTY = "not_empty",
  FULL = "full",
  NOT_FULL = "not_full"
}

export class CreepStoreCondition extends Task {
  private readonly resourceType: ResourceConstant;
  private readonly storeCondition: StoreConstant;

  constructor(resource: ResourceConstant, condition: StoreConstant) {
    super();
    this.resourceType = resource;
    this.storeCondition = condition;
  }

  run(strategy: any, creep: Creep): TaskStatus {
    switch (this.storeCondition) {

      case StoreConstant.EMPTY:
        if (creep.store.getUsedCapacity(this.resourceType) === 0) return TaskStatus.SUCCESS;
        else return TaskStatus.FAILURE;

      case StoreConstant.NOT_EMPTY:
        if (creep.store.getUsedCapacity(this.resourceType) !== 0) return TaskStatus.SUCCESS;
        else return TaskStatus.FAILURE;

      case StoreConstant.FULL:
        if (creep.store.getFreeCapacity(this.resourceType) === 0) return TaskStatus.SUCCESS;
        else return TaskStatus.FAILURE;

      case StoreConstant.NOT_FULL:
        if (creep.store.getFreeCapacity(this.resourceType) !== 0) return TaskStatus.SUCCESS;
        else return TaskStatus.FAILURE;

      default:
        return TaskStatus.FAILURE;
    }
  }
}