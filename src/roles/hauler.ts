import { CreepMemory } from "../types/types";
import { log } from "../utils/log";
import "../utils/traveler/traveler";

export const execute = (creep: Creep): void => {
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]) as StructureSpawn;

  const creepsWithTarget = _.countBy(Game.creeps, (c: Creep) => (c.memory as CreepMemory).working);
  const creepMemory = creep.memory as CreepMemory;
  const controller = creep.room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_CONTROLLER);

  const extensions = ((_.values(Game.structures) as OwnedStructure[])
    .filter(s => s.structureType === STRUCTURE_EXTENSION) as StructureExtension[])
    .filter(s => s.store.getFreeCapacity(RESOURCE_ENERGY) != 0 && (creepsWithTarget[s?.id as string] ?? 0) === 0);

  const creepsWorkingExtensions = _.filter(Game.creeps, (c: Creep) => {
    const mem = (c.memory as CreepMemory);
    if (mem.working === undefined) {
      return false;
    }
    else return extensions.map(x => x.id).includes(mem.working as Id<StructureExtension>);
  });

  if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) {
    if ((creepsWithTarget[spawn.id] ?? 0) === 0) {
      creepMemory.working = spawn.id;
    }
  }
  else {
    if (_.size(Game.creeps) !== 0 && extensions.length !== 0 && creepsWorkingExtensions.length < 3) {
      creepMemory.working = extensions[0].id;
    }
  }


  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    // log.action("Unloading", creep);
    creepMemory.unloading = true;
  }
  else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    // log.action("Loading", creep);
    creepMemory.unloading = false;
  }

  if (creepMemory.working === (controller[0]?.id ?? "controller") && (creepsWithTarget[controller[0]?.id] ?? 0) > 5) {
    creepMemory.working = undefined;
  }

  if (!creepMemory.working) {
    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && (creepsWithTarget[spawn?.id] ?? 0) < 1) {
      log.action("Assigned to spawn", creep);
      creepMemory.working = spawn.id;
    }
    else {
      if (extensions.length !== 0 && (creepsWorkingExtensions.length < 2)) {
        log.action("Assigned to extension", creep);
        creepMemory.working = extensions[0]?.id;
        return;
      }
      const controller = creep.room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_CONTROLLER);
      if (controller.length !== 0) {
        log.action("Assigned to controller", creep);
        creepMemory.working = controller[0]?.id;
        return;
      }
      creepMemory.working = undefined;
    }
  }
  if (creepMemory.pickupTarget) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      log.action("Can't hold any more!", creep);
      creepMemory.unloading = true;
      creepMemory.pickupTarget = undefined;
    }
    else {
      let target = Game.getObjectById(creepMemory.pickupTarget);

      if (target === undefined) {
        console.log("Can't find target");
        creepMemory.pickupTarget = undefined;
        return;
      }

      let err;
      if ((target as Structure)?.structureType === STRUCTURE_CONTAINER) {
        err = creep.withdraw(target as Structure, RESOURCE_ENERGY);
      }
      else {
        err = creep.pickup(target as Resource);
      }
      if (err === ERR_NOT_IN_RANGE) {
        let data = {} as TravelData;
        log.action("Moving to pickup target", creep);
        creep.travelTo(target as AnyStructure, { travelData: data } as TravelToOptions);
        if (!!data.state) {
          if (data.state[2] > 2) {
            log.action("stuck!", creep);
          }
          if (data.state[2] < 5) { // STATE_STUCK
            log.action("Stuck for too long", creep);
            creepMemory.working = undefined;
          }
        }
      }
      else if (err !== OK && err !== ERR_BUSY) {
        console.log(err);
        log.action("Can't find pickup target", creep);
        creepMemory.pickupTarget = undefined;
      }
    }
  }
  else if (creepMemory.unloading) {
    if (creepMemory.working) {
      const workTarget = Game.getObjectById(creepMemory.working) as Structure;
      let err = creep.transfer(workTarget, RESOURCE_ENERGY);
      if (err === ERR_NOT_IN_RANGE) {
        log.action(`Moving to work target: ${creepMemory.working}`, creep);
        creep.travelTo(workTarget);
      }
      else if (err === ERR_FULL) {
        creepMemory.working = undefined;
      }
      else if (err !== OK) {
        creepMemory.pickupTarget = undefined;
        creepMemory.unloading = false;
      }
    }
    else {
      creepMemory.unloading = false;
    }
  }
  else {
    const droppedResource = _.sortBy(creep.room.find(FIND_DROPPED_RESOURCES).filter(s => s.resourceType === RESOURCE_ENERGY),
      r => creep.pos.getRangeTo(r)
    )[0]?.id;
    const container = _.sortBy(creep.room.find(FIND_STRUCTURES)
        .filter(s => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY)),
      r => creep.pos.getRangeTo(r)
    )[0]?.id;

    creepMemory.pickupTarget = container ?? droppedResource;
  }
};
