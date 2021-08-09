import { Option } from "../../UtilityAi/Option";
import { Action, ActionStatus } from "../../UtilityAi/Action";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";

export const inventoryIsEmpty = (creep: Creep) => creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;
export const inventoryIsFull = (creep: Creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

export abstract class MoveOption<T extends HasPos> extends Option {
  action: MoveAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new MoveAction(destinationId);
  }
}

class MoveAction<T extends HasPos> extends Action {
  private readonly destinationId?: string;

  constructor(destinationId?: string) {
    super();
    this.destinationId = destinationId;
  }

  run(context: IContext): ActionStatus {
    const dest = Game.getObjectById(this.destinationId as Id<T>);

    if (!dest) return ActionStatus.FAILURE;

    const err = context.creep.travelTo(dest);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}

