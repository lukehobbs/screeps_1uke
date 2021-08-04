import { RUNNER } from "../constants";
import { SpawnCreepParams } from "../types/types";
import { getCreepName } from "./getCreepName";

export const getNextRunner = (): SpawnCreepParams => ({
  body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
  name: getCreepName(RUNNER),
  opts: { memory: { role: RUNNER } } as SpawnOptions
} as SpawnCreepParams);