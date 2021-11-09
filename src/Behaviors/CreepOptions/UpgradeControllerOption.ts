import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { UpgradeControllerSelector } from "../Selectors/UpgradeControllerSelector";

export class UpgradeControllerOption extends UpgradeControllerSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }) => creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0;

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }) => {
      return creep.store.getUsedCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY);
    }));

    // this.scores.push(new Score("ticks to demote", ({room}) => {
    //   const controller = Game.getObjectById(destinationId as Id<StructureController>);
    //
    //   if (!controller) return -Infinity;
    //
    //   return (10000 - controller.ticksToDowngrade) / 10000;
    // }));

    this.scores.push(new Score("proximity to controller", ({ creep }) => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);

      if (!controller) return -Infinity;

      return (20 - creep.pos.getRangeTo(controller.pos)) / 20;
    }));

    // this.scores.push(new Score("spawn energy", ({ spawn }) => {
    //   return spawn.store.getFreeCapacity(RESOURCE_ENERGY) < 150 ? -.1 : 1;
    // }));
  }
}