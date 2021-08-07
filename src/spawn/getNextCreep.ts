import { HARVESTER, HAULER } from "../constants";
import { SpawnCreepParams } from "../types/types";
import { maybeGetNextBuilder } from "./maybeGetNextBuilder";
import { maybeGetNextHarvester } from "./maybeGetNextHarvester";
import { maybeGetNextHauler } from "./maybeGetNextHauler";

export const getNextCreep = (spawn?: StructureSpawn | undefined, dryRun: boolean = true): SpawnCreepParams | undefined => {
  const harvester = maybeGetNextHarvester(spawn, dryRun);
  const hauler = maybeGetNextHauler(spawn, dryRun);
  const builder = maybeGetNextBuilder(spawn, dryRun);

  const creepsWithRole = _.countBy(Game.creeps, "memory.role");

  if ((creepsWithRole[HARVESTER] ?? 0) == 0) {
    return harvester;
  }
  if ((creepsWithRole[HAULER] ?? 0) === 0) {
    return hauler;
  }

  return harvester ?? hauler ?? builder;
};


