import { Score } from "../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { DropOption } from "./GenericOptions/DropOption";

export class DropAllEnergyOption extends DropOption {
  constructor() {
    super("drop all energy");

    this.condition = (context): boolean => {
      return context.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
    };

    this.scores = [];

    this.scores.push(new Score("default", (): number => 0));
  }
}