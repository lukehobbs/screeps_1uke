import { CARRY, FIND_STRUCTURES, MOVE, RESOURCE_ENERGY, WORK } from "../../test/unit/constants";
import { BUILDER, HARVESTER, HAULER } from "../constants";
import { log } from "../utils/log";

export const getCreepBody = (role: string): BodyPartConstant[] => {
  let bodyParts: BodyPartConstant[] = [];
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);

  const extensions = (spawn?.room?.find(FIND_STRUCTURES) as StructureExtension[])
    ?.filter(({
                store: { getFreeCapacity },
                structureType
              }) => structureType === STRUCTURE_EXTENSION && getFreeCapacity(RESOURCE_ENERGY) === 0) as StructureExtension[] | null;

  const fullExtensions = extensions?.filter(({ store: { getFreeCapacity } }) => getFreeCapacity(RESOURCE_ENERGY) === 0);

  if (!fullExtensions) {
    bodyParts.push(CARRY, WORK, MOVE);
  }
  else {
    if (role === HARVESTER) {
      let numWorkParts = (extensions?.length ?? 0) / 2; // extensions hold 50 energy and each work part costs 100
      for (let i = 0; i < numWorkParts; i++) {
        bodyParts.push(WORK);
      }
      bodyParts.push(WORK, CARRY, MOVE);
    }
    if (role === HAULER || role === BUILDER) {
      for (let i = 1; i < (extensions?.length ?? 0); i++) {
        if (i % 2 === 0) bodyParts.push(CARRY);
        else bodyParts.push(MOVE);
      }
      bodyParts.push(WORK, CARRY, MOVE);
    }
  }

  log.debug(`Next creep bodyparts: ${JSON.stringify(bodyParts)}`);
  return bodyParts;
};