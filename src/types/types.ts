export declare namespace NodeJS {
  interface Global {
    log: string;
  }

  interface RoomMemory {
    planned: boolean | undefined;
    spawn: ScreepsObj<RoomPosition>;
    paths: CommonPaths;
    work: WorkDetails;
    bootstrapped: boolean | undefined;
    bootstrapping: boolean | undefined;
    stats: RoomStats | undefined;
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
    loadDest: string | undefined;
    unloadDest: string | undefined;
    status: WorkStatus | undefined;
    _trav: any | undefined;
    unloading: boolean | undefined;
    loading: boolean | undefined;
    repairing: boolean | undefined;
    pickupTarget: string | undefined;
    recycling: boolean | undefined;
  }

}

export interface ScreepsObj<T> {
  id: string;
  obj: T;
}

export enum WorkStatus {
  LOADING = 0,
  UNLOADING = 1
}

export interface RoomStats {
  lastUpdated: number;
  output: number;
  outputEfficiency: number;
  maxOutput: number;
  lastOutput: number;
  interval: number;
}

export interface WorkDetails {
  sources: ScreepsObj<RoomPosition>[];
  controllers: ScreepsObj<RoomPosition>[];
  numSources: number | undefined;
  openSpacesPerSource: ScreepsObj<number>[];
  outputParts: number | undefined;
}

export interface CommonPaths {
  spawnToSources: RoomPosition[][];
  spawnToControllers: RoomPosition[][];
  sourcesToControllers: RoomPosition[][];
}

export interface SpawnCreepParams {
  body: BodyPartConstant[];
  name: string;
  opts?: SpawnOptions;
}

export import CreepMemory = NodeJS.CreepMemory;
export import Global = NodeJS.Global;
export import Memory = NodeJS.Memory;
export import RoomMemory = NodeJS.RoomMemory;