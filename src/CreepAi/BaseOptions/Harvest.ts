import { Action, ActionStatus } from "../../UtilityAi/Action";
import { Option } from "../../UtilityAi/Option";

export abstract class HarvestOption<T extends HasPos> extends Option {
  action: HarvestAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new HarvestAction(destinationId);
  }
}

export class HarvestAction<T extends HasPos> extends Action {
  private readonly targetId?: string;

  constructor(targetId?: string) {
    super();
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<any>);

    if (!target) return ActionStatus.FAILURE;

    const err = context.creep.harvest(target);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}

