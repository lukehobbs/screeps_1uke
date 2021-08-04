import { SpawnCreepParams } from "../types/types";
import { maybeGetNextBuilder } from "./maybeGetNextBuilder";
import { maybeGetNextHarvester } from "./maybeGetNextHarvester";
import { maybeGetNextHauler } from "./maybeGetNextHauler";

export const getNextCreep = (spawn?: StructureSpawn | undefined, dryRun: boolean = true): SpawnCreepParams | undefined => {
  const harvester = maybeGetNextHarvester(spawn, dryRun);
  const hauler = maybeGetNextHauler(spawn, dryRun);
  const builder = maybeGetNextBuilder(spawn, dryRun);

  return harvester ?? hauler ?? builder;
};


