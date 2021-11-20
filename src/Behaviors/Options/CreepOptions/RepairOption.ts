import { Score } from "../../../UtilityAi/Score";
import { RepairSelector } from "../Selectors/RepairSelector";
import { RESOURCE_ENERGY } from "../../../../test/unit/constants";

export class RepairOption extends RepairSelector {
  constructor(targetId: string) {
    super(targetId);

    this.condition = (context): boolean => {
      if (context.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;

      const target = Game.getObjectById(targetId as Id<AnyStructure>);
      if (!target) return false;

      if (target.structureType === STRUCTURE_WALL && target.hits > 10000) return false;
      return target.hits < (target.hitsMax * 0.75);
    };

    this.scores = [];

    this.scores.push(new Score("i'm next to the target", ({ creep }): number => {
      const target = Game.getObjectById(this.targetId as Id<AnyStructure>);

      if (!target) return -Infinity;

      return (49 - creep.pos.getRangeTo(target.pos)) / 49;
    }));

    this.scores.push(new Score("target hit points remaining", (): number => {
      const target = Game.getObjectById(this.targetId as Id<AnyStructure>);

      if (!target) return -Infinity;

      const hitsTarget = target.hitsMax * 0.7;

      return (hitsTarget - target.hits) / hitsTarget;
    }));

    this.scores.push(new Score("don't prioritize repairing stuff though..", (): number => 0.4));
  }
}