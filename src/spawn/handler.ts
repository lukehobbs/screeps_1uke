import random_name from "node-random-name";
import { CARRY, FIND_MY_SPAWNS, FIND_STRUCTURES, MOVE, OK, RESOURCE_ENERGY, WORK } from "../../test/unit/constants";
import { log } from "../log";
import { CreepMemory, SpawnCreepParams } from "../types";
import { globalMemory, maxSupportedHarvesters } from "../utils/helpers";

export const HARVESTER = "harvester";
export const HAULER = "hauler";
export const UPGRADER = "upgrader";
export const BUILDER = "builder";

export const getCreepBody = (role: string): BodyPartConstant[] => {
  let bodyParts: BodyPartConstant[] = [];
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);

  const extensions = (spawn?.room?.find(FIND_STRUCTURES)?.filter(function(structure) {
    return structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
  }) as StructureExtension[] | null);

  const fullExtensions = extensions?.filter(function(extension) {
    return extension.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
  });

  if (fullExtensions) {
    if (role === HARVESTER) {
      let numWorkParts = (extensions?.length ?? 0) / 2; // extensions hold 50 energy and each work part costs 100
      for (let i = 0; i < numWorkParts; i++) {
        bodyParts.push(WORK);
      }
      bodyParts.push(WORK, CARRY, MOVE);
    }
    if (role === HAULER || role === BUILDER) {
      for (let i = 1; i < (extensions?.length ?? 0); i++) {
        if (i % 2 === 0) {
          bodyParts.push(CARRY);
        }
        else {
          bodyParts.push(MOVE);
        }
      }
      bodyParts.push(WORK, CARRY, MOVE);
    }
  }
  else {
    if (role === HARVESTER) {
      bodyParts.push(WORK, WORK, MOVE);
    }
    else {
      bodyParts.push(CARRY, WORK, MOVE);
    }
  }

  log(`Next creep bodyparts: ${JSON.stringify(bodyParts)}`);
  return bodyParts;
};

export const spawnHandler = (): void => {
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);
  globalMemory(Memory).targetSpawn = spawn.id;
  log(`Target spawn is ${globalMemory(Memory).targetSpawn}`);

  const energyStored = spawn?.store.energy;
  const energyCapacity = (spawn?.store && spawn.store.getCapacity(RESOURCE_ENERGY)) ?? 0;
  log(`\tENERGY: ${energyStored?.toString() ?? 0}/${energyCapacity?.toString() ?? 0}`);

  const creeps = _.countBy(Game.creeps, "memory.role");
  log(`\tCREEPS: ${JSON.stringify(creeps)}`);

  // TODO: log msg when actively spawning
  if (!spawn?.spawning) {
    const nextCreep = getNextCreep(spawn, false);
    if (nextCreep?.opts !== undefined) {
      if (!nextCreep.opts.dryRun) {
        nextCreep.opts.dryRun = true;
        const err = spawn.spawnCreep(nextCreep.body, nextCreep.name, nextCreep.opts);
        if (err !== OK) {
          log(`Can't spawn new creep (code: ${err})`);
          return;
        }
        else {
          nextCreep.opts.dryRun = false;
        }
      }
      spawn.spawnCreep(nextCreep.body, nextCreep.name, nextCreep.opts);
      log(`Spawning new creep:`);
      log(`\tbody:\t${JSON.stringify(nextCreep.body)}`);
      log(`\tname:\t${nextCreep.name}`);
      log(`\topts:\t${JSON.stringify(nextCreep.opts)}`);
    }
  }
};

export const getCreepName = (role: string | null): string | null => {
  if (role === undefined || role === null) {
    return null;
  }
  if (role === HARVESTER) {
    return `Farmer ${random_name({ first: true })}`;
  }
  else if (role === BUILDER) {
    return `${random_name({ first: true })} the Builder`;
  }
  else if (role === HAULER) {
    return `Muscle ${random_name({ first: true })}`;
  }
  else {
    return `${_.capitalize(role!)} ${random_name({ first: true })}`;
  }
};

function getDesiredHaulers(room: Room | undefined): Map<string, number> | undefined {
  if (room === undefined) return undefined;
  let structures: Map<string, number> = new Map();

  const controller = room.find(FIND_STRUCTURES).filter(function(structure) {
    return structure.structureType === STRUCTURE_CONTROLLER;
  })[0] as StructureController;
  const spawn = room.find(FIND_MY_SPAWNS)[0] as StructureSpawn;

  if (spawn !== undefined) structures.set(spawn.id, 1);
  structures.set("extensions", 1);
  if (controller !== undefined) structures.set(controller.id, 4);

  return structures;
}

