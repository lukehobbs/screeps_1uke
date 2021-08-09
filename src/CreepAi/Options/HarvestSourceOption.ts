import { Score } from "../../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull } from "../BaseOptions/MoveTo";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { HarvestOption } from "../BaseOptions/Harvest";

export class HarvestSourceOption extends HarvestOption<Source> {
  constructor(destinationId: string) {
    super(`Harvest source ${destinationId}`, destinationId);

    this.scores = [];

    this.scores.push(new Score("distance to source", ({ creep }: IContext): number => {
      const sourcePos = Game.getObjectById(destinationId as Id<Source>)?.pos;
      return Number((sourcePos ? !creep.pos.isNearTo(sourcePos) : true) && -200);
    }));

    this.scores.push(new Score("distance to source", ({ creep }: IContext): number => {
      const sourcePos = Game.getObjectById(destinationId as Id<Source>)?.pos;
      return Number((sourcePos ? creep.pos.isNearTo(sourcePos) : true) && 200);
    }));

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && -175);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && 175);
    }));

    this.scores.push(new Score("free inventory space", ({ creep: { store } }: IContext): number => {
      return Number(store.getFreeCapacity(RESOURCE_ENERGY));
    }));
  }
}