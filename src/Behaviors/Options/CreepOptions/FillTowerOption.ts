import { Score } from "../../../UtilityAi/Score";
import { FIND_STRUCTURES, RESOURCE_ENERGY } from "../../../../test/unit/constants";
import { FillExtensionSelector } from "../Selectors/FillExtensionSelector";
import { Scores } from "../../Scores/Scores";

export class FillTowerOption extends FillExtensionSelector {
  constructor(destinationId: string) {
    super(destinationId);
    this.id = `Fill tower ${destinationId}`;

    this.condition = (({ creep, room, spawn }) => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) return false;

      const tower = Game.getObjectById(destinationId as Id<StructureTower>);
      if (!tower) return false;
      if (tower.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return false;

      return !_.any(room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_EXTENSION), (e: StructureExtension) => {
        return e.store.getFreeCapacity(RESOURCE_ENERGY) !== 0;
      });
    });

    this.scores = [];

    this.scores.push(new Score("proximity to tower", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<StructureTower>);

      if (!dest) return -100;

      return (49 - creep.pos.getRangeTo(dest.pos)) / 49;
    }));

    this.scores.push(new Scores.CreepUsedCapacityLinear());
    this.scores.push(new Scores.Default(0.5));
    this.scores.push(new Scores.TowerFreeCapacityLinear(this.destinationId));
    this.scores.push(new Score("invaders present", ({ room }): number => {
      return room.find(FIND_HOSTILE_CREEPS).length > 0 ? 1 : 0.5;
    }));
  }
}