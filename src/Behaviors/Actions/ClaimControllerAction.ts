import { Action, ActionStatus } from "../../UtilityAi/Action";

export class ClaimControllerAction extends Action {
  controllerId: string;

  constructor(controllerId: string) {
    super();
    this.controllerId = controllerId;
  }

  run({ creep }: IContext): ActionStatus {
    const controller = Game.getObjectById(creep.memory.target as Id<StructureController>);
    if (!controller) return ActionStatus.FAILURE;
    let err;
    if (controller.owner?.username !== "1uke") {
      err = creep.attackController(controller);
    } else {
      err = creep.claimController(controller);
    }

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      // console.log(err);
      return ActionStatus.FAILURE;
    }
  }
}