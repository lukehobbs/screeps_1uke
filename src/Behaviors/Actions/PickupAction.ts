import { Action, ActionStatus } from "../../UtilityAi/Action";

export class PickupAction extends Action {
  private readonly destinationId: string;

  constructor(destinationId: string) {
    super();
    this.destinationId = destinationId;
  }

  run(context: IContext): ActionStatus {
    const resource = Game.getObjectById(this.destinationId as Id<Resource>);

    if (!resource) return ActionStatus.FAILURE;

    const err = context.creep.pickup(resource);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}