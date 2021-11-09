import { Score } from "../../UtilityAi/Score";
import { PickupSelector } from "../Selectors/PickupSelector";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";

export class PickupDroppedResourceOption extends PickupSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }) => creep.store.getFreeCapacity(RESOURCE_ENERGY) !== 0 && creep.body.filter(b => b.type === CARRY).length !== 0;

    this.scores = [];

    this.scores.push(new Score("inventory space", ({ creep }: IContext): number => {
      return creep.store.getFreeCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY) * 0.1;
    }));

    this.scores.push(new Score("enough resource to fill my inventory",({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest) return -1;

      return dest.amount >= creep.store.getFreeCapacity(RESOURCE_ENERGY) ? 0.1 : 0;
    }));

    this.scores.push(new Score("proximity to resource", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest) return -1;

      return ((75 - creep.pos.getRangeTo(dest.pos)) / 75);
    }));
  }
}