import { Score } from "../../../UtilityAi/Score";
import { PickupResourceSelector } from "../Selectors/PickupSelector";
import { CARRY, RESOURCE_ENERGY } from "../../../../test/unit/constants";

export class PickupResourceOption extends PickupResourceSelector {

  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }) => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) return false;

      return creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && creep.body.filter(b => b.type === CARRY).length !== 0;
    };

    this.scores = [];

    this.scores.push(new Score("enough resource to fill my inventory", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest) return -1;

      return dest.amount > creep.store.getFreeCapacity(RESOURCE_ENERGY) ? 1 : 0.25;
    }));

    this.scores.push(new Score("proximity to resource", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest) return -1;

      return ((49 - creep.pos.getRangeTo(dest.pos)) / 49);
    }));

    this.scores.push(new Score("creeps near resource", ({ creep, room }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Resource>);

      if (!dest) return -Infinity;

      if (creep.pos.isNearTo(dest.pos)) return 1;


      const top = dest.pos.y - 1;
      const bottom = dest.pos.y + 1;
      const left = dest.pos.x - 1;
      const right = dest.pos.x + 1;

      let max = 0;

      for (let y = top; y < bottom; y++) {
        for (let x = left; x < right; x++) {
          if (room.getTerrain().get(x, y) === 0) max++;
        }
      }

      return (max - room.lookForAtArea(LOOK_CREEPS, top, left, bottom, right, true).length) / max;
    }));
  }
}