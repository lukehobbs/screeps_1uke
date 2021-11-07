import { UtilityAi } from "./UtilityAi/UtilityAi";
import { FillSpawnOption } from "./Behaviors/CreepOptions/FillSpawnOption";
import { MineOption } from "./Behaviors/CreepOptions/MineOption";
import { UpgradeControllerOption } from "./Behaviors/CreepOptions/UpgradeControllerOption";
import { PickupDroppedResourceOption } from "./Behaviors/CreepOptions/PickupDroppedResourceOption";
import { DoNothingOption } from "./Behaviors/GenericOptions/DoNothingOption";
import { BuildOption } from "./Behaviors/CreepOptions/BuildOption";
import { GraffitiOption } from "./Behaviors/CreepOptions/GraffitiOption";
import { RecycleSelfOption } from "./Behaviors/CreepOptions/RecycleSelfOption";
import { FillExtensionOption } from "./Behaviors/CreepOptions/FillExtensionOption";

export class CreepUtilityAi extends UtilityAi {
}

export const initializeCreepOptions = (ai: CreepUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());
  // ai.addOption(new DropAllEnergyOption());

  for (let spawn of room.find(FIND_MY_SPAWNS)) {
    ai.addOption(new FillSpawnOption(spawn.id));
    ai.addOption(new RecycleSelfOption(spawn.id));
  }

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

  for (let extension of room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION}})) {
    ai.addOption(new FillExtensionOption(extension.id));
  }
};