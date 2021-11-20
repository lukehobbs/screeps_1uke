import { Score } from "../../../UtilityAi/Score";
import { PickupStructureSelector } from "../Selectors/PickupSelector";
import { CARRY, RESOURCE_ENERGY } from "../../../../test/unit/constants";

export class PickupStructureOption<T extends Structure | Tombstone | Ruin> extends PickupStructureSelector<T> {

  constructor(destinationId: string, resourceType: ResourceConstant) {
    super(destinationId, resourceType);

    this.condition = ({ creep }) => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) return false;

      const dest = Game.getObjectById(destinationId as Id<Structure | Tombstone | Ruin>);
      if (!dest) return false;
      if (!("store" in dest)) return false;
      const usedCapacity = dest.store.getUsedCapacity(RESOURCE_ENERGY);
      if (usedCapacity === 0) return false;

      return creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && creep.body.filter(b => b.type === CARRY).length !== 0;
    };

    this.scores = [];

    this.scores.push(new Score("structure type", (): number => {
      const dest = Game.getObjectById(destinationId as Id<Structure | Tombstone | Ruin>);
      if (!dest) return -1;

      if ((dest as Tombstone).deathTime) return 1;
      if ((dest as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 0) return 0.5;
      if ((dest as StructureStorage).store.getUsedCapacity(RESOURCE_ENERGY) > 0) return 0.5;
      return 0.4;
    }));

    this.scores.push(new Score("enough resource to fill my inventory", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Structure | Tombstone | Ruin>);

      if (!dest) return -1;

      if (!("store" in dest)) return -1;
      const usedCapacity = dest.store.getUsedCapacity(RESOURCE_ENERGY);
      return usedCapacity > creep.store.getFreeCapacity(RESOURCE_ENERGY) ? 1 : 0.5;
    }));

    this.scores.push(new Score("proximity to resource", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Structure | Tombstone | Ruin>);

      if (!dest) return -1;

      return ((49 - creep.pos.getRangeTo(dest.pos)) / 49);
    }));

    this.scores.push(new Score("fullness", (): number => {
      const dest = Game.getObjectById(destinationId as Id<Structure | Tombstone | Ruin>);

      if (!dest) return -1;
      if (!("store" in dest)) return -1;

      const capacity = dest.store.getCapacity(RESOURCE_ENERGY);
      if (!capacity) return -1;

      // return dest.store.getUsedCapacity(RESOURCE_ENERGY) / capacity;
      return dest.store.getUsedCapacity(RESOURCE_ENERGY) / (dest.store.getUsedCapacity(RESOURCE_ENERGY) + 1);
    }));

    this.scores.push(new Score("creeps near structure", ({ creep, room }): number => {
      const dest = Game.getObjectById(this.destinationId as Id<Structure>);

      if (!dest) return -Infinity;

      if (creep.pos.isNearTo(dest.pos)) return 1;


      const top = dest.pos.y - 1;
      const bottom = dest.pos.y + 1;
      const left = dest.pos.x - 1;
      const right = dest.pos.x + 1;

      let max = 0;

      for (let y = top; y < bottom; y++) {
        for (let x = left; x < right; x++) {
          if (room.getTerrain().get(x, y) === 0) max++;
        }
      }

      return (max - room.lookForAtArea(LOOK_CREEPS, top, left, bottom, right, true).length) / max;
    }));

    this.scores.push(new Score("i'm goin on a trip", ({ creep: { memory: { targetRoom } }, room }): number => {
      return targetRoom && targetRoom !== room.name ? 1 : 0.1;
    }));
  }
}