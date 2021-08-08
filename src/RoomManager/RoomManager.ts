import { RoomMemory, RoomStats } from "../types/types";
import { log } from "../utils/log";
import RoomVisuals from "../RoomVisuals";
import RoomStatistics from "../RoomStats";
import Bootstrapper from "./Bootstrapper";

namespace RoomManager {
  const manageVisuals = (room: Room, roomMemory: RoomMemory) => RoomVisuals.drawCommonPaths(room, roomMemory.paths);

  const manageStats = (room: Room, roomMemory: RoomMemory) => {
    const stats = roomMemory.stats ?? ({} as RoomStats);
    if (Game.time - stats.lastUpdated >= stats.interval) {
      log.debug(`[${room.name}] Updating stats`);
      RoomStatistics.updateStats(room, stats);
    }
  };

  const manageBootstrapping = (room: Room, roomMemory: RoomMemory) => {
    const stats = roomMemory.stats ?? ({} as RoomStats);
    if (stats.outputEfficiency === 0) {
      // Need to re-bootstrap the room
      roomMemory.bootstrapped = false;
    }

    if (!roomMemory.bootstrapped) {
      log.debug(`[${room.name}] Bootstrapping`);
      Bootstrapper.bootstrap(room, roomMemory);
    }
  };

  export const manage = (room: Room): void => {
    const roomMemory = (room.memory as RoomMemory);

    manageVisuals(room, roomMemory);
    manageStats(room, roomMemory);
    manageBootstrapping(room, roomMemory);
  };
}

export default RoomManager;
