import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";
import { Scores } from "../../Scores/Scores";

export class SpawnWarriorOption extends SpawnCreepOption {
  constructor(room: Room) {
    let budget = room.energyAvailable;

    const attackGear = [ATTACK];
    let attackGearCost = _.sum(attackGear, b => BODYPART_COST[b as BodyPartConstant]);

    const moveGear = [MOVE];
    let moveGearCost = _.sum(moveGear, b => BODYPART_COST[b as BodyPartConstant]);

    let moveParts = [];
    let bodyParts = [];

    while (budget >= attackGearCost + moveGearCost) {

      if (budget >= attackGearCost + moveGearCost) {
        bodyParts.push(...attackGear);
        budget -= attackGearCost;
        moveParts.push(...moveGear);
        budget -= moveGearCost;
      } else break;

    }

    moveParts.push(...bodyParts);

    super(`Spawn warrior`, ({
      body: moveParts,
      name: random_name({ first: true }),
      opts: { memory: { target: "617f3c9004063f62471023af", targetRoom: "E25S13" } } // TODO: un-hardcode this
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      if (this.creepType.body === [] || this.creepType.body === null || spawn.spawning) return false;

      const creeps = Game.rooms["E25S13"]?.find(FIND_MY_CREEPS).filter(c => c.getActiveBodyparts(ATTACK) > 0);
      if (!!creeps && creeps.length > 3) return false;

      if (room.energyAvailable === room.energyCapacityAvailable) {
        const offenseInThisRoom = room.find(FIND_MY_CREEPS).filter(c => c.memory.targetRoom !== undefined && c.memory.targetRoom === "E25S13" && c.getActiveBodyparts(ATTACK) > 0).length;
        return offenseInThisRoom > 0 ? false : room.memory?.spawnWarriors === true;
      }
      return false;
    };

    this.scores.push(new Scores.Default(1.1));
  }
}