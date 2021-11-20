import { Action, ActionStatus } from "../../UtilityAi/Action";

export class MoveToControllerInRoom extends Action {
  constructor() {
    super();
  }

  run({ creep }: IContext): ActionStatus {
    if (!creep.memory.targetRoom) return ActionStatus.FAILURE;

    let dest: AnyStructure | RoomPosition | null = Game.getObjectById(creep.memory.target);
    if (!dest) {
      dest = new RoomPosition(25, 25, creep.memory.targetRoom);
      if (!dest) return ActionStatus.FAILURE;
    }

    const err = creep.travelTo(dest);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}