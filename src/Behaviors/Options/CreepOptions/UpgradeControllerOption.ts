import { Score } from "../../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../../test/unit/constants";
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
    //   return (20000 - controller.ticksToDowngrade) / 20000;
    // }));

    this.scores.push(new Score("proximity to controller", ({ creep }) => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);

      if (!controller) return -Infinity;

      if (creep.pos.getRangeTo(controller.pos) === Infinity) return 0;

      return (49 - creep.pos.getRangeTo(controller.pos)) / 49;
    }));

    this.scores.push(new Score("proximity to controller", ({ creep }) => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);

      if (!controller) return -Infinity;
      if (creep.pos.getRangeTo(controller.pos) === Infinity) return 0;

      return creep.pos.inRangeTo(controller.pos, 5) ? 1 : 0.5;
    }));

    this.scores.push(new Score("number of creeps", ({ room }) => {
      const creepCount = room.find(FIND_MY_CREEPS).length;
      return creepCount / (creepCount + 1);
    }));

    this.scores.push(new Score("new room", ({ creep }) => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);
      if (!controller) return -Infinity;

      if (creep.pos.getRangeTo(controller.pos) === Infinity && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && creep.room.name !== "E23S13") return 3;
      else return 0.5;
    }));

    this.scores.push(new Score("others upgrading", ({ creep, room }: IContext): number => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);
      if (!controller) return -Infinity;
      const cPos = controller.pos;
      if (creep.pos.inRangeTo(controller.pos, 3)) return 1;
      if (creep.pos.getRangeTo(controller.pos) === Infinity) return 0.5;
      const creepsUpgrading = room.lookForAtArea(LOOK_CREEPS, cPos.y - 3, cPos.x - 3, cPos.y + 3, cPos.x + 3, true).length;
      // TODO: calculate max spots for upgraders instead of hard coding to 7
      if (creepsUpgrading >= 7) return -1;
      return 0.75;
    }));

    this.scores.push(new Score("ticks to downgrade", (): number => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);
      if (!controller) return -Infinity;
      return controller.ticksToDowngrade < 5000 ? 0.75 : 0.7;
    }));
  }
}