// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "utils/ErrorMapper";
import { HOME_ROOM, HOME_SPAWN, NUM_RUNNERS, RUNNER } from "./constants";
import { cleanupMemory } from "./memory/cleanupMemory";
import { getContainers, getControllers, getEnergySources, getExtensions } from "./memory/globalMemory";
import { getNextCreep } from "./spawn/getNextCreep";
import { getNextRunner } from "./spawn/getNextRunner";
import { CreepMemory } from "./types/types";
import { log } from "./utils/log";
import { workHandler } from "./work/handler";

const init = (room: Room) => {
  const energySources = getEnergySources(room);
  log.debug(`Energy sources: ${JSON.stringify(energySources)}`);

  const extensions = getExtensions(room);
  log.debug(`Extensions: ${JSON.stringify(extensions.map((id: string) => "-" + id.substring(16)))}`);

  const controllers = getControllers(room);
  log.debug(`Controllers: ${JSON.stringify(controllers)}`);

  const containers = getContainers(room);
  log.debug(`Containers: ${JSON.stringify(containers)}`);
};

const manageHomeRoom = () => {
  const homeRoomObject = Game.rooms[HOME_ROOM];
  log.debug(`Home Room: ${JSON.stringify(homeRoomObject)}`);

  init(homeRoomObject);

  const creepsInRoles = _.countBy(Game.creeps, (c: Creep) => (c.memory as CreepMemory).role);
  log.debug(`Creeps: ${JSON.stringify(creepsInRoles)}`);

  const spawn = Game.spawns[HOME_SPAWN];

  if (!spawn.spawning) {
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
  else log.action(`[${spawn.spawning.name}] Spawning..`);
};

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();
  manageHomeRoom();
  workHandler();
});
