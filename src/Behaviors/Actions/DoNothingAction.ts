import { Action, ActionStatus } from "../../UtilityAi/Action";

export class DoNothingAction extends Action {

  constructor() {
    super();
  }

  run(context: IContext): ActionStatus {
    if (context.creep && context.creep.room && context.creep.room.controller && context.creep.room.controller.my) {
      const { x, y } = context.creep.pos;
      if (x == 0) context.creep.move(RIGHT);
      if (x == 49) context.creep.move(LEFT);
      if (y == 0) context.creep.move(BOTTOM);
      if (y == 49) context.creep.move(TOP);
    } else if (context.creep && context.creep.room && context.creep.room.controller && !context.creep.room.controller.my) {
      const { x, y } = context.creep.pos;
      if (x < 5) context.creep.move(LEFT);
      if (x > 45) context.creep.move(RIGHT);
      if (y < 5) context.creep.move(TOP);
      if (y > 45) context.creep.move(BOTTOM);
    }

    return ActionStatus.SUCCESS;
  }
}