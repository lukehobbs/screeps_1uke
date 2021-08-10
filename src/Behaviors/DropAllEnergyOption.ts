import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty } from "./MoveOption";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { DropOption } from "./DropOption";

export class DropAllEnergyOption extends DropOption {
  constructor() {
    super("drop all energy");

    this.scores = [];

    this.scores.push(new Score("spawn is full", ({ spawn }): number => {
      return Number((spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0) && 170);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -Infinity);
    }));
  }
}