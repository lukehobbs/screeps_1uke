import { RESOURCE_ENERGY } from "../../../../test/unit/constants";
import { Scores } from "../../Scores/Scores";
import { UnloadLinkSelector } from "../Selectors/UnloadLinkSelector";
import { Score } from "../../../UtilityAi/Score";

export class UnloadLinkOption extends UnloadLinkSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ creep }) => {
      if (creep.getActiveBodyparts(CARRY) === 0) return false;

      const link = Game.getObjectById(this.destinationId as Id<StructureLink>);
      if (!link) return false;

      if (link.pos.findInRange(FIND_STRUCTURES, 3).filter(s => s.structureType === STRUCTURE_STORAGE).length === 0) return false;

      return link.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    });

    this.scores = [];

    this.scores.push(new Scores.CreepFreeCapacityLinear());

    this.scores.push(new Score("proximity", ({ creep }: IContext): number => {
      const link = Game.getObjectById(this.destinationId as Id<StructureLink>);
      if (!link) return -Infinity;

      return (49 - creep.pos.getRangeTo(link)) / 49;
    }));

    this.scores.push(new Score("link capacity", (): number => {
      const link = Game.getObjectById(this.destinationId as Id<StructureLink>);
      if (!link) return -Infinity;

      return link.store.getUsedCapacity(RESOURCE_ENERGY) / link.store.getCapacity(RESOURCE_ENERGY);
    }));
  }
}