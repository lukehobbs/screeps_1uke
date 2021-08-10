import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull } from "./MoveOption";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { TransferOption } from "./TransferOption";

export class TransferEnergyToControllerOption extends TransferOption {
  constructor(destinationId: string) {
    super(`Transfer ${RESOURCE_ENERGY} to controller ${destinationId}`, destinationId, RESOURCE_ENERGY);

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 100);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -Infinity);
    }));

    this.scores.push(new Score("proximity to controller", ({ creep, room }: IContext): number => {
      for (let controller of room.memory.work.controllers) {
        if (creep.pos.inRangeTo(controller.obj, 2)) {
          return 500;
        }
      }
      return -Infinity;
    }));
  }
}