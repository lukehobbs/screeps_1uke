// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "utils/ErrorMapper";
import { FIND_STRUCTURES, STRUCTURE_CONTROLLER } from "../test/unit/constants";
import { cleanupMemory } from "./memory/cleanupMemory";
import { getContainers, getControllers, getEnergySources, getExtensions, globalMemory } from "./memory/globalMemory";
import { log } from "./utils/log";
import { getCreepName } from "./spawn/getCreepName";
import { getNextCreep } from "./spawn/getNextCreep";
import { CreepMemory, SpawnCreepParams } from "./types/types";
import { workHandler } from "./work/handler";

export const HARVESTER = "harvester";
export const HAULER = "hauler";
export const UPGRADER = "upgrader";
export const BUILDER = "builder";
export const RUNNER = "runner";
export const SUPPORTER = "supporter";

const HOME_ROOM = "W39S55";
const HOME_SPAWN = "Home";
const NUM_RUNNERS = 1;

function manageHomeRoom() {
  const homeRoomObject = Game.rooms[HOME_ROOM];
  log.debug(`Home Room: ${JSON.stringify(homeRoomObject)}`);

  const energySources = getEnergySources(homeRoomObject);
  log.debug(`Energy sources: ${JSON.stringify(energySources)}`);

  const extensions = getExtensions(homeRoomObject);
  log.debug(`Extensions: ${JSON.stringify(extensions)}`);

  const controllers = getControllers(homeRoomObject);
  log.debug(`Controllers: ${JSON.stringify(controllers)}`);

  const containers = getContainers(homeRoomObject);
  log.debug(`Containers: ${JSON.stringify(containers)}`);

  const creepsInRoles = _.countBy(Game.creeps, (c: Creep) => (c.memory as CreepMemory).role);
  log.debug(`Creeps: ${JSON.stringify(creepsInRoles)}`);

  const spawn = Game.spawns[HOME_SPAWN];

  if (!!spawn.spawning) {
    log.action(`[${spawn.spawning.name}] Spawning..`);
  }
  else {
    let nextCreep = getNextCreep(spawn, false);
    if (!nextCreep && creepsInRoles[RUNNER] < NUM_RUNNERS) {
      nextCreep = getNextRunner();
    }
    if (!!nextCreep) {
      let err = spawn.spawnCreep(nextCreep.body, nextCreep.name, nextCreep.opts);
      if (err != OK) {
        log.error(`Can't spawn new creep [${err}]`);
      }
    }
  }
}

function getNextRunner(): SpawnCreepParams {
  return {
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    name: getCreepName(RUNNER),
    opts: { memory: { role: RUNNER } } as SpawnOptions
  } as SpawnCreepParams;
}

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();
  manageHomeRoom();
  workHandler();
});
