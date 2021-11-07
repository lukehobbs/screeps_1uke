import { UtilityAi } from "./UtilityAi/UtilityAi";
import { FillSpawnOption } from "./Behaviors/FillSpawnOption";
import { MineOption } from "./Behaviors/MineOption";
import { UpgradeControllerOption } from "./Behaviors/UpgradeControllerOption";
import { PickupDroppedResourceOption } from "./Behaviors/PickupDroppedResourceOption";
import { DoNothingOption } from "./Behaviors/DoNothingOption";
import { BuildOption } from "./Behaviors/BuildOption";
import { GraffitiOption } from "./Behaviors/GraffitiOption";

export class CreepUtilityAi extends UtilityAi {
}

export const initializeCreepOptions = (ai: CreepUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());

  ai.addOption(new FillSpawnOption(room.memory.spawn.id));
  // ai.addOption(new DropAllEnergyOption());

  for (let source of room.memory.work.sources) {
    ai.addOption(new MineOption(source.id));
  }

  for (let controller of room.memory.work.controllers) {
    ai.addOption(new UpgradeControllerOption(controller.id));
    ai.addOption(new GraffitiOption(controller.id));
  }

  for (let resource of room.find(FIND_DROPPED_RESOURCES)) {
    ai.addOption(new PickupDroppedResourceOption(resource.id));
  }

  for (let constructionSite of room.find(FIND_CONSTRUCTION_SITES)) {
    ai.addOption(new BuildOption(constructionSite.id));
  }
};