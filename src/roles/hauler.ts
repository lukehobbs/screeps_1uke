import { CreepMemory } from "../types/types";
import { distanceBetween } from "../utils/helpers";
import { log } from "../utils/log";
import "../utils/traveler/traveler";

// TODO: Merge extension + spawn haulers so a single creep can manage both

// TODO: use path lengths rather than euclidean distance
export const pickupClosestDroppedEnergy = (spawn: StructureSpawn, creep: Creep): ScreepsReturnCode => {
  const droppedEnergies = spawn?.room.find(FIND_DROPPED_RESOURCES)
    .filter(function(resource) {
      return resource.resourceType === RESOURCE_ENERGY;
    });

  const closestDroppedEnergy = _.sortBy(droppedEnergies, function(dropped) {
    return distanceBetween(creep.pos, dropped.pos);
  })[0];

  const containers = _.sortBy(_.filter(Game.structures, s => s.structureType === STRUCTURE_CONTAINER), s => creep.pos.getRangeTo(s));
  if (creep.pos.getRangeTo(containers[0]) < creep.pos.getRangeTo(closestDroppedEnergy)) {
    if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      log.action(`Moving to container at (${containers[0]?.pos?.x},${containers[0]?.pos?.y})`, creep);
      return creep.travelTo(containers[0]) as ScreepsReturnCode;
    }
  }

  if (creep.pickup(closestDroppedEnergy as Resource<RESOURCE_ENERGY>) === ERR_NOT_IN_RANGE) {
    log.action(`Moving to dropped resources at (${closestDroppedEnergy?.pos?.x},${closestDroppedEnergy?.pos?.y})`, creep);
    return creep.travelTo(closestDroppedEnergy) as ScreepsReturnCode;
  }

  return 0;
};

export const execute = (creep: Creep): void => {
  const targetId = (creep.memory as CreepMemory).working;
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]) as StructureSpawn;

  let targetDest = spawn.room.find(FIND_STRUCTURES)
    .filter(structure => structure.id === targetId)[0];

  if (targetId === "extensions") {
    let extensions = spawn.room.find(FIND_STRUCTURES)
      .filter(({ structureType }) => structureType === STRUCTURE_EXTENSION) as StructureExtension[];

    extensions = _.filter(extensions, ({ store }) => store.getFreeCapacity(RESOURCE_ENERGY) !== 0);
    targetDest = _.first(_.sortBy(extensions, ({ pos }) => distanceBetween(creep.pos, pos)));

    if (targetDest === undefined) {
      log.action("Nothing to do...", creep);
      targetDest = spawn.room.find(FIND_STRUCTURES)
        .filter(({ structureType }) => structureType === STRUCTURE_CONTROLLER)[0] as StructureController;

      if (creep.upgradeController(targetDest) === ERR_NOT_IN_RANGE) {
        creep.travelTo(targetDest);
      }
      return;
    }
  }
  else {
    if (targetDest.structureType === STRUCTURE_CONTROLLER && creep.pos.isNearTo(spawn.pos)) {
      (creep.memory as CreepMemory).unloading = true;
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
        log.action(`Moving to controller at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        (creep as Creep).travelTo(targetDest);
      }
      else {
        log.action(`Upgrading controller at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
      }
    }
    else if (targetDest.structureType === STRUCTURE_SPAWN && targetDest.store.getFreeCapacity(RESOURCE_ENERGY)! > 0) {
      // Carry energy to spawn
      if (creep.transfer(targetDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        log.action(`Moving to spawn at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        creep.travelTo(targetDest);
      }
    }
    else if (targetDest.structureType === STRUCTURE_EXTENSION && targetDest.store.getFreeCapacity(RESOURCE_ENERGY)! > 0) {
      // Carry energy to extension
      if (creep.transfer(targetDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && targetDest.store.getFreeCapacity(RESOURCE_ENERGY)! > 0) {
        log.action(`Moving to extension at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        creep.travelTo(targetDest);
      }
    }
  }
  else {
    (creep.memory as CreepMemory).unloading = false;
    if (pickupClosestDroppedEnergy(spawn, creep) !== 0) {
      // go wait at the water cooler
      const waterCooler = spawn.room.find(FIND_FLAGS).find(({ name }) => name === "WaterCooler");
      log.action(`Taking a break by the water cooler`, creep);
      creep.travelTo(waterCooler as Flag);
    }
  }

};
