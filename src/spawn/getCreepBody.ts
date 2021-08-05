import { CARRY, FIND_STRUCTURES, MOVE, RESOURCE_ENERGY, WORK } from "../../test/unit/constants";
import { BUILDER, HARVESTER, HAULER } from "../constants";
import { log } from "../utils/log";
import { bodyCost } from "../utils/helpers";

const BEST_HARVESTER_BODY = [
  MOVE, MOVE, MOVE,
  WORK, WORK, WORK, WORK, WORK
];

const BEST_HAULER_BODY = [
  MOVE, MOVE,
  WORK, WORK, WORK, WORK, WORK,
  CARRY, CARRY, CARRY
]

const BEST_BUILDER_BODY = [
  MOVE, MOVE, MOVE,
  WORK, WORK, WORK, WORK, WORK,
  CARRY, CARRY
]

export const getCreepBody = (role: string): BodyPartConstant[] => {
  let bodyParts: BodyPartConstant[] = [];
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);

  if (role == HARVESTER && spawn.room.energyAvailable >= bodyCost(BEST_HARVESTER_BODY)) {
    log.debug(`Next creep bodyparts: ${JSON.stringify(BEST_HARVESTER_BODY)}`);
    return BEST_HARVESTER_BODY;
  }

  if (role == HAULER && spawn.room.energyAvailable >= bodyCost(BEST_HAULER_BODY)) {
    log.debug(`Next creep bodyparts: ${JSON.stringify(BEST_HAULER_BODY)}`);
    return BEST_HAULER_BODY;
  }

  if (role == BUILDER && spawn.room.energyAvailable >= bodyCost(BEST_BUILDER_BODY)) {
    log.debug(`Next creep bodyparts: ${JSON.stringify(BEST_BUILDER_BODY)}`);
    return BEST_BUILDER_BODY
  }

  const extensions = spawn?.room?.find(FIND_STRUCTURES)
    ?.filter((x) => x.structureType === STRUCTURE_EXTENSION && x.store.getFreeCapacity(RESOURCE_ENERGY) === 0) as StructureExtension[] | null;

  const fullExtensions = extensions?.filter((extension) => extension.store.getFreeCapacity(RESOURCE_ENERGY) === 0);

  if (!fullExtensions) {
    bodyParts.push(CARRY, WORK, MOVE);
  } else {
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