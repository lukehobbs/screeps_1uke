import { Action, ActionStatus } from "../../UtilityAi/Action";

export class MineAction extends Action {
  private readonly targetId: string;

  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run({ creep }: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<Source>);

    if (!target) return ActionStatus.FAILURE;

    const err = creep.harvest(target);

    // Mining directly into containers causes some creeps to mine indefinitely -- ignoring other jobs bc they don't have energy
    if (_.values(Game.creeps).length > 5) {
      creep.drop(RESOURCE_ENERGY);
    }

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}