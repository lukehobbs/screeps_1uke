import random_name from "node-random-name";
import { BUILDER, HARVESTER, HAULER, RUNNER } from "../constants";

export const getCreepName = (role: string | null): string | null => {
  switch (role) {
    case HARVESTER:
      return `Farmer ${random_name({ first: true })}`;
    case BUILDER:
      return `${random_name({ first: true })} the Builder`;
    case HAULER:
      return `Muscle ${random_name({ first: true })}`;
    case RUNNER:
      return `Sprinter ${random_name({ first: true })}`;
    default:
      return `${_.capitalize(role ?? "")} ${random_name({ first: true })}`;
  }
};