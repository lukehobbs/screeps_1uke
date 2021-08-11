import { Action, ActionStatus } from "../../UtilityAi/Action";

export class MineAction extends Action {
  private readonly targetId: string;

  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run({ creep }: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<Source>);

    if (!target) return ActionStatus.FAILURE;

    const err = creep.harvest(target);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}