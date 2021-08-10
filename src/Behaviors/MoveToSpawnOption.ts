import { Score } from "../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "./GenericOptions/MoveOption";

export class MoveToSpawnOption extends MoveOption<StructureSpawn> {
  constructor(destinationId: string) {
    super(`Move to spawn ${destinationId}`, destinationId);

    this.condition = (context): boolean => {
      return context.spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
    };

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 100);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -200);
    }));

    this.scores.push(new Score("free inventory space", ({ creep: { store } }: IContext): number => {
      return Number(store.getFreeCapacity(RESOURCE_ENERGY));
    }));

    this.scores.push(new Score("free inventory space", ({ spawn: { store } }: IContext): number => {
      return Number(store.getFreeCapacity(RESOURCE_ENERGY));
    }));
  }
}