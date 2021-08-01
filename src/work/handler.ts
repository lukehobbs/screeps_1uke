import * as harvester from "../roles/harvester";
import * as hauler from "../roles/hauler";
import { CreepMemory } from "../types";

export const workHandler = ((): void => {
  const creeps = _.collect(Game.creeps);

  creeps.forEach((creep) => {
    const c = creep as Creep;
    const cMemory = c.memory as CreepMemory;

    if (cMemory.role === "harvester") {
      harvester.execute(c);
    } else if (cMemory.role === "hauler") {
      hauler.execute(c);
    }
  });
});
