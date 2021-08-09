import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "../BaseOptions/MoveTo";

export class MoveToSourceOption extends MoveOption<Source> {
  constructor(destinationId: string) {
    super(`Move to source ${destinationId}`, destinationId);

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && -100);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && 100);
    }));

    this.scores.push(new Score("free inventory space", ({ creep: { store } }: IContext): number => {
      return Number(store.getFreeCapacity(RESOURCE_ENERGY));
    }));
  }
}