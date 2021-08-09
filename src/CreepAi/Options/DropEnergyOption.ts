import { Score } from "../../UtilityAi/Score";
import { inventoryIsEmpty } from "../BaseOptions/MoveTo";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { DropResourceOption } from "../BaseOptions/DropResourceOption";

export class DropEnergyOption extends DropResourceOption {
  constructor() {
    super("drop all energy");

    this.scores = [];

    this.scores.push(new Score("spawn is full", ({ spawn }): number => {
      return Number((spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0) && 200);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -200);
    }));
  }
}