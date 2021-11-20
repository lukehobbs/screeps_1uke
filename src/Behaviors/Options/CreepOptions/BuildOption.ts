import { Score } from "../../../UtilityAi/Score";
import { BuildSelector } from "../Selectors/BuildSelector";
import { RESOURCE_ENERGY } from "../../../../test/unit/constants";

export class BuildOption extends BuildSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }: IContext): boolean => {
      // if (room.find(FIND_MY_CREEPS).length < 4) return false;
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;

      const constructionSite = Game.getObjectById(this.destinationId as Id<ConstructionSite>);
      // console.log(constructionSite);
      // console.log(creep.name);
      return !!constructionSite;

      // const energyInRoom = room.energyAvailable
      //   + _.sum(room.find(FIND_DROPPED_RESOURCES).map(r => r.amount))
      //   + _.sum(room.find(FIND_STRUCTURES).map(r => {
      //     if (!("store" in r)) return 0;
      //     return (r as StructureContainer | StructureStorage | Tombstone | Ruin).store.getUsedCapacity(RESOURCE_ENERGY);
      //   }));
      //
      // if (energyInRoom < 1000) return false;
      //
      // return creep.pos.getRangeTo(constructionSite.pos) < 10;
    };

    this.scores = [];

    this.scores.push(new Score("i'm next to a construction site", ({ creep }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<ConstructionSite>);

      if (!dest) return -Infinity;
      if (creep.pos.getRangeTo(dest.pos) === Infinity) return 0;
      return (49 - creep.pos.getRangeTo(dest.pos)) / 49;
    }));

    this.scores.push(new Score("", (): number => {
      const dest = Game.getObjectById(this.destinationId as Id<ConstructionSite>);

      if (!dest) return -Infinity;

      const value = dest.progress / dest.progressTotal;

      return value * 0.75;
    }));
    this.scores.push(new Score("this is a construction site for an extension", (): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Structure>);
      if (!dest) {
        return -Infinity;
      }

      if (dest.structureType === STRUCTURE_EXTENSION) return 1;
      if (dest.structureType === STRUCTURE_TOWER) return 1;
      if (dest.structureType === STRUCTURE_CONTAINER) return 1;
      if (dest.structureType === STRUCTURE_STORAGE) return 0.2;
      if (dest.structureType === STRUCTURE_ROAD) return 1;
      if (dest.structureType === STRUCTURE_LINK) return 1;
      if (dest.structureType === STRUCTURE_SPAWN) return 1;
      return 0;
    }));

    // this.scores.push(new Score("num of creeps upgrading", ({ room }: IContext): number => {
    //   const controller = room.controller;
    //   if (!controller) return -Infinity;
    //   const cPos = controller.pos;
    //
    //   const creepsUpgrading = room.lookForAtArea(LOOK_CREEPS, cPos.y - 3, cPos.x - 3, cPos.y + 3, cPos.x + 3, true).length;
    //
    //   // if (creepsUpgrading > 6) return 1;
    //   return creepsUpgrading / (room.find(FIND_MY_CREEPS).length - 2);
    // }));
  }
}