import { Option } from "../UtilityAi/Option";
import { Score } from "../UtilityAi/Score";
import { DoNothingAction } from "./Actions/DoNothingAction";


export class DoNothingOption extends Option {
  action: DoNothingAction;

  constructor() {
    super("do-nothing", []);
    this.action = new DoNothingAction();
    this.scores.push(new Score("default", (): number => 0));
  }
}

