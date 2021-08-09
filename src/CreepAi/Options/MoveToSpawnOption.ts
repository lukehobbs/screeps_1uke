import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "../BaseOptions/MoveTo";

export class MoveToSpawnOption extends MoveOption<StructureSpawn> {
  constructor(destinationId: string) {
    super(`Move to spawn ${destinationId}`, destinationId);

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 100);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -200);
    }));

    this.scores.push(new Score("used inventory capacity", ({ creep: { store } }: IContext): number => {
      return Number(store.getUsedCapacity(RESOURCE_ENERGY));
    }));
  }
}