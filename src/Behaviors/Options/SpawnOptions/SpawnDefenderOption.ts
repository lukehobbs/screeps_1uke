import { Score } from "../../../UtilityAi/Score";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";

export class SpawnDefenderOption extends SpawnCreepOption {
  constructor(room: Room) {
    let budget = room.energyAvailable;
    let bodyParts = [];
    while (budget > 130) {
      if (budget > 130) {
        bodyParts.push(ATTACK, MOVE);
        budget -= 130;
      } else break;
    }

    super(`Spawn defender`, ({
      body: bodyParts,
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      const invaders = room.find(FIND_HOSTILE_CREEPS).length;

      if ((invaders !== 0) && this.creepType.body !== [] && room.energyAvailable === room.energyCapacityAvailable) return true;

      if (((Game.time - room.memory.lastSpawned) < (25 * room.find(FIND_MY_CREEPS).length) || spawn.spawning)) return false;

      return invaders !== 0 && this.creepType.body !== [];
    };

    this.scores.push(new Score("base value", (): number => Infinity));
  }
}