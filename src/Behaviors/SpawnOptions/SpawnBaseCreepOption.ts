import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../Actions/SpawnCreepAction";

export class SpawnBaseCreepOption extends SpawnCreepOption {
  constructor() {
    super(`Spawn base creep`, ({
      body: [WORK, WORK, CARRY, MOVE],
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.scores.push(new Score("inventory is full", ({ spawn }: IContext): number => {
      return Number(spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && 100);
    }));

    this.scores.push(new Score("extension(s) exist", ({ room }: IContext): number => {
      return Number(room.find(FIND_STRUCTURES).find(s => s.structureType === STRUCTURE_EXTENSION) && -100);
    }));

    this.scores.push(new Score("sources are busy", ({ room }: IContext): number => {
      const { work } = room.memory;

      const currentWorkParts = _.sum(
        _.filter(_.values(Game.creeps) as Creep[], ({ body }) => body.map(({ type }) => type).includes(WORK))
          .map(({ body }) => body.filter(({ type }) => type === WORK).length));

      return currentWorkParts >= (work.outputParts! * 1.5) ? -100 : 0;
    }));
  }
}