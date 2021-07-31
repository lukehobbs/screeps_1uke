import { ErrorMapper } from "utils/ErrorMapper";
import { log } from "./log";
import { spawnHandler } from "./spawn/handler";
import { workHandler } from "./work/handler";

export const cleanupMemory = (): void => {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};

export const loop = ErrorMapper.wrapLoop(() => {
  log("Cleaning up memory...");
  cleanupMemory();
  log("Spawning creeps...");
  spawnHandler();
  log("Putting creeps to work...");
  workHandler();
});
