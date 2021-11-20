import { Score } from "../../../UtilityAi/Score";
import { RecycleCreepSelector } from "../Selectors/RecycleCreepSelector";

export class RecycleCreepOption extends RecycleCreepSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }: IContext): boolean => {
      return creep.memory.recycling;
    };

    this.scores = [];

    this.scores.push(new Score("manual trigger", (): number => {
      return 1;
    }));
  }
}