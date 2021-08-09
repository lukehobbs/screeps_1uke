import { UtilityAi } from "../UtilityAi/UtilityAi";
import { MoveToSpawnOption } from "./Options/MoveToSpawnOption";
import { TransferEnergyToSpawn } from "./Options/TransferEnergyToSpawn";
import { DropEnergyOption } from "./Options/DropEnergyOption";
import { MoveToSourceOption } from "./Options/MoveToSourceOption";
import { HarvestSourceOption } from "./Options/HarvestSourceOption";

export class CreepUtilityAi extends UtilityAi {
}

export const initializeCreepOptions = (ai: CreepUtilityAi, room: Room) => {
  ai.addOption(new MoveToSpawnOption(room.memory.spawn.id));
  ai.addOption(new TransferEnergyToSpawn(room.memory.spawn.id));
  ai.addOption(new DropEnergyOption());

  for (let source of room.memory.work.sources) {
    ai.addOption(new MoveToSourceOption(source.id));
    ai.addOption(new HarvestSourceOption(source.id));
  }
};