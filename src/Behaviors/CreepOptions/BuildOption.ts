import { Score } from "../../UtilityAi/Score";
import { BuildSelector } from "../Selectors/BuildSelector";

export class BuildOption extends BuildSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }: IContext): boolean => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) return false

      const constructionSite = Game.getObjectById(destinationId as Id<Source>);
      if (!constructionSite) return false;

      return creep.pos.getRangeTo(constructionSite.pos) < 10;
    };

    this.scores = [];

    this.scores.push(new Score("i'm next to a construction site", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<ConstructionSite>);

      if (!dest) return -Infinity;

      return (50 - creep.pos.getRangeTo(dest.pos)) / 50 * 0.75;
    }));

    this.scores.push(new Score("", ():number => {
      const dest = Game.getObjectById(this.destinationId as Id<ConstructionSite>);

      if (!dest) return -Infinity;

      return dest.progress / dest.progressTotal;
    }));

    // this.scores.push(new Score("this is a construction site for an extension", (): number => {
    //   const dest = Game.getObjectById(this.destinationId as Id<StructureExtension>);
    //
    //   if (!dest) return -Infinity;
    //
    //   return dest.structureType === STRUCTURE_EXTENSION ? 1 : dest.structureType === STRUCTURE_TOWER ? 1 : 0;
    // }));
  }
}