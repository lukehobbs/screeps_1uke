import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";
import { Scores } from "../../Scores/Scores";

export class SpawnSmurfOption extends SpawnCreepOption {
  constructor(room: Room) {
    let budget = room.energyAvailable;

    const smurfGear = [WORK, CARRY];
    let smurfGearCost = _.sum(smurfGear, b => BODYPART_COST[b as BodyPartConstant]);

    const moveGear = [MOVE, MOVE];
    let moveGearCost = _.sum(moveGear, b => BODYPART_COST[b as BodyPartConstant]);

    let moveParts = [];
    let bodyParts = [];

    while (budget >= smurfGearCost + moveGearCost) {

      if (budget >= smurfGearCost + moveGearCost) {
        bodyParts.push(...smurfGear);
        budget -= smurfGearCost;
        moveParts.push(...moveGear);
        budget -= moveGearCost;
      } else break;

    }

    moveParts.push(...bodyParts);

    super(`Spawn smurf`, ({
      body: moveParts,
      name: random_name({ first: true }),
      opts: { memory: { target: "61959a535ffec52a5cf6fbcb", targetRoom: "E23S13" } } // TODO: un-hardcode this
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      if (this.creepType.body === [] || this.creepType.body === null || spawn.spawning) return false;

      if (Game.rooms["E23S13"].find(FIND_MY_CREEPS).length > 7) return false;

      if (room.energyAvailable === room.energyCapacityAvailable) {
        const smurfsInThisRoom = room.find(FIND_MY_CREEPS).filter(c => c.memory.targetRoom !== undefined && c.memory.targetRoom !== room.name).length;
        // console.log(`Smurfs in this room: ${smurfsInThisRoom}`)
        return smurfsInThisRoom > 0 ? false : room.memory?.spawnSmurfs === true;
      }
      return false;
    };

    this.scores.push(new Scores.Default(1));
  }
}