import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "./GenericOptions/MoveOption";

export class MoveToDroppedResourceOption extends MoveOption<Resource> {
  constructor(destinationId: string) {
    super(`Move to dropped resource ${destinationId}`, destinationId);

    this.condition = (({ creep }) => !inventoryIsFull(creep));

    this.scores = [];

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && 150);
    }));

    this.scores.push(new Score("creep is stuck", ({ creep }: IContext): number => {
      return Number(creep.memory?._trav?.state === 6 && 100);
    }));
  }
}