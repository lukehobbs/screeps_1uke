import { Action, ActionStatus } from "../../UtilityAi/Action";

export class RecycleAction extends Action {
  spawnId: string;

  constructor(spawnId: string) {
    super();
    this.spawnId = spawnId;
  }

  run(context: IContext): ActionStatus {
    const spawn = Game.getObjectById(this.spawnId as Id<StructureSpawn>);

    if (!spawn) return ActionStatus.FAILURE;

    const err = spawn.recycleCreep(context.creep)

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}