import { RoomMemory } from "./types/types";

namespace RoomManager {

  export const bootstrap = (room: Room, roomMemory: RoomMemory) => {
    console.assert(!!roomMemory.spawn);
    const spawn = _.find(Game.spawns, s => s.id === roomMemory.spawn![0]);

    const creeps = room.find(FIND_MY_CREEPS);

  }

}

export default RoomManager;