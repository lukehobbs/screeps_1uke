import { RESOURCE_ENERGY } from "../../../../test/unit/constants";
import { FillSpawnSelector } from "../Selectors/FillSpawnSelector";
import { Scores } from "../../Scores/Scores";

export class FillStorageOption extends FillSpawnSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.id = `Fill storage ${this.destinationId}`;

    this.condition = (({ creep }) => {
      const isNearLink = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: { structureType: STRUCTURE_LINK } }).length > 0;
      const isNearStorage = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: { structureType: STRUCTURE_STORAGE } }).length > 0;

      if (!(isNearLink && isNearStorage)) return false;

      const storage = Game.getObjectById(this.destinationId as Id<StructureStorage>);
      if (!storage) return false;

      const link = _.first(creep.pos.findInRange(FIND_STRUCTURES, 3).filter(s => s.structureType === STRUCTURE_LINK)) as StructureLink;
      if (!link) return false;
      if (link.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      if (storage.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return false;

      return creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    });

    this.scores = [];

    this.scores.push(new Scores.Default(0.2));
  }
}