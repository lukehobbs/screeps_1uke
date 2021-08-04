import { CreepMemory, SpawnCreepParams } from "../types";
import { getCreepBody } from "./getCreepBody";
import { getCreepName } from "./getCreepName";
import { maybeGetNextHarvester } from "./maybeGetNextHarvester";
import { maybeGetNextHauler } from "./maybeGetNextHauler";

export const getNextCreep = (spawn?: StructureSpawn | undefined, dryRun: boolean = true): SpawnCreepParams | undefined => {
  const harvester = maybeGetNextHarvester(spawn, dryRun);
  const hauler = maybeGetNextHauler(spawn, dryRun);
  const builder = maybeGetNextBuilder(spawn, dryRun);

  return harvester ?? hauler ?? builder;
};

function maybeGetNextBuilder(spawn: StructureSpawn | undefined, dryRun: boolean): SpawnCreepParams | undefined {
  const currentBuilders =
    _.filter(Game.creeps, (creep: Creep) => (creep.memory as CreepMemory | null)?.role === "builder")
    .map(creep => (creep.memory as CreepMemory).working);

  const constructionSites = _.values(Game.constructionSites);

  if (currentBuilders.length < constructionSites.length && currentBuilders.length < 3) {
    return {
      body: getCreepBody("builder"),
      name: getCreepName("builder") ?? "",
      opts: {
        dryRun: dryRun,
        memory: {
          role: "builder",
          room: spawn?.room?.name ?? ""
        } as CreepMemory
      } as SpawnOptions
    };
  }
  return undefined;
}


