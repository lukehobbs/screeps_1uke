import { Action, ActionStatus } from "../../UtilityAi/Action";

export class LinkTransferAction extends Action {
  private readonly targetId: string;

  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<StructureLink>);
    if (!target) return ActionStatus.FAILURE;

    const err = context.link.transferEnergy(target);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      console.log(err);
      return ActionStatus.FAILURE;
    }
  }
}