import { log } from "../log";
import { CreepMemory } from "../types";
import { distanceBetween } from "../utils/helpers";
import "../utils/traveler/traveler";

// TODO: use path lengths rather than euclidean distance
export function pickupClosestDroppedEnergy(spawn: StructureSpawn, creep: Creep): ScreepsReturnCode {
  const droppedEnergies = spawn?.room.find(FIND_DROPPED_RESOURCES)
    .filter(function(resource) {
      return resource.resourceType === RESOURCE_ENERGY;
    });

  const closestDroppedEnergy = _.sortBy(droppedEnergies, function(dropped) {
    return distanceBetween(creep.pos, dropped.pos);
  })[0];

  const containers = spawn?.room.find(FIND_STRUCTURES).filter(function(structure) {
    return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
  });

  const closestContainer = _.sortBy(containers, function(container) {
    return distanceBetween(creep.pos, container.pos);
  })[0];

  if (distanceBetween(creep.pos, closestContainer.pos) < distanceBetween(creep.pos, closestDroppedEnergy.pos)) {
    if (creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      log(`Moving to container at (${closestContainer?.pos?.x},${closestContainer?.pos?.y})`, creep);
      return creep.travelTo(closestDroppedEnergy) as ScreepsReturnCode;
    }
  } else if (creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
    log(`Moving to dropped resources at (${closestDroppedEnergy?.pos?.x},${closestDroppedEnergy?.pos?.y})`, creep);
    return creep.travelTo(closestDroppedEnergy) as ScreepsReturnCode;
  }
  return 0;
}

export function execute(creep: Creep): void {
  const targetId = (creep.memory as CreepMemory).working;
  // TODO: fix issues with indexing Game.spawns by Memory.targetSpawn
  //  also can probably handle multiple spawns per tick so might be irrelevant
  // const spawnId = globalMemory(Memory).targetSpawn;
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);

  // Default action
  const container = spawn.room.find(FIND_STRUCTURES)
    .filter(function(structure) {
      return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    })[0];

  if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      // log(`Moving to container at (${container?.pos?.x},${container?.pos?.y})`, creep);
      creep.travelTo(container);
    }
  }
  
  let targetDest = (spawn as StructureSpawn).room.find(FIND_STRUCTURES)
    .filter(function(structure) {
      return structure.id === targetId;
    })[0];

  if (targetId === "extensions") {
    let extensions = (spawn as StructureSpawn).room.find(FIND_STRUCTURES)
      .filter(function(structure) {
        return structure.structureType === STRUCTURE_EXTENSION;
      }) as StructureExtension[];
    extensions = _.filter(extensions, function(extension) {
      return extension.store.getFreeCapacity(RESOURCE_ENERGY) !== 0;
    });
    targetDest = _.first(_.sortBy(extensions, function(extension) {
      return distanceBetween(creep.pos, extension.pos);
    }));
    if (targetDest === undefined) {
      log("Nothing to do...", creep);
      return;
    }
  }

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    (creep.memory as CreepMemory).unloading = false;
  }

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 || (creep.memory as CreepMemory).unloading) {
    if (targetDest.structureType === STRUCTURE_CONTROLLER) {
      (creep.memory as CreepMemory).unloading = true;
      // Carry energy to controller
      let err = creep.upgradeController(targetDest);
      if (err === ERR_NOT_IN_RANGE) {
        log(`Moving to controller at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        (creep as Creep).travelTo(targetDest);
      } else {
        log(`Upgrading controller at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
      }
    } else if (targetDest.structureType === STRUCTURE_SPAWN && targetDest.store.getFreeCapacity(RESOURCE_ENERGY)! > 0) {
      // Carry energy to spawn
      if (creep.transfer(targetDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        log(`Moving to spawn at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        creep.travelTo(targetDest);
      }
    } else if (targetDest.structureType === STRUCTURE_EXTENSION && targetDest.store.getFreeCapacity(RESOURCE_ENERGY)! > 0) {
      // Carry energy to extension
      if (creep.transfer(targetDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && targetDest.store.getFreeCapacity(RESOURCE_ENERGY)! > 0) {
        log(`Moving to extension at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        creep.travelTo(targetDest);
      }
    }
  } else {
    (creep.memory as CreepMemory).unloading = false;
    if (pickupClosestDroppedEnergy(spawn, creep) !== 0) {
      // go wait at the water cooler
      const waterCooler = spawn.room.find(FIND_FLAGS).find(function(flag) {
        return flag.name === "WaterCooler";
      });
      log(`Taking a break by the water cooler`, creep);
      creep.travelTo(waterCooler as Flag);
    }
  }


}
