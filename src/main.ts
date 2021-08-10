// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "Utils/ErrorMapper";
import { cleanupMemory } from "./Memory/cleanupMemory";
import RoomPlanner from "./Room/RoomPlanner";
import { CreepUtilityAi, initializeCreepOptions } from "./CreepUtilityAi";
import { runOption } from "./UtilityAi/runOption";
import { initializeSpawnOptions, SpawnUtilityAi } from "./SpawnUtilityAi";
import RoomStatistics from "./Room/RoomStats";
import updateStats = RoomStatistics.updateStats;
import { RoomStats } from "./Types/types";

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();

  const spawnUtilityAi = new SpawnUtilityAi("spawn-ai");
  const creepUtilityAi = new CreepUtilityAi("creep-ai");

  for (const roomsKey in Game.rooms) {
    const room = Game.rooms[roomsKey];
    const roomMemory = room.memory as RoomMemory;

    if (!roomMemory.planned) {
      RoomPlanner.plan(room, roomMemory);
    }

    if (Game.time - (roomMemory.stats?.lastUpdated ?? 0) >= (roomMemory.stats?.interval ?? 50))
      updateStats(room, roomMemory.stats as RoomStats);

    initializeSpawnOptions(spawnUtilityAi);
    const spawn = Game.getObjectById(room.memory.spawn.id);
    const spawnContext = { room, spawn, roomStats: roomMemory.stats } as IContext;
    const spawnOption = spawnUtilityAi.bestOption(spawnContext);
    // console.log(spawnOption.id);

    runOption(spawnContext, spawnOption);

    initializeCreepOptions(creepUtilityAi, room);
    for (const creep in Game.creeps) {
      const creepContext = { creep: Game.creeps[creep], room, spawn } as IContext;
      const creepOption = creepUtilityAi.bestOption(creepContext);
      // console.log(creepOption.id);

      runOption(creepContext, creepOption);
    }
  }
});
