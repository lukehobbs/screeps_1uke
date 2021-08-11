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
      return (75 - creep.store.getUsedCapacity(RESOURCE_ENERGY)) / 75;
    }));
  }
}