import { Score } from "../UtilityAi/Score";
import { MoveOption } from "./GenericOptions/MoveOption";

export class MoveToSourceOption extends MoveOption<Source> {
  constructor(destinationId: string) {
    super(`Move to source ${destinationId}`, destinationId);

    this.condition = ({creep}): boolean => {
      const source = Game.getObjectById(destinationId as Id<Source>);
      return !source?.pos.isNearTo(creep.pos) ?? false
    }

    this.scores = [];

    this.scores.push(new Score("proximity to source", ({creep}): number => {
      const source = Game.getObjectById(destinationId as Id<Source>);
      if (!source) return -Infinity;

      return 10 - creep.pos.getRangeTo(source.pos);
    }));

    this.scores.push(new Score("space to mine", ({ room}): number => {
      const source = Game.getObjectById(destinationId as Id<Source>);

      if (!source) return -Infinity;

      for (let pos of room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj ?? []) {
        if (room.lookForAt(LOOK_CREEPS, room.getPositionAt(pos.x, pos.y)!).length === 0) {
          return 200;
        }
      }
      return -50;
    }));
  }
}