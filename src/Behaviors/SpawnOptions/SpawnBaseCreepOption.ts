import { Score } from "../../UtilityAi/Score";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../Actions/SpawnCreepAction";

export class SpawnBaseCreepOption extends SpawnCreepOption {
  constructor(room: Room) {
    let energyAvailable = room.energyAvailable;

    const bodyParts = [];

    while (energyAvailable > 0) {
      if (energyAvailable >= 100) {
        bodyParts.push(WORK);
        energyAvailable -= 100;
      }
      if (energyAvailable >= 50) {
        bodyParts.push(CARRY);
        energyAvailable -= 50;
      } else break;
      if (energyAvailable >= 50) {
        bodyParts.push(MOVE);
        energyAvailable -= 50;
      } else break;
    }

    super(`Spawn base creep`, ({
      body: bodyParts,
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      return !room.memory.lastSpawned || ((Game.time - room.memory.lastSpawned) > 60 && !spawn.spawning);
    }

    this.scores.push(new Score("inventory is full", ({ spawn }: IContext): number => {
      return spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ? 1 : 0;
    }));

    this.scores.push(new Score("", (): number => {
      return 10;
    }));
  }
}