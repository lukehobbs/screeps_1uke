import { Action, ActionStatus } from "../../UtilityAi/Action";

export class RenewCreepAction extends Action {
  spawnId: string;

  constructor(spawnId: string) {
    super();
    this.spawnId = spawnId;
  }

  run({ spawn, creep }: IContext): ActionStatus {
    if (!spawn) return ActionStatus.FAILURE;

    creep.transfer(spawn, RESOURCE_ENERGY);
    const err = spawn.renewCreep(creep);


    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}