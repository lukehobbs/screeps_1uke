import { Option } from "../../UtilityAi/Option";
import { Action, ActionStatus } from "../../UtilityAi/Action";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";

export abstract class TransferOption<T extends HasPos> extends Option {
  action: TransferAction<T>;

  protected constructor(id: string, destinationId: string, resourceType: ResourceConstant) {
    super(id, []);
    this.action = new TransferAction(destinationId, resourceType);
  }
}

export class TransferAction<T extends HasPos> extends Action {
  private readonly resourceType: ResourceConstant;
  private readonly targetId?: string;

  constructor(targetId?: string, resourceType?: ResourceConstant) {
    super();
    this.resourceType = resourceType ?? RESOURCE_ENERGY;
    this.targetId = targetId;
  }

  run(creep: Creep): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<any>);

    if (!target) return ActionStatus.FAILURE;

    const err = creep.transfer(target, this.resourceType);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}

