import random_name from "node-random-name";
import { CARRY, FIND_SOURCES, MOVE, RESOURCE_ENERGY, WORK } from "../../test/unit/constants";
import { log } from "../log";
import { CreepMemory, SpawnCreepParams } from "../types";
import { getAdjacentTiles, globalMemory } from "../utils/helpers";

export const spawnHandler = (): void => {
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);
  globalMemory(Memory).targetSpawn = spawn.id;
  log(`Target spawn is ${globalMemory(Memory).targetSpawn}`);

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
    return (creep.memory as CreepMemory | null)?.role === "harvester";
  }).map(function(creep) {
    return (creep.memory as CreepMemory).working;
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
