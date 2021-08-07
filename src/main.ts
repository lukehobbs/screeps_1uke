// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "utils/ErrorMapper";
import { HOME_ROOM, HOME_SPAWN, DESIRED_RUNNERS, RUNNER } from "./constants";
import { cleanupMemory } from "./memory/cleanupMemory";
import { getContainers, getControllers, getEnergySources, getExtensions } from "./memory/globalMemory";
import { getNextCreep } from "./spawn/getNextCreep";
import { getNextRunner } from "./spawn/getNextRunner";
import { CreepMemory } from "./types/types";
import { log } from "./utils/log";
import { workHandler } from "./work/handler";

// TODO:
//    1. Better control of creep assignments (should assign creep to closest unassigned work target)
//    2. Road builder creep (should track commonly used paths and build roads along them)
//    3. Better control over creep body parts (should determine needed bodyparts by comparing existing creep's parts with desired efficiency (based on room structures))
//    4. Containers need some more attention
//    5. Repairing
//    6. Make all creeps move to the water cooler before starting job (avoid traffic jams near spawn tunnel)
//    13/2. Refactor creep spawning so no creeps are assigned jobs until they reach the water cooler
//    7. Expand to more rooms
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

  const creepsWithRole = _.countBy(Game.creeps, (c: Creep) => (c.memory as CreepMemory).role);
  log.debug(`Creeps: ${JSON.stringify(creepsWithRole)}`);

  const spawn = Game.spawns[HOME_SPAWN];

  if (!spawn.spawning) {
    let nextCreep = getNextCreep(spawn, false);
    if (!nextCreep && DESIRED_RUNNERS > (creepsWithRole[RUNNER] ?? 0)) {
      nextCreep = getNextRunner();
    }
    if (!!nextCreep) {
      let err = spawn.spawnCreep(nextCreep.body, nextCreep.name, nextCreep.opts);
      if (err != OK) {
        log.error(`Can't spawn new creep [${err}]`);
      }
    }
  }
  else log.action("Spawning...", spawn.spawning as unknown as Creep);
};

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();
  manageHomeRoom();
  workHandler();
});
