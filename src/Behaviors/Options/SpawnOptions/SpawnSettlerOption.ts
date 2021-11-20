import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";
import { Scores } from "../../Scores/Scores";

export class SpawnSettlerOption extends SpawnCreepOption {
  constructor(room: Room) {
    let budget = room.energyAvailable * 0.75;
    let bodyParts = [];
    let settlerGear = [CLAIM, MOVE];
    let settlerGearCost = _.sum(settlerGear, b => BODYPART_COST[b as BodyPartConstant]);

    while (budget >= settlerGearCost) {
      if (budget >= settlerGearCost) {
        bodyParts.push(CLAIM, MOVE);
        budget -= settlerGearCost;
      } else break;
    }

    let manualArgs: string[] = [];

    if (room.memory.spawnSettler) {
      manualArgs = room?.memory?.spawnSettler?.split(",") || [];
    }
    if (manualArgs.length < 2) bodyParts = [];

    super(`Spawn settler`, ({
      body: bodyParts,
      name: random_name({ first: true }),
      opts: { memory: { target: manualArgs[0], targetRoom: manualArgs[1] } }
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      if (this.creepType.body === [] || this.creepType.body === null) return false;
      if (spawn.spawning) return false;
      if (_.any(Game.creeps, (c: Creep) => c.getActiveBodyparts(CLAIM) > 0)) return false;
      return room.memory?.spawnSettler !== null && room.memory.spawnSettler !== undefined;
    };

    this.scores.push(new Scores.Default(1));
  }
}