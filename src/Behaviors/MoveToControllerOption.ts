import { Score } from "../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "./MoveOption";

export class MoveToControllerOption extends MoveOption<StructureController> {
  constructor(destinationId: string) {
    super(`Move to controller ${destinationId}`, destinationId);

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 175);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -150);
    }));

    this.scores.push(new Score("proximity to source", ({ creep, room }: IContext): number => {
      for (let source of room.memory.work.sources) {
        if (creep.pos.isNearTo(source.obj)) {
          return -Infinity;
        }
      }
      return 0;
    }));

    this.scores.push(new Score("distance from controller", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<StructureController>);
      return Number(creep.pos.isNearTo(dest!) && -50);
    }));
  }
}