import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { FillExtensionSelector } from "../Selectors/FillExtensionSelector";

export class FillExtensionOption extends FillExtensionSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ room, creep }) => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      return room.find(FIND_STRUCTURES).filter((s) => {
        return s.structureType == STRUCTURE_EXTENSION && (s as StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }).length > 0;
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

      return (15 - creep.pos.getRangeTo(dest.pos)) / 15;
    }));

    this.scores.push(new Score("extension has room", (): number => {
      const dest = Game.getObjectById(this.destinationId as Id<StructureExtension>);

      if (!dest) return -100;

      const extensionStore = (dest as StructureExtension).store

      return extensionStore.getUsedCapacity(RESOURCE_ENERGY) === extensionStore.getCapacity(RESOURCE_ENERGY) ? -100 : 0;
    }));
  }
}