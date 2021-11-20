import { Score } from "../../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../../test/unit/constants";
import { FillExtensionSelector } from "../Selectors/FillExtensionSelector";
import { Scores } from "../../Scores/Scores";

export class FillExtensionOption extends FillExtensionSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ creep }) => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      // if (_.values(Game.creeps).length > 9) return false;
      const ext = Game.getObjectById(destinationId as Id<StructureExtension>);

      if (!ext) return false;

      return ext.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    });

    this.scores = [];

    this.scores.push(new Score("proximity to extension", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<StructureExtension>);

      if (!dest) return -100;

      return (50 - creep.pos.getRangeTo(dest.pos)) / 50;
    }));

    this.scores.push(new Score("fullness", (): number => {
      const dest = Game.getObjectById(this.destinationId as Id<StructureExtension>);

      if (!dest) return -100;

      return dest.store.getFreeCapacity(RESOURCE_ENERGY) / dest.store.getCapacity(RESOURCE_ENERGY);
    }));
    this.scores.push(new Scores.CreepUsedCapacityLinear());
    this.scores.push(new Scores.SpawnUsedCapacityLinear());
  }
}