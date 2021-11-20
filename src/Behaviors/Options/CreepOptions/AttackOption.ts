import { Score } from "../../../UtilityAi/Score";
import { AttackSelector } from "../Selectors/AttackSelector";
import { RESOURCE_ENERGY } from "../../../../test/unit/constants";

export class AttackOption extends AttackSelector {
  constructor(targetId: string) {
    super(targetId);

    this.condition = ({ creep }: IContext): boolean => {
      const tower = (creep as unknown as StructureTower);
      if (tower.structureType === STRUCTURE_TOWER) {
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      }
      return _.contains(creep.body.map(b => b.type), ATTACK);
    };

    this.scores = [];

    this.scores.push(new Score("i'm next to the target", ({ creep }): number => {
      const dest = Game.getObjectById(this.targetId as Id<AnyCreep>);

      if (!dest) return -Infinity;

      return (50 - creep.pos.getRangeTo(dest.pos)) / 50;
    }));

    this.scores.push(new Score("base value", (): number => 10));

    this.scores.push(new Score("healers first", (): number => {
      const target = Game.getObjectById(this.targetId as Id<Creep>);

      if (!target) return -Infinity;

      if (!("getActiveBodyparts" in target)) return 0.5;

      const healParts = target.getActiveBodyparts(HEAL);
      return healParts / (healParts + 1);
    }));
  }
}