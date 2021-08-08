// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "utils/ErrorMapper";
import { cleanupMemory } from "./memory/cleanupMemory";
import { RoomMemory } from "./types/types";
import RoomPlanner from "./RoomPlanner";
import { runCreepTask } from "./Tasks/runCreepTask";

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();

  for (const roomsKey in Game.rooms) {
    const room = Game.rooms[roomsKey];
    const roomMemory = room.memory as RoomMemory;

    if (!roomMemory.planned) {
      RoomPlanner.plan(room, roomMemory);
    }

    for (const creep in Game.creeps) {
      runCreepTask(Game.creeps[creep]);
    }
  }
});
