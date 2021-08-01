import { log } from "../log";
import { CreepMemory } from "../types";
import { globalMemory } from "../utils/helpers";
import "../utils/traveler/traveler";

export function execute(creep: Creep): void {
  const targetId = (creep.memory as CreepMemory).working;
  const targetSource = Game.getObjectById(targetId) as Source;
  const spawnId = globalMemory(Memory).targetSpawn;
  const spawn = Game.spawns[spawnId] as StructureSpawn;

  let err: ScreepsReturnCode = creep.harvest(targetSource);
  if (err === ERR_NOT_IN_RANGE) {
    log(`Moving to: ${targetSource.id}`, creep);
    creep.travelTo(targetSource);
  }
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    err = creep.transfer(spawn, RESOURCE_ENERGY);
    if (err === ERR_NOT_IN_RANGE) {
      creep.travelTo(spawn);
    } else if (err !== OK) {
      creep.drop(RESOURCE_ENERGY);
    }
  }
}
