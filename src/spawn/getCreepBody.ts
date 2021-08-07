import { CARRY, MOVE, WORK } from "../../test/unit/constants";
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
];

const BEST_BUILDER_BODY = [
  MOVE, MOVE, MOVE,
  WORK, WORK, WORK, WORK, WORK,
  CARRY, CARRY
];

const BASE_CREEP_BODY = [WORK, CARRY, MOVE];

export const getCreepBody = (role: string): BodyPartConstant[] => {
  const spawn = _.first(_.values(Game.spawns) as StructureSpawn[]);

  let energyAvailable = (spawn.room.energyAvailable ?? 0);
  if (role == HARVESTER && energyAvailable >= bodyCost(BEST_HARVESTER_BODY)) {
    log.debug(`Next creep bodyparts: ${JSON.stringify(BEST_HARVESTER_BODY)}`);
    return BEST_HARVESTER_BODY;
  }

  if (role == HAULER && energyAvailable >= bodyCost(BEST_HAULER_BODY)) {
    log.debug(`Next creep bodyparts: ${JSON.stringify(BEST_HAULER_BODY)}`);
    return BEST_HAULER_BODY;
  }

  if (role == BUILDER && energyAvailable >= bodyCost(BEST_BUILDER_BODY)) {
    log.debug(`Next creep bodyparts: ${JSON.stringify(BEST_BUILDER_BODY)}`);
    return BEST_BUILDER_BODY;
  }

  return BASE_CREEP_BODY;
};