import { Action, ActionStatus } from "../../UtilityAi/Action";

export class MineAction extends Action {
  private readonly targetId: string;

  constructor(targetId: string) {
    super();
    this.targetId = targetId;
  }

  run({ creep, room }: IContext): ActionStatus {
    const target = Game.getObjectById(this.targetId as Id<Source>);
    if (!target) return ActionStatus.FAILURE;

    const err = creep.harvest(target);
    let linkErr = undefined;

    const link = _.first(creep.pos.findInRange(FIND_STRUCTURES, 1).filter(s => s.structureType === STRUCTURE_LINK));
    if (link) {
      linkErr = creep.transfer(link, RESOURCE_ENERGY);
    }
    // Mining directly into containers causes some creeps to mine indefinitely -- ignoring other jobs bc they don't have energy
    else if (_.values(room.find(FIND_MY_CREEPS)).length > 3) {
      creep.drop(RESOURCE_ENERGY);
    }

    if (linkErr !== OK && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) creep.drop(RESOURCE_ENERGY);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}