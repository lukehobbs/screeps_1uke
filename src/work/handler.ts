import * as harvester from "../roles/harvester";
import { CreepMemory } from "../types";

export const workHandler = ((): void => {
  const creeps = _.filter(Game.creeps, true);

  creeps.forEach((creep): void => {
    const creepMemory = creep.memory as CreepMemory;

    if (creepMemory.role === "harvester") {
      harvester.execute(creep);
    }
  });
});
