import { Score } from "../../../UtilityAi/Score";
import { SpawnCreepOption } from "./SpawnCreepOption";
import random_name from "node-random-name";
import { CreepType } from "../../Actions/SpawnCreepAction";

export class SpawnBaseCreepOption extends SpawnCreepOption {
  constructor(room: Room) {
    let energyAvailable = room.energyAvailable;

    const bodyParts: BodyPartConstant[] = [];

    const numOfMiners = (room.find(FIND_MY_CREEPS) as Creep[]).filter((c: Creep) => {
      return c.body.filter(b => b.type === WORK).length > 4 && (c.ticksToLive || 0) > 70 && c.getActiveBodyparts(CARRY) === 1;
    }).length;

    const creepsWithCarryParts = (room.find(FIND_MY_CREEPS) as Creep[]).filter((c: Creep) => {
      return c.getActiveBodyparts(CARRY) !== 0;
    }).length;

    // TODO: use different spawn options for these
    if (energyAvailable > 1000 && numOfMiners < room.memory.work.openSpacesPerSource.length && creepsWithCarryParts > 2) {
      bodyParts.push(CARRY);
      bodyParts.push(MOVE);
      energyAvailable -= 100;
      while (energyAvailable > 150) {
        if (energyAvailable >= 150) {
          bodyParts.push(WORK, MOVE);
          energyAvailable -= 150;
        } else break;
      }
      // console.log("ACTIVATING MEGA MINER");
      // console.log(bodyParts);
      // const megaMiner = [
      //   WORK, WORK, WORK, WORK, WORK, WORK,
      //   MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
      //   ATTACK, ATTACK, CARRY];
      // bodyParts.push(...megaMiner);
    } else if (energyAvailable > 1000) {
      // console.log("ACTIVATING MEGA HAULER");
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
        // if (energyAvailable >= 130) {
        //   bodyParts.push(ATTACK, MOVE);
        //   energyAvailable -= 130;
        // }
      }
    } else {
      while (energyAvailable >= 250) {
        if (energyAvailable >= 150) {
          bodyParts.push(MOVE, WORK);
          energyAvailable -= 150;
        }
        if (energyAvailable >= 100) {
          bodyParts.push(MOVE, CARRY);
          energyAvailable -= 100;
        }
        // if (energyAvailable >= 500) {
        //   bodyParts.push(MOVE, ATTACK);
        //   energyAvailable -= 130;
        // }
      }
    }

    super(`Spawn base creep`, ({
      body: bodyParts,
      name: random_name({ first: true }),
      opts: {}
    } as CreepType));

    this.scores = [];

    this.condition = ({ room, spawn }: IContext): boolean => {
      const energyInRoom = _.sum(room.find(FIND_DROPPED_RESOURCES).map(r => r.amount))
        + _.sum(room.find(FIND_STRUCTURES).map(s => s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER ? s.store.getUsedCapacity(RESOURCE_ENERGY) : 0));
      const numOfMiners = (room.find(FIND_MY_CREEPS) as Creep[]).filter((c: Creep) => {
        return c.body.filter(b => b.type === WORK).length > 4 && c.getActiveBodyparts(CARRY) === 1;
      }).length;


      const roomCreeps = room.find(FIND_MY_CREEPS).length;
      if (room.energyAvailable === room.energyCapacityAvailable
        && room.energyAvailable >= 1500
        && roomCreeps > 6
        && numOfMiners >= room.memory.work.openSpacesPerSource.length) return false;

      if (room.name == "E23S13" && roomCreeps > 5) return false;

      if (room.energyAvailable === room.energyCapacityAvailable && room.energyAvailable > 1000) {
        if (energyInRoom > 10000) return true;
        if (numOfMiners < room.memory.work.openSpacesPerSource.length && roomCreeps < 6) return true;
      }

      if (((Game.time - room.memory.lastSpawned) < (25 * room.find(FIND_MY_CREEPS).length) || spawn.spawning)) return false;
      // if (room.energyAvailable > 1000 && energyInRoom > 500) return true;

      if (numOfMiners < room.memory.work.openSpacesPerSource.length && room.energyAvailable >= 250) return true;

      if (room.find(FIND_MY_CREEPS).filter(c => c.getActiveBodyparts(CARRY) > 2).length === 0) return true;

      // TODO: this is to avoid overcrowding. maybe the creeps 9+ should find their own room.
      // if (_.values(Game.creeps).length > 9) return false;
      return !room.memory.lastSpawned || (room.energyAvailable >= 250 && room.find(FIND_MY_CREEPS).length === 0);
    };

    this.scores.push(new Score("inventory is full", ({ spawn }: IContext): number => {
      // console.log(this.creepType.body)
      return spawn?.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ? 1 : 0;
    }));
  }
}