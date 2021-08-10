import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull } from "./GenericOptions/MoveOption";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { TransferOption } from "./GenericOptions/TransferOption";

export class TransferEnergyToSpawnOption extends TransferOption {
  constructor(destinationId: string) {
    super(`Transfer ${RESOURCE_ENERGY} to spawn ${destinationId}`, destinationId, RESOURCE_ENERGY);

    this.scores = [];

    this.scores.push(new Score("spawn is full", ({ spawn }: IContext): number => {
      return Number((spawn.store.getFreeCapacity(RESOURCE_ENERGY) ===0 && -Infinity));
    }));

    this.scores.push(new Score("not near to spawn", ({ creep, spawn }: IContext): number => {
      return Number(!(creep.pos.getRangeTo(spawn.pos) === 1) && -Infinity);
    }));

    this.scores.push(new Score("not near to spawn", ({ creep, spawn }: IContext): number => {
      return Number((creep.pos.getRangeTo(spawn.pos) === 1) && 300);
    }));

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 175);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -Infinity);
    }));

    this.scores.push(new Score("energy onboard", ({ creep: { store } }: IContext): number => {
      return 0 - Number(store.getUsedCapacity(RESOURCE_ENERGY));
    }));
  }
}