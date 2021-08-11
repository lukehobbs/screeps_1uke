import { Score } from "../UtilityAi/Score";
import { MineSelector } from "./Selectors/MineSelector";

export class MineOption extends MineSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ room, creep }: IContext): boolean => {
      const source = Game.getObjectById(destinationId as Id<Source>);

      if (!source) return false;

      if (creep.pos.isNearTo(source.pos)) return true;

      for (let pos of room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj ?? []) {
        if (room.lookForAt(LOOK_CREEPS, pos.x, pos.y).length === 0) {
          return true;
        }
      }
      return false;
    };

    this.scores = [];

    this.scores.push(new Score("proximity to source", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      // (MAX_RANGE - ACTUAL) / MAX_RANGE ~ y = -x
      return (125 - creep.pos.getRangeTo(dest.pos)) / 125;
    }));
  }
}