import { PickupOption } from "./GenericOptions/PickupOption";
import { inventoryIsFull } from "./GenericOptions/MoveOption";
import { Score } from "../UtilityAi/Score";

export class PickupEnergyOption extends PickupOption {
  constructor(destinationId: string) {
    super(`pickup energy at ${destinationId}`, destinationId);

    this.condition = (({ creep }) => !inventoryIsFull(creep));

    this.scores = [];

    this.scores.push(new Score("proximity to destination", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);
      if (!dest) return -Infinity;

      return Number(creep.pos.getRangeTo(dest.pos) === 1 && 200);
    }));
  }
}