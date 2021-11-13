import { Action, ActionStatus } from "../../UtilityAi/Action";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";

export class PickupAction extends Action {
  private readonly destinationId: string;

  constructor(destinationId: string) {
    super();
    this.destinationId = destinationId;
  }

  run(context: IContext): ActionStatus {
    const dest = Game.getObjectById(this.destinationId as Id<AnyStructure>);
    if (!dest) return ActionStatus.FAILURE;

    let err;

    if (dest.structureType == null) {
      err = context.creep.pickup(dest);
    } else {
      err = context.creep.withdraw(dest, RESOURCE_ENERGY);
    }

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      // console.log(err);
      return ActionStatus.FAILURE;
    }
  }
}