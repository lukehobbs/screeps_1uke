import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { FillSpawnSelector } from "../Selectors/FillSpawnSelector";

export class FillSpawnOption extends FillSpawnSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = (({ creep, spawn }) => {
      return spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0;
    });

    this.scores = [];

    this.scores.push(new Score("i'm the only creep", (): number => {
      return (_.size(_.values(Game.creeps))) == 1 ? 3 : 0
    }));

    this.scores.push(new Score("energy in spawn", ({spawn: { store }}: IContext): number => {
      const capacity = store.getCapacity(RESOURCE_ENERGY);
      return (capacity - store.getUsedCapacity(RESOURCE_ENERGY)) / capacity;
    }));

    this.scores.push(new Score("", ({ creep }) => {
      return creep.store.getUsedCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY);
    }));

    this.scores.push(new Score("proximity to spawn", ({ creep, spawn }): number => {
      const val =  (2 - creep.pos.getRangeTo(spawn.pos)) / 2;
      return val < 0 ? 0 : val;
    }));
  }
}