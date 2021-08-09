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

    this.scores.push(new Score("distance from source", ({ creep }: IContext): number => {
      const source = Game.getObjectById(destinationId as Id<Source>);
      if (!source) return -Infinity;

      return Number(!creep.pos.inRangeTo(source.pos, 8) && -25);
    }));

    this.scores.push(new Score("space to mine", ({ room}): number => {
      const source = Game.getObjectById(destinationId as Id<Source>);

      if (!source) return -Infinity;

      for (let pos of room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj ?? []) {
        if (room.lookForAt(LOOK_CREEPS, room.getPositionAt(pos.x, pos.y)!).length === 0) {
          return 50;
        }
      }
      return -50;
    }));
  }
}