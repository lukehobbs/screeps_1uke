import random_name from "node-random-name";
import { BUILDER, HARVESTER, HAULER, RUNNER } from "../constants";

export const getCreepName = (role: string | null): string | null => {
  if (role === undefined || role === null) {
    return null;
  }
  if (role === HARVESTER) {
    return `Farmer ${random_name({ first: true })}`;
  }
  else if (role === BUILDER) {
    return `${random_name({ first: true })} the Builder`;
  }
  else if (role === HAULER) {
    return `Muscle ${random_name({ first: true })}`;
  }
  else if (role === RUNNER) {
    return `Sprinter ${random_name({ first: true })}`;
  }
  else {
    return `${_.capitalize(role!)} ${random_name({ first: true })}`;
  }
};