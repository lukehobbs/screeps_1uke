import { Action, ActionStatus } from "../../UtilityAi/Action";

export class UnloadLinkAction extends Action {
  private readonly targetId: string;

  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run(context: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<StructureLink>);
    if (!target) return ActionStatus.FAILURE;

    const err = context.creep.withdraw(target, RESOURCE_ENERGY);
    const storage = _.first(context.creep.pos.findInRange(FIND_STRUCTURES, 3).filter(s => s.structureType === STRUCTURE_STORAGE));
    if (storage) {
      if (context.creep.pos.getRangeTo(storage) > 1) context.creep.moveTo(storage);
      context.creep.transfer(storage, RESOURCE_ENERGY);
    }

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      // console.log(err);
      return ActionStatus.FAILURE;
    }
  }
}