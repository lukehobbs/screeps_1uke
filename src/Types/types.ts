declare global {
  interface RoomMemory {
    planned: boolean | undefined;
    spawn: ScreepsObj<RoomPosition>;
    paths: CommonPaths;
    work: WorkDetails;
    bootstrapped: boolean | undefined;
    stats: RoomStats | undefined;
  }
}

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
    stats: RoomStats | undefined;
  }

  interface Memory {
    creeps: { [name: string]: CreepMemory };
    powerCreeps: { [name: string]: PowerCreepMemory };
    flags: { [name: string]: FlagMemory };
    rooms: { [name: string]: RoomMemory };
    spawns: { [name: string]: SpawnMemory };
  }

  interface CreepMemory {
    room: string | undefined;
    _trav: any | undefined;
  }

}

export interface ScreepsObj<T> {
  id: string;
  obj: T;
}

export interface RoomStats {
  lastUpdated: number;
  output: number;
  outputEfficiency: number;
  harvestEvents: number;
  lastHarvestEvents: number;
  maxOutput: number;
  lastOutput: number;
  interval: number;
}

export interface WorkDetails {
  sources: ScreepsObj<RoomPosition>[];
  controllers: ScreepsObj<RoomPosition>[];
  numSources: number | undefined;
  openSpacesPerSource: ScreepsObj<RoomPosition[]>[];
  outputParts: number | undefined;
}

export interface CommonPaths {
  spawnToSources: RoomPosition[][];
  spawnToControllers: RoomPosition[][];
  sourcesToControllers: RoomPosition[][];
}

export import CreepMemory = NodeJS.CreepMemory;
export import Global = NodeJS.Global;
export import Memory = NodeJS.Memory;
export import RoomMemory = NodeJS.RoomMemory;