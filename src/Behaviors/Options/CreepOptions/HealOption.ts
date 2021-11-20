import { Score } from "../../../UtilityAi/Score";
import { HealSelector } from "../Selectors/HealSelector";

export class HealOption extends HealSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }: IContext): boolean => creep.getActiveBodyparts(HEAL) > 0;

    this.scores = [];

    this.scores.push(new Score("base value", (): number => 1));
  }
}