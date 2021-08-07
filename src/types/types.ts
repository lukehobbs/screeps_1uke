export import CreepMemory = NodeJS.CreepMemory;
export import Global = NodeJS.Global;
export import Memory = NodeJS.Memory;
export import RoomMemory = NodeJS.RoomMemory;
export import WorkDetails = NodeJS.WorkDetails;
export import CommonPaths = NodeJS.CommonPaths;

export declare namespace NodeJS {
  interface Global {
    log: string;
  }

  interface RoomMemory {
    planned: boolean | undefined;
    spawn: [string, RoomPosition] | undefined;
    paths: CommonPaths;
    work: WorkDetails;
    bootstrapped: boolean | undefined;
  }

  interface WorkDetails {
    sources: [string, RoomPosition][] | undefined;
    controllers: [string, RoomPosition][] | undefined;
    numSources: number | undefined;
    outputPartsPerSource: [string, number][] | undefined;
    outputParts: number | undefined;
  }

  interface CommonPaths {
    spawnToSources: PathStep[][] | undefined;
    spawnToControllers: PathStep[][] | undefined;
    sourcesToControllers: PathStep[][] | undefined;
  }

  interface Memory {
    creeps: { [name: string]: CreepMemory };
    powerCreeps: { [name: string]: PowerCreepMemory };
    flags: { [name: string]: FlagMemory };
    rooms: { [name: string]: RoomMemory };
    spawns: { [name: string]: SpawnMemory };
    targetSpawn: any;
    homeSpawn: any;
    energySources: Id<Source>[];
    extensions: Id<Structure>[];
    controllers: Id<Structure>[];
    containers: Id<Structure>[];
    containersLastChecked: number;
  }

  interface CreepMemory {
    role: string | undefined;
    room: string | undefined;
    working: string | undefined;
    _trav: any | undefined;
    unloading: boolean | undefined;
    repairing: boolean | undefined;
    pickupTarget: string | undefined;
    recycling: boolean | undefined;
  }

  const RESOURCE_ENERGY: ResourceConstant;
  const FIND_SOURCES: FindConstant;
  const WORK: BodyPartConstant;
  const MOVE: BodyPartConstant;
  const CARRY: BodyPartConstant;
}

export interface SpawnCreepParams {
  body: BodyPartConstant[];
  name: string;
  opts?: SpawnOptions;
}
