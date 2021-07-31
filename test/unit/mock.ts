// noinspection JSUnusedGlobalSymbols

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

export const mockRoom: RoomPosition = {
  roomName: "Room1",
  x: 10,
  y: 10,
} as RoomPosition;
