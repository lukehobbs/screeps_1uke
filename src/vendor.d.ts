
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

interface SpawnCreepParams {
  body: BodyPartConstant[];
  name: string;
  opts?: SpawnOptions;
}

// Syntax for adding properties to `global` (ex "global.log")
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare module "node-random-name";
