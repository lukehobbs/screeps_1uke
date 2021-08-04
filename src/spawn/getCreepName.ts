import random_name from "node-random-name";

export const getCreepName = (role: string | null): string | null => {
  if (role === undefined || role === null) {
    return null;
  }
  if (role === "harvester") {
    return `Farmer ${random_name({ first: true })}`;
  }
  else if (role === "builder") {
    return `${random_name({ first: true })} the Builder`;
  }
  else if (role === "hauler") {
    return `Muscle ${random_name({ first: true })}`;
  }
  else if (role === "runner") {
    return `Sprinter ${random_name({ first: true })}`;
  }
  else {
    return `${_.capitalize(role!)} ${random_name({ first: true })}`;
  }
};