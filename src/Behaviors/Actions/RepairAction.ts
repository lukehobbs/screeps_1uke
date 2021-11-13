import { Action, ActionStatus } from "../../UtilityAi/Action";

export class RepairAction extends Action {
  targetId: string;


  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<AnyStructure>);

    if (!target) return ActionStatus.FAILURE;

    const err = context.creep.repair(target);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}