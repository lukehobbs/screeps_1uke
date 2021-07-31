import { log } from "../log";
import { CreepMemory } from "../types";
import { globalMemory } from "../utils/helpers";

function harvest(creep: Creep) {
  const targetId = (creep.memory as CreepMemory).working;
  const targetSource = Game.getObjectById(targetId) as Source;

  const err = creep.harvest(targetSource);
  if (err === ERR_NOT_IN_RANGE) {
    creep.moveTo(targetSource);
  }
}

function haul(creep: Creep) {
  const spawnId = globalMemory(Memory).targetSpawn;
  const spawn = Game.getObjectById(spawnId) as StructureSpawn;

  if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    log("Spawn is full");
    const upgradeController = spawn.room.find(FIND_STRUCTURES).filter(function(structure) {
      return structure.structureType === STRUCTURE_CONTROLLER;
    })[0] as StructureController;

    log("Upgrading controller")
    const err = creep.upgradeController(upgradeController);
    if (err === ERR_NOT_IN_RANGE) {
      log("\tmoving to controller")
      creep.moveTo(upgradeController);
    }
  } else {
    log("Transferring to spawn")
    const err = creep.transfer(spawn, RESOURCE_ENERGY);
    if (err === ERR_NOT_IN_RANGE) {
      log("\t moving to spawn")
      creep.moveTo(spawn);
    }
  }

}

export const execute = (creep: Creep): void => {
  log(`Executing harvester commands for ${creep.name}`);
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    haul(creep);
  } else {
    harvest(creep);
  }
};
