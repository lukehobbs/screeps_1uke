import { Strategies } from "../Strategies/Strategy";

export const runCreepTask = (creep: Creep) => {
  if (!creep.memory.strategy || creep.spawning) return;

  Strategies[creep.memory.strategy].start(creep);
  Strategies[creep.memory.strategy].update(creep);
}