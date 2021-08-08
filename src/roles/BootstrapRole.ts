import { CreepMemory, RoomMemory, ScreepsObj, WorkStatus } from "../types/types";
import { log } from "../utils/log";

namespace BootstrapRole {

  const Routines = {
    loadRoutine(creep: Creep, creepMemory: CreepMemory) {
      const source = Game.getObjectById(creepMemory.loadDest as Id<Source>);

      if (!source) {
        log.error(`Creep bootstrap routine error: no source with ID ["${creepMemory.loadDest}"] found`);
        creepMemory.recycling = true;
        return;
      }

      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.travelTo(source);
      }
    },

    unloadRoutine(creep: Creep, creepMemory: CreepMemory) {
      const dest = Game.getObjectById(creepMemory.unloadDest as Id<Structure>);

      if (!dest) {
        log.error(`Creep bootstrap routine error: no destination with ID ["${creepMemory.loadDest}"] found`);
        return;
      }

      if (creep.transfer(dest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.travelTo(dest);
      }
    },

    recycleRoutine(creep: Creep) {
      const spawn = Game.getObjectById((creep.room.memory as RoomMemory).spawn.id as Id<StructureSpawn>);

      if (spawn?.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.travelTo(spawn);
      }
    }
  };

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

  export function nextLoadDestination(roomMemory: RoomMemory): string | undefined {
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

  function nextUnloadDestination(roomMemory: RoomMemory) {
    // TODO: include extensions / containers if re-bootstrapping a room w/ these structures
    return roomMemory.spawn.id;
  }

  function init(creepMemory: CreepMemory, creep: Creep) {
    if (!creepMemory.unloadDest) {
      creepMemory.unloadDest = nextUnloadDestination(creep.room.memory as RoomMemory);
    }
    if (!creepMemory.loadDest) {
      creepMemory.loadDest = nextLoadDestination(creep.room.memory as RoomMemory);
    }
    if (inventoryIsEmpty(creep)) {
      creepMemory.status = WorkStatus.LOADING;
    } else {
      if (inventoryIsFull(creep)) {
        creepMemory.status = WorkStatus.UNLOADING;
      }
    }
  }

  export const control = (creep: Creep, creepMemory: CreepMemory): void => {
    init(creepMemory, creep);

    if (creepMemory.recycling) {
      Routines.recycleRoutine(creep);
    }

    const creepState = creepMemory.status;
    if (creepState === WorkStatus.LOADING) {
      Routines.loadRoutine(creep, creepMemory);
    }

    if (creepState === WorkStatus.UNLOADING) {
      Routines.unloadRoutine(creep, creepMemory);
    }
  };
}

export default BootstrapRole;
