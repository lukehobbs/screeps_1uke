import { Score } from "../../../UtilityAi/Score";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";

export class SpawnHealerOption extends SpawnCreepOption {
  constructor(room: Room) {
    let budget = room.energyAvailable;
    let bodyParts = [];
    const cost = BODYPART_COST[HEAL] + BODYPART_COST[MOVE];
    while (budget > cost) {
      if (budget > cost) {
        bodyParts.push(HEAL, MOVE);
        budget -= cost;
      } else break;
    }

    super(`Spawn healer`, ({
      body: bodyParts,
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      if (spawn.spawning) return false;
      if (this.creepType.body === []) return false;
      // const invaders = room.find(FIND_HOSTILE_CREEPS).length;
      // if (invaders === 0) return false;
      const defenders = room.find(FIND_CREEPS).filter(c => c.getActiveBodyparts(WORK) < c.getActiveBodyparts(ATTACK)).length;
      if (defenders === 0) {
        // if (room.energyAvailable === room.energyCapacityAvailable) {
        //   for (let i = 0; i < this.creepType.body.length; i++) {
        //     this.creepType.body.pop();
        //   }
        //   return true;
        // }
        return false;
      }

      // if (room.energyAvailable === room.energyCapacityAvailable) return true;

      const creepCount = room.find(FIND_MY_CREEPS).length;
      return Game.time - room.memory.lastSpawned > 25 * creepCount;
    };

    this.scores.push(new Score("base value", (): number => Infinity));
  }
}