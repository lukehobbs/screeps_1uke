export import CreepMemory = NodeJS.CreepMemory;
export import Global = NodeJS.Global;
export import Memory = NodeJS.Memory;

export declare namespace NodeJS {
  interface Global {
    log: string;
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
    role: string;
    room: string;
    working: string;
    _trav: any | undefined;
    unloading: boolean;
    repairing: boolean;
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
