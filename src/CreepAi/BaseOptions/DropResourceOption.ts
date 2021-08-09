import { Option } from "../../UtilityAi/Option";
import { Action, ActionStatus } from "../../UtilityAi/Action";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";

export abstract class DropResourceOption extends Option {
  action: DropAction;

  protected constructor(id: string, resourceType: ResourceConstant = RESOURCE_ENERGY) {
    super(id, []);
    this.action = new DropAction(resourceType);
  }
}

class DropAction extends Action {
  resourceType: ResourceConstant;

  constructor(resourceType?: ResourceConstant) {
    super();
    this.resourceType = resourceType ?? RESOURCE_ENERGY;
  }

  run(context: IContext): ActionStatus {
    const err = context.creep.drop(this.resourceType);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}

