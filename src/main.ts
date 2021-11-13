// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "Utils/ErrorMapper";
import { cleanupMemory } from "./Memory/cleanupMemory";
import RoomPlanner from "./Room/RoomPlanner";
import { CreepUtilityAi, initializeCreepOptions } from "./CreepUtilityAi";
import { runOption } from "./UtilityAi/runOption";
import { initializeSpawnOptions, SpawnUtilityAi } from "./SpawnUtilityAi";
import RoomStatistics from "./Room/RoomStats";
import { RoomStats } from "./Types/types";
import { log } from "./Utils/log";
import updateStats = RoomStatistics.updateStats;

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();
  log.debug(log.colored("white", `---`));

  const spawnUtilityAi = new SpawnUtilityAi("spawn-ai");
  const creepUtilityAi = new CreepUtilityAi("creep-ai");

  let creepLogs = [];

  for (const roomsKey in Game.rooms) {
    const room = Game.rooms[roomsKey];
    const roomMemory = room.memory as RoomMemory;

    let spawn;

    if (room.controller && room.controller.my) {
      if (!roomMemory.planned) {
        RoomPlanner.plan(room, roomMemory);
      }

      if (Game.time - (roomMemory.stats?.lastUpdated ?? 0) >= (roomMemory.stats?.interval ?? 50)) {
        updateStats(room, roomMemory.stats as RoomStats);
      }
      // Can I send myself a notification if it's been X ticks since spawn and we have 0 creeps?
      log.debug(`Ticks since last spawn: ${Game.time - roomMemory.lastSpawned}`);

      initializeSpawnOptions(spawnUtilityAi, room);
      spawn = Game.getObjectById(room.memory.spawn.id);
      const spawnContext = { room, spawn, roomStats: roomMemory.stats } as IContext;
      const spawnOption = spawnUtilityAi.bestOption(spawnContext);
      runOption(spawnContext, spawnOption);
    } else continue;

    initializeCreepOptions(creepUtilityAi, room);
    for (const creep in Game.creeps) {
      if (Game.creeps[creep].spawning) continue;

      const creepContext = { creep: Game.creeps[creep], room, spawn } as IContext;
      const creepOption = creepUtilityAi.bestOption(creepContext);
      creepLogs.push(runOption(creepContext, creepOption, true));
    }

    const sortedLogs = _.sortBy(creepLogs, (logMsg) => {
      if (!logMsg) return -1;
      return _.identity(logMsg.substr(logMsg.indexOf("]") + 1, logMsg.length));
    });

    sortedLogs.forEach((msg) => {
      log.debug(msg);
    })
  }
});
