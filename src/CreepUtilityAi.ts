import { UtilityAi } from "./UtilityAi/UtilityAi";
import { MoveToSpawnOption } from "./Behaviors/MoveToSpawnOption";
import { TransferEnergyToSpawnOption } from "./Behaviors/TransferEnergyToSpawnOption";
import { DropAllEnergyOption } from "./Behaviors/DropAllEnergyOption";
import { MoveToSourceOption } from "./Behaviors/MoveToSourceOption";
import { HarvestEnergyOption } from "./Behaviors/HarvestEnergyOption";
import { TransferEnergyToControllerOption } from "./Behaviors/TransferEnergyToControllerOption";
import { MoveToControllerOption } from "./Behaviors/MoveToControllerOption";
import { MoveToDroppedResourceOption } from "./Behaviors/MoveToDroppedResourceOption";
import { DoNothingOption } from "./Behaviors/DoNothingOption";
import { PickupEnergyOption } from "./Behaviors/PickupEnergyOption";
import { BuildConstructionSiteOption } from "./Behaviors/BuildConstructionSiteOption";

export class CreepUtilityAi extends UtilityAi {
}

export const initializeCreepOptions = (ai: CreepUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());
  ai.addOption(new MoveToSpawnOption(room.memory.spawn.id));
  ai.addOption(new TransferEnergyToSpawnOption(room.memory.spawn.id));
  ai.addOption(new DropAllEnergyOption());

  for (let source of room.memory.work.sources) {
    ai.addOption(new MoveToSourceOption(source.id));
    ai.addOption(new HarvestEnergyOption(source.id));
  }

  for (let controller of room.memory.work.controllers) {
    ai.addOption(new MoveToControllerOption(controller.id));
    ai.addOption(new TransferEnergyToControllerOption(controller.id));
  }

  for (let resource of room.find(FIND_DROPPED_RESOURCES)) {
    ai.addOption(new MoveToDroppedResourceOption(resource.id));
    ai.addOption(new PickupEnergyOption(resource.id));
  }

  for (let constructionSite of room.find(FIND_CONSTRUCTION_SITES)) {
    ai.addOption(new BuildConstructionSiteOption(constructionSite.id));
  }
};