import { Score } from "../../UtilityAi/Score";
import { MineSelector } from "../Selectors/MineSelector";

export class MineOption extends MineSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ room, creep }: IContext): boolean => {
      const source = Game.getObjectById(destinationId as Id<Source>);

      if (!source) return false;

      if (creep.pos.isNearTo(source.pos)) return true;

      for (let pos of room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj || []) {
        if (room.lookForAt(LOOK_CREEPS, pos.x, pos.y).length === 0) {
          return true;
        }
      }
      return false;
    };

    this.scores = [];

    this.scores.push(new Score("i'm next to a source", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      return creep.pos.getRangeTo(dest.pos) == 1 ? 1 : 0
    }));

    this.scores.push(new Score("creeps near source", ({ room}): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      const openSpaces = room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj ?? []
      const numSpaces = openSpaces.length;

      const top = _.min(openSpaces.map(pos => pos.y))
      const bottom = _.max(openSpaces.map(pos => pos.y))
      const left = _.min(openSpaces.map(pos => pos.x))
      const right = _.max(openSpaces.map(pos => pos.x))

      return (numSpaces - room.lookForAtArea(LOOK_CREEPS, top, left, bottom, right, true).length) / numSpaces;
    }));

    this.scores.push(new Score("extra work parts on creep", ({creep}: IContext): number => {
      const workParts = creep.body.filter((part): boolean => {return part.type == WORK}).length

      return 0.25 * workParts - 0.25;
    }));
  }
}