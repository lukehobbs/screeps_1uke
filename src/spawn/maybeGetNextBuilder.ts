import { BUILDER } from "../constants";
import { CreepMemory, SpawnCreepParams } from "../types/types";
import { getCreepBody } from "./getCreepBody";
import { getCreepName } from "./getCreepName";

export const maybeGetNextBuilder = (spawn: StructureSpawn | undefined, dryRun: boolean): SpawnCreepParams | undefined => {
  const currentBuilders =
    _.filter(Game.creeps, (creep: Creep) => (creep.memory as CreepMemory | null)?.role === BUILDER)
      .map(creep => (creep.memory as CreepMemory).working);

  const constructionSites = _.values(Game.constructionSites);

  if (currentBuilders.length < constructionSites.length && currentBuilders.length < 3) {
    return {
      body: getCreepBody(BUILDER),
      name: getCreepName(BUILDER) ?? "",
      opts: {
        dryRun: dryRun,
        memory: {
          role: BUILDER,
          room: spawn?.room?.name ?? ""
        } as CreepMemory
      } as SpawnOptions
    };
  }
  return undefined;
};