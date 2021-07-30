// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line max-classes-per-file,camelcase
import random_name from "node-random-name";
// eslint-disable-next-line sort-imports
import { ErrorMapper } from "utils/ErrorMapper";

// Syntax for adding properties to `global` (ex "global.log")
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  interface Global {
    log: any;
  }
  interface Memory {
    uuid: number;
    log: any;
    targetSpawn: any;
  }
  interface CreepMemory {
    role: string;
    room: string;
    working: string;
  }
}

interface SpawnCreepParams {
  body: BodyPartConstant[];
  name: string;
  opts?: SpawnOptions;
}

export const clearMemory = (): void => {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
export const log = (msg: string): void => {
  console.log(`[${Game.time}]: ${msg}`);
};

export const getAdjacentTiles = (pos: RoomPosition): RoomPosition[] => {
  const adjacentTiles: RoomPosition[] = [];

  for (let x = pos.x - 1; x < pos.x + 2; x++) {
    for (let y = pos.y - 1; y < pos.y + 2; y++) {
      if (pos.x !== x && pos.y !== y) {
        adjacentTiles.push(new RoomPosition(x, y, pos.roomName));
      }
    }
  }
  return adjacentTiles;
};

export const maxSupportedHarvesters = (room: Room | undefined): Map<string, number> => {
  const energySources = room?.find(FIND_SOURCES);
  const adjacentTiles: Map<string, RoomPosition[]> = new Map<string, RoomPosition[]>();
  const maxHarvesters: Map<string, number> = new Map<string, number>();
  energySources?.forEach(source => {
    adjacentTiles.set(source.id, getAdjacentTiles(source.pos));
    let totalFreeTiles = 0;
    adjacentTiles.forEach(tiles => {
      tiles.forEach(tile => {
        if (new Room.Terrain(room?.name ?? "").get(tile.x, tile.y) !== TERRAIN_MASK_WALL) {
          totalFreeTiles++;
        }
      });
    });
    maxHarvesters.set(source.id, totalFreeTiles);
  });

  return maxHarvesters;
};

export const getCreepName = (role: string): string => {
  if (role === "harvester") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/restrict-template-expressions
    return `Farmer ${random_name({ first: true })}`;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/restrict-template-expressions
    return `${_.capitalize(role)} ${random_name({ first: true })}`;
  }
};

export const getNextCreep = (spawn?: StructureSpawn | undefined, dryRun = true): SpawnCreepParams => {
  let creepMemory: CreepMemory;

  const harvesterCountDesired = maxSupportedHarvesters(spawn?.room);

  const currentHarvesters = _.filter(Game.creeps, function (creep) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (creep.memory.role) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return creep.memory.role === "harvester";
    } else {
      return false;
    }
  }).map(function (creep) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return creep.memory.working;
  });

  harvesterCountDesired.forEach(function (desired, sourceId) {
    log(`source: ${sourceId}:${desired}`);
    const sourceHarvesters: number = currentHarvesters.filter(s => s === sourceId).length;
    log(`currentHarvesters:${sourceHarvesters}`);
    if (sourceHarvesters < desired) {
      creepMemory = new (class implements CreepMemory {
        public role = "harvester";
        public room: string = spawn?.room?.name ?? "";
        public working: string = sourceId;
      })();
    }
  });

  return new (class implements SpawnCreepParams {
    public body: BodyPartConstant[] = [WORK, CARRY, MOVE];
    public name = getCreepName(creepMemory.role);
    public opts: SpawnOptions = new (class implements SpawnOptions {
      public dryRun: boolean = dryRun;
      public memory: CreepMemory = creepMemory;
    })();
  })();
};

export const spawnHandler = (spawnId: string): void => {
  const spawn = _.find(Game.spawns, function (s) {
    return s.id === spawnId;
  });

  const energyStored = spawn?.store.getUsedCapacity(RESOURCE_ENERGY);
  const energyCapacity = spawn?.store.getCapacity(RESOURCE_ENERGY);
  log(`\tENERGY: ${energyStored?.toString() ?? 0}/${energyCapacity?.toString() ?? 0}`);

  const creepCounts = new Map();
  spawn?.room.find(FIND_MY_CREEPS).forEach(creep => {
    const memory: any = creep.memory;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    creepCounts.set(memory.role, creepCounts.get(memory.role));
  });
  log(`\tCREEPS: ${JSON.stringify(creepCounts, null, 4)}`);

  const nextCreep = getNextCreep(spawn, false);
  if (nextCreep.opts !== undefined) {
    spawn?.spawnCreep(nextCreep.body, nextCreep.name, nextCreep.opts);
    log(`Spawning new creep:`);
    log(`\tbody:\t:${JSON.stringify(nextCreep.body)}`);
    log(`\tname:\t:${nextCreep.name}`);
    log(`\topts:\t:${JSON.stringify(nextCreep.opts)}`);
  }
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access
  log(`Target spawn is ${Memory.targetSpawn}`);
  clearMemory();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Memory.targetSpawn = (
    _.filter(Game.spawns, function (spawn) {
      return spawn.store.energy.valueOf() > 150;
    })[0] ?? [{ id: "" }]
  ).id;
  console.log(Memory.targetSpawn);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  spawnHandler(Memory.targetSpawn);

  for (const creepsKey in Game.creeps) {
    const creep = Game.creeps[creepsKey];
    const creepMemory: any = creep.memory;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (creepMemory.role === "harvester") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (creep.harvest(Game.getObjectById(creepMemory.working) ?? Memory.targetSpawn) === ERR_NOT_IN_RANGE) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        creep.moveTo(Game.getObjectById(creepMemory.working) ?? Memory.targetSpawn);
      }
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          creep.transfer(Game.getObjectById(Memory.targetSpawn) as StructureSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          creep.moveTo(Game.getObjectById(Memory.targetSpawn) as StructureSpawn);
        }
      }
    }
  }
});
