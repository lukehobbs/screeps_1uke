import { log } from "../log";
import { CreepMemory } from "../types";
import { distanceBetween, globalMemory } from "../utils/helpers";
import "../utils/traveler/traveler";

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

  if (
    (creep.pos.isNearTo(targetDest)
      || creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
    && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0
  ) {
    if (targetDest.structureType === STRUCTURE_CONTROLLER) {
      // Carry energy to controller
      if (creep.upgradeController(targetDest) === ERR_NOT_IN_RANGE) {
        log(`Moving to controller ${targetDest.id}`, creep);
        (creep as Creep).travelTo(targetDest);
      }
    } else if (targetDest.structureType === STRUCTURE_SPAWN) {
      // Carry energy to spawn
      if (creep.transfer(targetDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        log(`Moving to spawn ${targetDest.id}`, creep);
        creep.travelTo(targetDest);
      }
    }
  } else {

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


}
