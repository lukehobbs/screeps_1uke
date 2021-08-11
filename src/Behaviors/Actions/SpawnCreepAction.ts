import { Action, ActionStatus } from "../../UtilityAi/Action";

export class CreepType {
  body: BodyPartConstant[];
  name: string;
  opts: SpawnOptions;

  constructor(body: BodyPartConstant[], name: string, opts: SpawnOptions) {
    this.body = body;
    this.name = name;
    this.opts = opts;
  }
}

export class SpawnCreepAction extends Action {
  private readonly type: CreepType;

  constructor(type: CreepType) {
    super();
    this.type = type;
  }

  run(context: IContext): ActionStatus {
    const spawn = Game.getObjectById(context.room.memory.spawn.id as Id<StructureSpawn>);

    if (!spawn) return ActionStatus.FAILURE;
    if (spawn.spawning) return ActionStatus.RUNNING;

    const err = spawn.spawnCreep(this.type.body, this.type.name, this.type.opts);

    if (err === OK) {
      context.room.memory.lastSpawned = Game.time;
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}