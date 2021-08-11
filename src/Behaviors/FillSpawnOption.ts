import { Score } from "../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { FillSpawnSelector } from "./Selectors/FillSpawnSelector";

export class FillSpawnOption extends FillSpawnSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ creep, spawn }) => {
      return spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0;
    });

    this.scores = [];

    this.scores.push(new Score("energy onboard", ({ creep: { store } }: IContext): number => {
      return (25 - store.getUsedCapacity(RESOURCE_ENERGY)) / 25;
    }));

    this.scores.push(new Score("proximity to spawn", ({ creep, spawn }): number => {
      // (MAX_RANGE - ACTUAL) / MAX_RANGE ~ y = -x
      return (25 - creep.pos.getRangeTo(spawn.pos)) / 25;
    }));
  }
}