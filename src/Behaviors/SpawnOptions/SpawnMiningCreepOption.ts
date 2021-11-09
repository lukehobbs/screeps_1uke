import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../Actions/SpawnCreepAction";
import RoomStatistics from "../../Room/RoomStats";
import findWorstMiner = RoomStatistics.findWorstMiner;

export class SpawnMiningCreepOption extends SpawnCreepOption {
  constructor(room: Room) {
    let bodyParts: string[] = [CARRY, MOVE, MOVE];
    const numExtensions = room.find(FIND_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_EXTENSION }}).length;
    const workPartsSupported = numExtensions * 0.5 - 1;
    for (let i=0; i< workPartsSupported; i++) {
      bodyParts.push(WORK);
    }
    super(`Spawn mining creep`, ({
      body: bodyParts,
      name: "Miner " + random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.condition = (context: IContext): boolean => {
      if ((Game.time - context.room.memory.lastSpawned) < 120 || context.spawn.spawning) return false;
      if (context.spawn.spawning) return false;
      if (_.any(context.room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_EXTENSION && (s as StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) > 0)))
        return false;

      return _.any(context.room.find(FIND_MY_CREEPS), ({ body }): boolean => {
        return _.contains(body.map(b => b.type), CARRY);
      });
    }

    this.scores.push(new Score("inventory is full", ({ spawn }: IContext): number => {
      return Number(spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && 100);
    }));

    this.scores.push(new Score("better miners exist", (context: IContext): number => {
      const worstMiner = findWorstMiner(context.room)
      const worstMinerWorkParts = worstMiner?.body?.filter(({ type }: BodyPartDefinition) : boolean => type == WORK)?.length
      const newMinerWorkParts = this.creepType.body.filter((part: BodyPartConstant) : boolean => part == WORK).length
      return worstMinerWorkParts < newMinerWorkParts ? 1 : -100
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