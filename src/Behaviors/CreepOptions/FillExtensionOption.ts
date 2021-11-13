import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { FillExtensionSelector } from "../Selectors/FillExtensionSelector";

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

    this.scores.push(new Score("energy in spawn", ({spawn: { store }}: IContext): number => {
      return store.getCapacity(RESOURCE_ENERGY) == store.getUsedCapacity(RESOURCE_ENERGY) ? 1 : 0;
    }));

    this.scores.push(new Score("energy onboard", ({ creep }) => {
      return creep.store.getUsedCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY);
    }));

    this.scores.push(new Score("proximity to extension", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<StructureExtension>);

      if (!dest) return -100;

      return (50 - creep.pos.getRangeTo(dest.pos)) / 50;
    }));
  }
}