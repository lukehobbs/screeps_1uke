import { Score } from "../../UtilityAi/Score";
import { CARRY, RESOURCE_ENERGY } from "../../../test/unit/constants";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../Actions/SpawnCreepAction";

export class SpawnBaseCreepOption extends SpawnCreepOption {
  constructor(room: Room) {
    let energyAvailable = room.energyAvailable;

    const bodyParts = [];

    const numOfMiners = (_.values(Game.creeps) as Creep[]).filter((c: Creep) => {
      return c.body.filter(b => b.type === WORK).length > 4;
    }).length;

    const creepsWithCarryParts = (_.values(Game.creeps) as Creep[]).filter((c: Creep) => {
      return c.body.filter(b => b.type === CARRY).length;
    }).length

    if (energyAvailable > 1000 && numOfMiners < room.memory.work.openSpacesPerSource.length && creepsWithCarryParts !== 0) {
      console.log("ACTIVATING MEGA MINER");
      const megaMiner = [
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, MOVE, MOVE];
      bodyParts.push(...megaMiner);
    } else if (energyAvailable > 1000) {
      console.log("ACTIVATING MEGA HAULER");
      const megaHauler = [
        CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE];
      bodyParts.push(...megaHauler);
      energyAvailable -= 700;
      while (energyAvailable > 130) {
        if (energyAvailable >= 150) {
          bodyParts.push(WORK, MOVE);
          energyAvailable -= 150;
        } else break;
        if (energyAvailable >= 130) {
          bodyParts.push(ATTACK, MOVE);
          energyAvailable -= 130;
        }
      }
    } else {
      while (energyAvailable > 0) {
        if (energyAvailable >= 50) {
          bodyParts.push(MOVE);
          energyAvailable -= 50;
        } else break;
        if (energyAvailable >= 100) {
          bodyParts.push(WORK);
          energyAvailable -= 100;
        }
        if (energyAvailable >= 50) {
          bodyParts.push(CARRY);
          energyAvailable -= 50;
        }
        if (energyAvailable >= 50) {
          bodyParts.push(MOVE);
          energyAvailable -= 50;
        }
        if (energyAvailable >= 300) {
          bodyParts.push(ATTACK);
          energyAvailable -= 80;
        }
        if (energyAvailable >= 300) {
          bodyParts.push(WORK);
          energyAvailable -= 100;
        }
      }
    }

    super(`Spawn base creep`, ({
      body: bodyParts,
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      // TODO: this is to avoid overcrowding. maybe the creeps 9+ should find their own room.
      // if (_.values(Game.creeps).length > 9) return false;
      return !room.memory.lastSpawned || (((Game.time - room.memory.lastSpawned) > (50 * _.values(Game.creeps).length) && !spawn.spawning)) && room.energyAvailable >= 200;
    }

    this.scores.push(new Score("inventory is full", ({ spawn }: IContext): number => {
      return spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ? 1 : 0;
    }));
  }
}