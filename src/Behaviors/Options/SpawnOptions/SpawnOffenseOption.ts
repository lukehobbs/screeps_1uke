import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";
import { Scores } from "../../Scores/Scores";

export class SpawnOffenseOption extends SpawnCreepOption {
  constructor(room: Room) {
    let budget = room.energyAvailable;

    const offenseGear = [CLAIM, HEAL];
    let offenseGearCost = _.sum(offenseGear, b => BODYPART_COST[b as BodyPartConstant]);

    const moveGear = [MOVE, MOVE];
    let moveGearCost = _.sum(moveGear, b => BODYPART_COST[b as BodyPartConstant]);

    let moveParts = [];
    let bodyParts = [];

    while (budget >= offenseGearCost + moveGearCost) {

      if (budget >= offenseGearCost + moveGearCost) {
        bodyParts.push(...offenseGear);
        budget -= offenseGearCost;
        moveParts.push(...moveGear);
        budget -= moveGearCost;
      }
      if (budget >= BODYPART_COST[HEAL] + BODYPART_COST[MOVE]) {
        bodyParts.push(HEAL);
        moveParts.push(MOVE);
        budget -= BODYPART_COST[HEAL] + BODYPART_COST[MOVE];
      } else break;

    }

    moveParts.push(...bodyParts);

    super(`Spawn offense`, ({
      body: moveParts,
      name: random_name({ first: true }),
      opts: { memory: { target: "5bbcae659099fc012e638f06", targetRoom: "E25S13" } } // TODO: un-hardcode this
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      if (this.creepType.body === [] || this.creepType.body === null || spawn.spawning) return false;

      const creeps = Game.rooms["E25S13"]?.find(FIND_MY_CREEPS).filter(c => c.getActiveBodyparts(CLAIM) > 0);
      if (!!creeps && creeps.length >= 1) return false;

      if (room.energyAvailable === room.energyCapacityAvailable) {
        const offenseInThisRoom = room.find(FIND_MY_CREEPS).filter(c => c.memory.targetRoom !== undefined && c.memory.targetRoom === "E25S13" && c.getActiveBodyparts(CLAIM) > 0).length;
        return offenseInThisRoom > 0 ? false : room.memory?.spawnOffense === true;
      }
      return false;
    };

    this.scores.push(new Scores.Default(1));
  }
}