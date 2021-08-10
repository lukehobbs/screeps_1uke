import { PickupOption } from "./GenericOptions/PickupOption";
import { inventoryIsFull } from "./GenericOptions/MoveOption";
import { Score } from "../UtilityAi/Score";

export class PickupEnergyOption extends PickupOption {
  constructor(destinationId: string) {
    super(`pickup energy at ${destinationId}`, destinationId);

    this.scores = [];

    this.scores.push(new Score("spawn is full", ({ spawn }): number => {
      return Number((spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0) && 150);
    }));

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && -Infinity);
    }));

    this.scores.push(new Score("proximity to destination", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);
      if (!dest) return -Infinity;

      return Number(creep.pos.getRangeTo(dest.pos) === 1 && 200);
    }));
  }
}