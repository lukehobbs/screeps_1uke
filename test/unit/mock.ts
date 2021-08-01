// noinspection JSUnusedGlobalSymbols
import { FIND_SOURCES, TERRAIN_MASK_WALL } from "./constants";

export const Game: {
  creeps: { [name: string]: any };
  rooms: any;
  spawns: { [name: string]: any };
  time: any;
} = {
  creeps: {},
  rooms: {},
  spawns: {
    Spawn1: {
      id: "6102fd9ee80e97c0e6553dbb",
      room: {
        name: "W49S6",
        energyAvailable: 300,
        energyCapacityAvailable: 300,
        visual: { roomName: "W49S6" },
        find(c: FindConstant) {
          return [];
        }
      },
      pos: { x: 19, y: 38, roomName: "W49S6" },
      name: "Spawn1",
      spawning: null,
      store: {
        energy: 300, getCapacity() {
          return 300;
        }
      },
      owner: { username: "1uke" },
      my: true,
      hits: 5000,
      hitsMax: 5000,
      structureType: "spawn",
      spawnCreep(body: BodyPartConstant[], name: string, opts?: SpawnOptions) {
        return 0;
      }
    }
  },
  time: 12345
};

export const Memory: {
  targetSpawn: any;
  creeps: { [name: string]: CreepMemory };
  powerCreeps: { [name: string]: PowerCreepMemory };
  flags: { [name: string]: FlagMemory };
  rooms: { [name: string]: RoomMemory };
  spawns: { [name: string]: SpawnMemory };
} = {
  flags: {}, powerCreeps: {}, rooms: {}, spawns: {},
  targetSpawn: undefined,
  creeps: {}
};

export const mockRoomPosition1: RoomPosition = {
  roomName: "Room1",
  x: 29,
  y: 34
} as RoomPosition;

export const mockRoomPosition2: RoomPosition = {
  roomName: "Room1",
  x: 21,
  y: 3
} as RoomPosition;

export const mockSource1: Source = {
  id: "source1",
  pos: mockRoomPosition1
} as Source;

export const mockSource2: Source = {
  id: "source2",
  pos: mockRoomPosition2
} as Source;

export const mockRoom: Room = {
  name: "Room1",
  find<K extends FindConstant>(type: K, opts?: FilterOptions<K>): Array<FindTypes[K]> {
    if (type === FIND_SOURCES) {
      return [mockSource1, mockSource2] as Array<FindTypes[K]>;
    }
    return [];
  },
  getTerrain(): RoomTerrain {
    return mockRoomTerrain;
  }
} as Room;

export const mockRoomTerrain: RoomTerrain = {
  get(x: number, y: number): 0 | TERRAIN_MASK_WALL {
    if (x === 22 && y === 4) return 0;
    if (x === 28 && y === 33) return 0;
    if (x === 29 && y === 33) return 0;
    if (x === 30 && y === 33) return 0;
    else return TERRAIN_MASK_WALL;
  }
} as RoomTerrain;
