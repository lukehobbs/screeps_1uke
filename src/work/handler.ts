import * as builder from "../roles/builder";
import * as harvester from "../roles/harvester";
import * as hauler from "../roles/hauler";
import * as runner from "../roles/runner";
import { CreepMemory } from "../types/types";

export const workHandler = ((): void => {
  const creeps = _.collect(Game.creeps);

  creeps.forEach((creep) => {
    const c = creep as Creep;
    const cMemory = c.memory as CreepMemory;

    if (cMemory.role === "harvester") {
      harvester.execute(c);
    } else if (cMemory.role === "hauler") {
      hauler.execute(c);
    } else if (cMemory.role === "builder") {
      builder.execute(c);
    } else if (cMemory.role === "runner") {
      runner.execute(c);
    }

    // TODO: creep recycling!!
    // if (!!c.ticksToLive && c.ticksToLive < 100) {
    //   Game.spawns['Home'].renewCreep(c);
    // }
  });
});
