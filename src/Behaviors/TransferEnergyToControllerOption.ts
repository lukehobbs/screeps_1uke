import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull } from "./GenericOptions/MoveOption";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { TransferOption } from "./GenericOptions/TransferOption";

export class TransferEnergyToControllerOption extends TransferOption {
  constructor(destinationId: string) {
    super(`Transfer ${RESOURCE_ENERGY} to controller ${destinationId}`, destinationId, RESOURCE_ENERGY);

    this.condition = (({ creep }) => {
      const dest = Game.getObjectById(destinationId as Id<StructureController>);

      if (!dest) return false;

      return creep.pos.inRangeTo(dest.pos, 2);
    });

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 100);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -Infinity);
    }));

    this.scores.push(new Score("proximity to controller", ({ creep}: IContext): number => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);

      return controller && creep.pos.inRangeTo(controller.pos, 2) ? 500 : -Infinity;
    }));
  }
}