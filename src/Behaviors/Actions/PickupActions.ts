import { ActionStatus, GenericAction } from "../../UtilityAi/Action";

export class GenericPickupAction<StorageType> extends GenericAction<StorageType> {
  constructor(private readonly targetId: string, private readonly pickupFunction: (c: Creep, t: StorageType) => ScreepsReturnCode) {
    super();
  }

  run(context: IContext): ActionStatus {
    const dest = Game.getObjectById(this.targetId as Id<StorageType>);
    if (!dest) return ActionStatus.FAILURE;

    const err = this.pickupFunction(context.creep, dest);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      // console.log(err);
      return ActionStatus.FAILURE;
    }
  }
}

export class PickupStructureAction<T extends Structure | Tombstone | Ruin> extends GenericPickupAction<T> {
  constructor(targetId: string, resourceType: ResourceConstant) {
    super(targetId, (c: Creep, t: T): ScreepsReturnCode => {
      return c.withdraw(t, resourceType);
    });
  }
}

export class PickupResourceAction extends GenericPickupAction<Resource> {
  constructor(targetId: string) {
    super(targetId, (c: Creep, t: Resource): ScreepsReturnCode => {
      return c.pickup(t);
    });
  }
}