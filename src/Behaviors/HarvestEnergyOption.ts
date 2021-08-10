import { Score } from "../UtilityAi/Score";
import { HarvestOption } from "./GenericOptions/HarvestOption";

export class HarvestEnergyOption extends HarvestOption<Source> {
  constructor(destinationId: string) {
    super(`Harvest source ${destinationId}`, destinationId);

    this.condition = ({ creep }: IContext): boolean => {
      const sourcePos = Game.getObjectById(destinationId as Id<Source>)?.pos;
      return creep.pos.isNearTo(sourcePos!);
    };

    this.scores = [];

    this.scores.push(new Score("distance to source", ({ creep }: IContext): number => {
      const sourcePos = Game.getObjectById(destinationId as Id<Source>)?.pos;
      return Number((sourcePos ? creep.pos.isNearTo(sourcePos) : true) && 300);
    }));
  }
}