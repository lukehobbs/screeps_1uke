import { Score } from "../../UtilityAi/Score";
import { log } from "../../Utils/log";

export namespace Scores {

  export class Default extends Score {
    constructor(baseValue: number) {
      super("default value", () => baseValue);
    }
  }

  export class SpawnUsedCapacityLinear extends Score {
    constructor() {
      super("Energy in spawn", ({ spawn }: IContext): number => usedCapacityScore(spawn));
    }
  }

  export class TowerUsedCapacityLinear extends Score {
    constructor(towerId: string) {
      super("Energy in tower", (): number => {
        const tower = Game.getObjectById(towerId as Id<StructureTower>);
        if (!tower) {
          log.warning(`[TowerUsedCapacityLinear] Tower not found: '${towerId}'`);
          return -Infinity;
        }
        return usedCapacityScore(tower);
      });
    }
  }

  export class TowerFreeCapacityLinear extends Score {
    constructor(towerId: string) {
      super("Free capacity in tower", (): number => {
        const tower = Game.getObjectById(towerId as Id<StructureTower>);
        if (!tower) {
          log.warning(`[TowerUsedCapacityLinear] Tower not found: '${towerId}'`);
          return -Infinity;
        }
        return freeCapacityScore(tower);
      });
    }
  }

  export class CreepUsedCapacityLinear extends Score {
    constructor() {
      super("Energy in creep", ({ creep }: IContext): number => usedCapacityScore(creep));
    }
  }

  export class CreepFreeCapacityLinear extends Score {
    constructor() {
      super("Free capacity in creep", ({ creep }: IContext): number => freeCapacityScore(creep));
    }
  }

  function usedCapacityScore(target: Creep | StructureSpawn | StructureTower): number {
    if (!("store" in target)) return -Infinity;

    const store = (target.store as Store<ResourceConstant, boolean>);
    const usedCapacity = store.getUsedCapacity(RESOURCE_ENERGY);
    const totalCapacity = store.getCapacity(RESOURCE_ENERGY);

    return !totalCapacity ? -1 : (usedCapacity / totalCapacity);
  }

  function freeCapacityScore(target: Creep | StructureSpawn | StructureTower): number {
    if (!("store" in target)) return -Infinity;

    const store = (target.store as Store<ResourceConstant, boolean>);
    const freeCapacity = store.getFreeCapacity(RESOURCE_ENERGY);
    const totalCapacity = store.getCapacity(RESOURCE_ENERGY);

    return !totalCapacity ? -1 : (freeCapacity / totalCapacity);
  }

}
