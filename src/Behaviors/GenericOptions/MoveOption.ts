import { Option } from "../../UtilityAi/Option";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { MoveAction } from "../Actions/MoveAction";

export const inventoryIsEmpty = (creep: Creep) => creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;
export const inventoryIsFull = (creep: Creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

export abstract class MoveOption<T extends HasPos> extends Option {
  action: MoveAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new MoveAction(destinationId);
  }
}

