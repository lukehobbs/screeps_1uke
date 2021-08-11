import { Score } from "../UtilityAi/Score";
import { inventoryIsFull } from "./GenericOptions/MoveOption";
import { PickupSelector } from "./Selectors/PickupSelector";
import { RESOURCE_ENERGY } from "../../test/unit/constants";

export class PickupDroppedResourceOption extends PickupSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ creep }) => !inventoryIsFull(creep));

    this.scores = [];

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return (50 - creep.store.getUsedCapacity(RESOURCE_ENERGY)) / 75;
    }));

    this.scores.push(new Score("proximity to resource", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest) return 0;

      return (25 - creep.pos.getRangeTo(dest.pos)) / 25;
    }));
  }
}