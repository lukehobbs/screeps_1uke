import { Action, ActionStatus } from "../../UtilityAi/Action";

export class MoveAction<T extends HasPos> extends Action {
  private readonly destinationId?: string;

  constructor(destinationId?: string) {
    super();
    this.destinationId = destinationId;
  }

  run(context: IContext): ActionStatus {
    const dest = Game.getObjectById(this.destinationId as Id<T>);

    if (!dest) return ActionStatus.FAILURE;

    const err = context.creep.travelTo(dest);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}