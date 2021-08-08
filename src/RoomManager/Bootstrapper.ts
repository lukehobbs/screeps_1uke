import { CreepMemory, RoomMemory } from "../types/types";
import { log } from "../utils/log";
import BootstrapRole from "../roles/BootstrapRole";
import random_name from "node-random-name";

namespace Bootstrapper {
  export const bootstrap = (room: Room, roomMemory: RoomMemory): void => {
    if (!roomMemory.spawn) {
      log.error("Bootstrap Error: room memory is missing spawn");
      return;
    }
    const spawn = Game.getObjectById(roomMemory.spawn.id as Id<StructureSpawn>);
    if (!spawn) {
      log.error(`Bootstrap Error: no spawn with ID ["${roomMemory.spawn}"] found`);
      return;
    }

    if (BootstrapRole.nextLoadDestination(roomMemory) !== undefined) {
      spawn.spawnCreep([WORK, CARRY, MOVE], random_name({ first: true }));
    } else if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      roomMemory.bootstrapped = true;
    }

    room.find(FIND_MY_CREEPS).forEach(creep => BootstrapRole.control(creep, creep.memory as CreepMemory));
  };
}

export default Bootstrapper;