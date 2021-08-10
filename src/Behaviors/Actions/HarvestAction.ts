import { Action, ActionStatus } from "../../UtilityAi/Action";

export class HarvestAction<T extends HasPos> extends Action {
  private readonly targetId?: string;

  constructor(targetId?: string) {
    super();
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<any>);

    if (!target) return ActionStatus.FAILURE;

    const err = context.creep.harvest(target);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}