export const getNextCreep = (spawn?: StructureSpawn | undefined, dryRun: boolean = true): SpawnCreepParams | undefined => {

  function maybeGetNextHarvester(): SpawnCreepParams | undefined {
    let creepMemory: CreepMemory;
    let spawnParams: SpawnCreepParams | undefined;
    const currentHarvesters = _.filter(Game.creeps, function(creep: Creep) {
      return (creep.memory as CreepMemory | null)?.role === "harvester";
    }).map(function(creep) {
      return (creep.memory as CreepMemory).working;
    });
    const harvesterCountDesired = maxSupportedHarvesters(spawn?.room);

    // TODO: reconcile this and the getAdjacent tile stuff that sends 1 creep per open space
    // problem is 1 creep with lots of WORK parts can harvest most of the energy in a single source
    // ..so no need to send more than 1 (need to test)
    if (currentHarvesters.length < 2) {
      harvesterCountDesired.forEach(function(desired: number, sourceId: string) {
        const sourceHarvesters: number = currentHarvesters.filter(s => s === sourceId).length;

        if (sourceHarvesters < (desired)) {
          // @ts-ignore TODO: workaround for missing _trav here
          creepMemory = new (class implements CreepMemory {
            public role = "harvester";
            public room: string = spawn?.room?.name ?? "";
            public working: string = sourceId;
          })();

          if (spawnParams === undefined) {
            spawnParams = new (class implements SpawnCreepParams {
              public body: BodyPartConstant[] = getCreepBody(creepMemory?.role);
              public name = getCreepName(creepMemory?.role) ?? "";
              public opts: SpawnOptions = new (class implements SpawnOptions {
                public dryRun: boolean = dryRun;
                public memory: CreepMemory = creepMemory;
              })();
            })();
          }
        }
      });
    }
    return spawnParams;
  }

  function maybeGetNextHauler(): SpawnCreepParams | undefined {
    let creepMemory: CreepMemory;
    let spawnParams: SpawnCreepParams | undefined;
    const currentHaulers = _.filter(Game.creeps, function(creep: Creep) {
      return (creep.memory as CreepMemory | null)?.role === "hauler";
    }).map(function(creep) {
      return (creep.memory as CreepMemory).working;
    });
    const haulerCountDesired = getDesiredHaulers(spawn?.room);

    haulerCountDesired?.forEach(function(desired: number, sourceId: string) {
      const sourceHaulers: number = currentHaulers.filter(s => s === sourceId).length;

      if (sourceHaulers < desired) {
        // @ts-ignore TODO: missing _trav
        creepMemory = new (class implements CreepMemory {
          public role = "hauler";
          public room: string = spawn?.room?.name ?? "";
          public working: string = sourceId;
        })();

        if (spawnParams === undefined) {
          spawnParams = new (class implements SpawnCreepParams {
            public body: BodyPartConstant[] = getCreepBody(creepMemory?.role);
            public name = getCreepName(creepMemory?.role) ?? "";
            public opts: SpawnOptions = new (class implements SpawnOptions {
              public dryRun: boolean = dryRun;
              public memory: CreepMemory = creepMemory;
            })();
          })();
        }
      }
    });

    return spawnParams;
  }

  function maybeGetNextBuilder(): SpawnCreepParams | undefined {
    let creepMemory: CreepMemory;
    let spawnParams: SpawnCreepParams | undefined;

    const currentBuilders = _.filter(Game.creeps, function(creep: Creep) {
      return (creep.memory as CreepMemory | null)?.role === "builder";
    }).map(function(creep) {
      return (creep.memory as CreepMemory).working;
    });

    const constructionSites = _.values(Game.constructionSites);

    if (currentBuilders.length < constructionSites.length && currentBuilders.length < 3) {
      // @ts-ignore TODO: workaround for missing _trav here
      creepMemory = new (class implements CreepMemory {
        public role = "builder";
        public room: string = spawn?.room?.name ?? "";
      })();

      if (spawnParams === undefined) {
        spawnParams = new (class implements SpawnCreepParams {
          public body: BodyPartConstant[] = getCreepBody(creepMemory?.role);
          public name = getCreepName(creepMemory?.role) ?? "";
          public opts: SpawnOptions = new (class implements SpawnOptions {
            public dryRun: boolean = dryRun;
            public memory: CreepMemory = creepMemory;
          })();
        })();
      }
    }
    return spawnParams;
  }

  const harvester = maybeGetNextHarvester();
  const hauler = maybeGetNextHauler();
  const builder = maybeGetNextBuilder();

  return harvester ?? hauler ?? builder;
};
