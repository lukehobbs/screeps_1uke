import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { CreepType, SpawnCreepOption } from "../BaseOptions/SpawnCreep";
import random_name from "node-random-name";

export class SpawnBaseCreepOption extends SpawnCreepOption {
  constructor() {
    super(`Spawn base creep`, ({
      body: [WORK, CARRY, MOVE],
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.scores.push(new Score("spawn cooldown", ({ room: { memory: { lastSpawned } } }: IContext): number => {
      return Number((Game.time - lastSpawned) < 120 && -100);
    }));

    this.scores.push(new Score("inventory is full", ({ spawn }: IContext): number => {
      return Number((spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0) && 100);
    }));

    this.scores.push(new Score("is busy spawning", ({ spawn }: IContext): number => {
      return Number(spawn?.spawning && -200);
    }));

    this.scores.push(new Score("extension(s) exist", ({ room }: IContext): number => {
      return Number(room.find(FIND_STRUCTURES).find(s => s.structureType === STRUCTURE_EXTENSION) && -50);
    }));

    this.scores.push(new Score("sources are busy", ({ room }: IContext): number => {
      const work = room.memory.work;

      const currentWorkParts = _.sum(
        _.filter(_.values(Game.creeps) as Creep[], c => c.body.map(b => b.type).includes(WORK))
          .map(c => c.body.filter(b => b.type === WORK).length));

      if (currentWorkParts >= work.outputParts!) {
        return -Infinity;
      } else {
        return 0;
      }
    }));
  }
}