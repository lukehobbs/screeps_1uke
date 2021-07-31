import random_name from "node-random-name";
import { ErrorMapper } from "utils/ErrorMapper";
import { CARRY, FIND_SOURCES, MOVE, RESOURCE_ENERGY, WORK } from "../test/unit/constants";
import * as harvester from "./roles/harvester";
import CreepMemory = NodeJS.CreepMemory;
import Memory = NodeJS.Memory;

declare namespace NodeJS {
  interface Global {
    log: any;
  }

  interface Memory {
    creeps: {[name: string]: CreepMemory};
    powerCreeps: {[name: string]: PowerCreepMemory};
    flags: {[name: string]: FlagMemory};
    rooms: {[name: string]: RoomMemory};
    spawns: {[name: string]: SpawnMemory};
    targetSpawn: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: string;
  }

  const RESOURCE_ENERGY: ResourceConstant;
  const FIND_SOURCES: FindConstant;
  const WORK: BodyPartConstant;
  const MOVE: BodyPartConstant;
  const CARRY: BodyPartConstant;
}

interface SpawnCreepParams {
  body: BodyPartConstant[];
  name: string;
  opts?: SpawnOptions;
}

export const clearMemory = (): void => {
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
      if (pos.x !== x || pos.y !== y) {
        const position = _.clone(pos)
        position.x = x;
        position.y = y;
        adjacentTiles.push(position);
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
    adjacentTiles.set(source.id.toString(), getAdjacentTiles(source.pos));
    let totalFreeTiles = 0;
    adjacentTiles.forEach(tiles => {
      tiles.forEach(tile => {
        if (new Room.Terrain(room?.name ?? "").get(tile.x, tile.y) !== TERRAIN_MASK_WALL) {
          totalFreeTiles++;
        }
      });
    });
    maxHarvesters.set(source.id.toString(), totalFreeTiles);
  });
  return maxHarvesters;
};

export const getCreepName = (role: string | null): string | null => {
  if (role === undefined || role === null) {
    return null;
  }
  if (role === "harvester") {
    return `Farmer ${random_name({ first: true })}`;
  } else {
    return `${_.capitalize(role!)} ${random_name({ first: true })}`;
  }
};

export const getNextCreep = (spawn?: StructureSpawn | undefined, dryRun = true): SpawnCreepParams => {
  let creepMemory: CreepMemory;

  const harvesterCountDesired = maxSupportedHarvesters(spawn?.room);

  const currentHarvesters = _.filter(Game.creeps, function(creep) {
    // @ts-ignore
    if (creep.memory !== undefined) {
      // @ts-ignore
      return creep.memory.role === "harvester";
    } else {
      return false;
    }
  }).map(function(creep) {
    // @ts-ignore
    return creep.memory["working"];
  });

  harvesterCountDesired.forEach(function(desired, sourceId) {
    const sourceHarvesters: number = currentHarvesters.filter(s => s === sourceId).length;

    if (sourceHarvesters < desired) {
      creepMemory = new (class implements CreepMemory {
        public role = "harvester";
        public room: string = spawn?.room?.name ?? "";
        public working: string = sourceId;
      })();
    }
  });

  return new class implements SpawnCreepParams {
    public body: BodyPartConstant[] = [WORK, CARRY, MOVE];
    public name = getCreepName(creepMemory?.role) ?? "";
    public opts: SpawnOptions = new (class implements SpawnOptions {
      public dryRun: boolean = dryRun;
      public memory: CreepMemory = creepMemory;
    })();
  }();
};

export const spawnHandler = (): void => {
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);
  const globalMemory = (Memory as unknown as Memory);
  globalMemory.targetSpawn = spawn.id;
  log(`Target spawn is ${globalMemory.targetSpawn}`);

  const energyStored = spawn?.store.energy;
  const energyCapacity = (spawn?.store && spawn.store.getCapacity(RESOURCE_ENERGY)) ?? 0;
  log(`\tENERGY: ${energyStored?.toString() ?? 0}/${energyCapacity?.toString() ?? 0}`);

  const creeps = _.countBy(Game.creeps, "memory.role");
  log(`\tCREEPS: ${JSON.stringify(creeps)}`);

  if (!spawn?.spawning) {
    const nextCreep = getNextCreep(spawn, false);
    if (nextCreep.opts !== undefined) {
      spawn.spawnCreep(nextCreep.body, nextCreep.name, nextCreep.opts);
      log(`Spawning new creep:`);
      log(`\tbody:\t:${JSON.stringify(nextCreep.body)}`);
      log(`\tname:\t:${nextCreep.name}`);
      log(`\topts:\t:${JSON.stringify(nextCreep.opts)}`);
    }
  }
};

export const commandCreeps = ((): void => {
  const creeps = _.filter(Game.creeps, true);

  creeps.forEach((creep): void => {
    const creepMemory = creep.memory as CreepMemory;

    if (creepMemory.role === "harvester") {
      harvester.execute(creep);
    }
  });
});

export const loop = ErrorMapper.wrapLoop(() => {
  clearMemory();
  spawnHandler();
  commandCreeps();
});
