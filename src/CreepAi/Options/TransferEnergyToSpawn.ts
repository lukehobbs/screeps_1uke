import { Score } from "../../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull } from "../BaseOptions/MoveTo";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { TransferOption } from "../BaseOptions/TransferTo";

export class TransferEnergyToSpawn extends TransferOption<StructureSpawn> {
  constructor(destinationId: string) {
    super(`Transfer ${RESOURCE_ENERGY} to spawn ${destinationId}`, destinationId, RESOURCE_ENERGY);

    this.scores = [];

    this.scores.push(new Score("not near to spawn", ({ creep }: IContext): number => {
      const spawnPos = Game.getObjectById(destinationId as Id<StructureSpawn>)?.pos;
      return Number((spawnPos ? !creep.pos.isNearTo(spawnPos) : false) && -100);
    }));

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 175);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -100);
    }));

    this.scores.push(new Score("free inventory space", ({ creep: { store } }: IContext): number => {
      return 0 - Number(store.getFreeCapacity(RESOURCE_ENERGY));
    }));
  }
}