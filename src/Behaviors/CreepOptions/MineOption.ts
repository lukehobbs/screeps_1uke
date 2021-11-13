import { Score } from "../../UtilityAi/Score";
import { MineSelector } from "../Selectors/MineSelector";
import { CARRY, RESOURCE_ENERGY } from "../../../test/unit/constants";

export class MineOption extends MineSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ room, creep }: IContext): boolean => {
      const source = Game.getObjectById(destinationId as Id<Source>);

      if (!source) return false;
      // Mining directly into containers causes some creeps to mine indefinitely -- ignoring other jobs bc they don't have energy
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return false;
      if (source.energy === 0 && source.ticksToRegeneration > creep.pos.getRangeTo(source.pos)) return false;

      const miners = (_.values(Game.creeps) as Creep[]).filter((c: Creep) => {
        return c.body.filter(b => b.type === WORK).length > 4;
      });
      if (_.any(miners, (miner) => miner.pos.isNearTo(source.pos) && miner.pos !== creep.pos)) return false;


      for (let pos of room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj || []) {
        if (creep.pos.x === pos.x && creep.pos.y === pos.y) return true;
        const creepsAtSpot = room.lookForAt(LOOK_CREEPS, pos.x, pos.y);
        if (creepsAtSpot.length === 0) {
          return true;
        }
      }
      return false;
    };

    this.scores = [];

    this.scores.push(new Score("proximity to source", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      return (50 - creep.pos.getRangeTo(dest.pos)) / 50;
    }));

    this.scores.push(new Score("next to source", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      return creep.pos.isNearTo(dest.pos) ? 1 : 0.2;
    }));

    this.scores.push(new Score("creeps near source", ({ creep, room}): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      if (creep.pos.isNearTo(dest.pos)) return 1;

      const openSpaces = room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj ?? [];
      const numSpaces = openSpaces.length;

      const top = _.min(openSpaces.map(pos => pos.y));
      const bottom = _.max(openSpaces.map(pos => pos.y));
      const left = _.min(openSpaces.map(pos => pos.x));
      const right = _.max(openSpaces.map(pos => pos.x));

      return (numSpaces - room.lookForAtArea(LOOK_CREEPS, top, left, bottom, right, true).length) / numSpaces;
    }));

    this.scores.push(new Score("creeps otw to source", ({ creep, room }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Source>);

      if (!dest) return -Infinity;

      if (creep.pos.isNearTo(dest.pos)) return 1;

      const creepsCloserThanMe = dest.pos.findInRange(FIND_MY_CREEPS, creep.pos.getRangeTo(dest.pos) - 1).length;
      const openSpaces = room.memory.work.openSpacesPerSource.find(x => x.id === destinationId)?.obj ?? [];
      const numSpaces = openSpaces.length;

      return (numSpaces - creepsCloserThanMe) / numSpaces;
    }));

    this.scores.push(new Score("carry parts", ({ creep }: IContext): number => {
      const carryParts = creep.body.filter((part): boolean => {
        return part.type == CARRY;
      }).length;

      const othersCarryParts = _.sum(_.map(Game.creeps,(c: Creep) => c.getActiveBodyparts(CARRY)));

      return 1 - (carryParts / othersCarryParts);
    }));

    this.scores.push(new Score("container inventory", ({room}: IContext): number => {
      const energyInContainers = _.sum(room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})
        .map((c): number => (c as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY)))
      const maxEnergyInContainers = _.sum(room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})
        .map((c): number => (c as StructureContainer).store.getCapacity(RESOURCE_ENERGY)))

      return 1 - (energyInContainers / maxEnergyInContainers)
    }));

    this.scores.push(new Score("creep inventory", ({creep}: IContext): number => {
      return (creep.store.getCapacity(RESOURCE_ENERGY) - creep.store.getUsedCapacity(RESOURCE_ENERGY)) / creep.store.getCapacity(RESOURCE_ENERGY);
    }));


    // this.scores.push(new Score("source will regen soon", ({ creep }: IContext): number => {
    //   const dest = Game.getObjectById(this.destinationId as Id<Source>);
    //   if (!dest) return -Infinity;
    //   if (dest.energy > 0) return 1;
    //   const value = creep.pos.getRangeTo(dest.pos) / dest.ticksToRegeneration;
    //   return value > 1 ? 1 : value;
    // }));
  }
}