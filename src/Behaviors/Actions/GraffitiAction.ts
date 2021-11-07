import { Action, ActionStatus } from "../../UtilityAi/Action";

export class GraffitiAction extends Action {
  controllerId: string;

  constructor(controllerId: string) {
    super();
    this.controllerId = controllerId;
  }

  run(context: IContext): ActionStatus {
    const controller = Game.getObjectById(this.controllerId as Id<StructureController>);

    if (!controller) return ActionStatus.FAILURE;

    const err = context.creep.signController(controller, "Hello world :^)");

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}