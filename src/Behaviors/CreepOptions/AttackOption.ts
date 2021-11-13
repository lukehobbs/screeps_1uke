import { Score } from "../../UtilityAi/Score";
import { AttackSelector } from "../Selectors/AttackSelector";

export class AttackOption extends AttackSelector {
  constructor(targetId: string) {
    super(targetId);

    this.condition = ({ creep }: IContext): boolean => {
      return _.contains(creep.body.map(b => b.type), ATTACK);
    };

    this.scores = [];

    this.scores.push(new Score("i'm next to the target", ({ creep }): number => {
      const dest = Game.getObjectById(this.targetId as Id<AnyCreep>);

      if (!dest) return -Infinity;

      return (10 - creep.pos.getRangeTo(dest.pos)) / 10;
    }));

    this.scores.push(new Score("base value", (): number => 1.5));
  }
}