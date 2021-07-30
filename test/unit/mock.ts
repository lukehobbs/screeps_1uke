export const Game: {
  creeps: { [name: string]: any };
  rooms: any;
  spawns: any;
  time: any;
} = {
  creeps: {},
  rooms: [],
  spawns: {
    Spawn1: {
      id: "6102fd9ee80e97c0e6553dbb",
      room: {
        name: "W49S6",
        energyAvailable: 300,
        energyCapacityAvailable: 300,
        visual: { roomName: "W49S6" }
      },
      pos: { x: 19, y: 38, roomName: "W49S6" },
      name: "Spawn1",
      energy: 300,
      energyCapacity: 300,
      spawning: null,
      store: { energy: 300 },
      owner: { username: "1uke" },
      my: true,
      hits: 5000,
      hitsMax: 5000,
      structureType: "spawn"
    }
  },
  time: 12345
};

export const Memory: {
  targetSpawn: any;
  creeps: { [name: string]: any };
} = {
  targetSpawn: undefined,
  creeps: {}
};
