import { CreepMemory, RoomMemory, ScreepsObj, WorkStatus } from "../types/types";
import { log } from "../utils/log";

namespace Bootstrapper {
  const inventoryIsEmpty = (creep: Creep) => creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;
  const inventoryIsFull = (creep: Creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

  function creepsAssociatedWith(id: Id<any>): Creep[] {
    return _.filter(Game.creeps, ({ memory }: Creep) => {
      return (memory as CreepMemory).loadDest === id;
    });
  }

  function totalWorkParts(creepsWorkingThisSource: Creep[]) {
    return _.sum(creepsWorkingThisSource, c => c.body.filter(b => b.type === WORK).length);
  }

  function nextLoadDestination(creep: Creep): string | undefined {
    const roomMemory = creep.room.memory as RoomMemory;

    for (let i = 0; i < roomMemory.work.openSpacesPerSource.length; i++) {
      const s: ScreepsObj<number> = roomMemory.work.openSpacesPerSource[i];
      const creepsWorkingThisSource = creepsAssociatedWith(s.id as Id<Source>);
      const currentOutputParts = totalWorkParts(creepsWorkingThisSource);

      if (currentOutputParts < 5 && creepsWorkingThisSource.length < s.obj) {
        return s.id;
      }
    }
    return undefined;
  }

  function nextUnloadDestination(creep: Creep) {
    // TODO: include extensions / containers if re-bootstrapping a room w/ these structures
    return (creep.room.memory as RoomMemory).spawn.id;
  }

  function init(creepMemory: CreepMemory, creep: Creep) {
    if (!creepMemory.unloadDest) {
      creepMemory.unloadDest = nextUnloadDestination(creep);
    }
    if (!creepMemory.loadDest) {
      creepMemory.loadDest = nextLoadDestination(creep);
    }
    if (inventoryIsEmpty(creep)) {
      creepMemory.status = WorkStatus.LOADING;
    } else {
      if (inventoryIsFull(creep)) {
        creepMemory.status = WorkStatus.UNLOADING;
      }
    }
  }

  function loadRoutine(creep: Creep, creepMemory: CreepMemory) {
    log.action("load", creep);
    const source = Game.getObjectById(creepMemory.loadDest as Id<Source>);

    if (!source) {
      log.error(`Creep bootstrap routine error: no source with ID ["${creepMemory.loadDest}"] found`);
      return;
    }

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.travelTo(source);
    }
  }

  function unloadRoutine(creep: Creep, creepMemory: CreepMemory) {
    log.action("unload", creep);
    const dest = Game.getObjectById(creepMemory.unloadDest as Id<Structure>);

    if (!dest) {
      log.error(`Creep bootstrap routine error: no destination with ID ["${creepMemory.loadDest}"] found`);
      return;
    }

    if (creep.transfer(dest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.travelTo(dest);
    }
  }

  export const control = (creep: Creep, creepMemory: CreepMemory): void => {
    init(creepMemory, creep);

    const creepState = creepMemory.status;
    if (creepState === WorkStatus.LOADING) {
      loadRoutine(creep, creepMemory);
    }

    if (creepState === WorkStatus.UNLOADING) {
      unloadRoutine(creep, creepMemory);
    }
  };
}

export default Bootstrapper;
