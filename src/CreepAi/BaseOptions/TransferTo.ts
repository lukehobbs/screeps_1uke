import { Option } from "../../UtilityAi/Option";
import { Action, ActionStatus } from "../../UtilityAi/Action";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";

export abstract class TransferOption extends Option {
  action: TransferAction;

  protected constructor(id: string, destinationId: string, resourceType: ResourceConstant) {
    super(id, []);
    this.action = new TransferAction(destinationId, resourceType);
  }
}

export class TransferAction extends Action {
  private readonly resourceType: ResourceConstant;
  private readonly targetId?: string;

  constructor(targetId?: string, resourceType?: ResourceConstant) {
    super();
    this.resourceType = resourceType ?? RESOURCE_ENERGY;
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<any>);

    if (!target) return ActionStatus.FAILURE;

    const err = context.creep.transfer(target, this.resourceType);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}
