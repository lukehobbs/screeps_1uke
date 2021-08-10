import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "./MoveOption";

export class MoveToDroppedResourceOption extends MoveOption<Resource> {
  constructor(destinationId: string) {
    super(`Move to dropped resource ${destinationId}`, destinationId);

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && -Infinity);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && 150);
    }));

    this.scores.push(new Score("creep is stuck", ({ creep }: IContext): number => {
      return Number(creep.memory?._trav?.state === 6 && 100);
    }));
  }
}