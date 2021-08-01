import { log } from "../log";
import { CreepMemory } from "../types";
import { distanceBetween, globalMemory } from "../utils/helpers";
import "../utils/traveler/traveler";

export function pickupClosestDroppedEnergy(spawn: StructureSpawn, creep: Creep) {
  const droppedEnergies = spawn?.room.find(FIND_DROPPED_RESOURCES)
    .filter(function(resource) {
      return resource.resourceType === RESOURCE_ENERGY;
    });

  const closestDroppedEnergy = _.sortBy(droppedEnergies, function(dropped) {
    return distanceBetween(creep.pos, dropped.pos);
  })[0];

  if (creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
    log(`Moving to dropped resources at (${closestDroppedEnergy?.pos?.x},${closestDroppedEnergy?.pos?.y})`, creep);
    creep.travelTo(closestDroppedEnergy);
  }
}

export function execute(creep: Creep): void {
  const targetId = (creep.memory as CreepMemory).working;
  // TODO: fix issues with indexing Game.spawns by Memory.targetSpawn
  //  also can probably handle multiple spawns per tick so might be irrelevant
  const spawnId = globalMemory(Memory).targetSpawn;
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);
  let targetDest = (spawn as StructureSpawn).room.find(FIND_STRUCTURES)
    .filter(function(structure) {
      return structure.id === targetId;
    })[0];

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
    } else if (targetDest.structureType === STRUCTURE_SPAWN) {
      // Carry energy to spawn
      if (creep.transfer(targetDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        log(`Moving to spawn at (${targetDest?.pos?.x},${targetDest?.pos?.y})`, creep);
        creep.travelTo(targetDest);
      }
    }
  } else {
    (creep.memory as CreepMemory).unloading = false;
    pickupClosestDroppedEnergy(spawn, creep);
  }


}
