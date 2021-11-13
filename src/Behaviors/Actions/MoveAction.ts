import { Action, ActionStatus } from "../../UtilityAi/Action";

export class MoveAction<T extends HasPos> extends Action {
  private readonly destinationId?: string;

  constructor(destinationId?: string) {
    super();
    this.destinationId = destinationId;
  }

  run({ creep }: IContext): ActionStatus {
    const dest = Game.getObjectById(this.destinationId as Id<T>);

    if (!dest) return ActionStatus.FAILURE;

    // This fucks with utility functions bc inventory is fluctuating when creeps walk in a line
    // if (creep?.fatigue && creep.fatigue > 0) creep.drop(RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY) * 0.25)

    if (creep.pos.isNearTo(dest.pos)) return ActionStatus.FAILURE;

    const err = creep.travelTo(dest);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}