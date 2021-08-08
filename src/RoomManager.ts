import { CreepMemory, RoomMemory, RoomStats } from "./types/types";
import { log } from "./utils/log";
import random_name from "node-random-name";
import Bootstrapper from "./rolesTier0/bootstrapper";
import RoomVisuals from "./RoomVisuals";

namespace RoomManager {
  const bootstrap = (room: Room, roomMemory: RoomMemory): void => {
    roomMemory.bootstrapping = true;

    const roomStats = roomMemory.stats;

    if ((roomStats?.outputEfficiency ?? 0) >= 0.5) {
      log.success("Bootstrapping completed!");
      roomMemory.bootstrapped = true;
    }

    if (!roomMemory.spawn) {
      log.error("Bootstrap Error: room memory is missing spawn");
      return;
    }
    const spawn = Game.getObjectById(roomMemory.spawn.id as Id<StructureSpawn>);
    if (!spawn) {
      log.error(`Bootstrap Error: no spawn with ID ["${roomMemory.spawn}"] found`);
      return;
    }


    spawn.spawnCreep([WORK, CARRY, MOVE], random_name({ first: true }));

    room.find(FIND_MY_CREEPS).forEach(creep => Bootstrapper.control(creep, creep.memory as CreepMemory));
  };

  function updateStats(room: Room, stats: RoomStats): void {
    const roomMemory = room.memory as RoomMemory;
    const sources = roomMemory.work.sources;
    const sourceObjs = room.find(FIND_SOURCES).filter(source => sources.map(s => s.id).includes(source.id));
    const creeps: Creep[] = _.filter(_.values(Game.creeps), (c: Creep) => {
      // TODO: maybe check for harvest events in the event log instead of position -- in case creep is standing still near source
      return _.some(sourceObjs, s => {
        const travelState = (c.memory as CreepMemory)?._trav?.state;
        const travelDestination = travelState ? new RoomPosition(travelState[4], travelState[5], s.room.name) : undefined;
        const sourceIsDestination = travelDestination
          ? travelDestination.x === s.pos.x && travelDestination.y === s.pos.y && travelDestination.roomName === s.room.name
          : false;
        return s.pos.isNearTo(c.pos) || sourceIsDestination;
      });
    });
    const energyPerTick = _.reduce(
      creeps,
      (acc: number, creep: Creep): number => {
        return acc + creep.body.filter(p => p.type === WORK).length * 2;
      },
      0
    );

    stats.lastUpdated = Game.time;
    stats.lastOutput = stats.output;
    stats.output = energyPerTick ?? 0;
    stats.outputEfficiency = stats.output / stats.maxOutput;
  }

  export const manage = (room: Room): void => {
    const roomMemory = (room.memory as RoomMemory);

    RoomVisuals.drawCommonPaths(room, roomMemory.paths);

    const stats = roomMemory.stats ?? ({} as RoomStats);
    if (Game.time - stats.lastUpdated >= stats.interval) {
      log.debug(`[${room.name}] Updating stats`);
      updateStats(room, stats);
    }

    if (stats.outputEfficiency < 0.4) {
      // Need to re-bootstrap the room
      roomMemory.bootstrapped = false;
    }

    if (!roomMemory.bootstrapped) {
      log.debug(`[${room.name}] Bootstrapping`);
      bootstrap(room, roomMemory);
    }
  };
}

export default RoomManager;
