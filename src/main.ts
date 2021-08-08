// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "utils/ErrorMapper";
import { cleanupMemory } from "./memory/cleanupMemory";
import { RoomMemory } from "./types/types";
import RoomPlanner from "./RoomPlanner";
import RoomManager from "./RoomManager/RoomManager";

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();

  for (const roomsKey in Game.rooms) {
    const room = Game.rooms[roomsKey];
    const roomMemory = room.memory as RoomMemory;

    if (!roomMemory.planned) {
      RoomPlanner.plan(room, roomMemory);
    }

    RoomManager.manage(room);
  }
});
