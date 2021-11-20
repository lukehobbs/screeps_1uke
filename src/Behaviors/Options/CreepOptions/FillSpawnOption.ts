import { Score } from "../../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../../test/unit/constants";
import { FillSpawnSelector } from "../Selectors/FillSpawnSelector";

export class FillSpawnOption extends FillSpawnSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ creep, spawn }) => {
      return spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0;
    });

    this.scores = [];

    this.scores.push(new Score("i'm the only creep", ({ room }): number => {
      return room.find(FIND_MY_CREEPS).length <= 2 ? 1 : 0.5;
    }));

    this.scores.push(new Score("energy in spawn", ({ spawn: { store } }: IContext): number => {
      if (store.getUsedCapacity(RESOURCE_ENERGY) < 300) return 1;
      const capacity = store.getCapacity(RESOURCE_ENERGY);
      return (capacity - store.getUsedCapacity(RESOURCE_ENERGY)) / capacity;
    }));

    this.scores.push(new Score("", ({ creep }) => {
      return creep.store.getUsedCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY);
    }));

    this.scores.push(new Score("proximity to spawn", ({ creep, spawn }): number => {
      return (49 - creep.pos.getRangeTo(spawn.pos)) / 49;
    }));

    this.scores.push(new Score("creeps near spawn already", ({ creep, spawn }): number => {
      if (creep.pos.isNearTo(spawn)) return 1;

      const creepsNearSpawn = spawn.pos.findInRange(FIND_MY_CREEPS, 1).length;
      if (creepsNearSpawn > 1) return -1;
      return 0.7;
    }));
  }
}