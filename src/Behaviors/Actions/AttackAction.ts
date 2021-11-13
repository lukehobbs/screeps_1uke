import { Action, ActionStatus } from "../../UtilityAi/Action";

export class AttackAction extends Action {
  targetId: string;


  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<AnyCreep>);

    if (!target) return ActionStatus.FAILURE;

    const err = context.creep.attack(target);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}