import { Score } from "../../UtilityAi/Score";
import { PickupSelector } from "../Selectors/PickupSelector";
import { CARRY, RESOURCE_ENERGY } from "../../../test/unit/constants";

export class PickupOption extends PickupSelector {
  //TODO: switch to using storage containers in a better way
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }) => {
      const container = Game.getObjectById(destinationId as Id<StructureContainer>);
      if (container?.store) {
        if (container.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      }
      return creep.store.getFreeCapacity(RESOURCE_ENERGY) >= 0 && creep.body.filter(b => b.type === CARRY).length !== 0;
    };

    this.scores = [];

    // this.scores.push(new Score("", ({room}: IContext): number => {
    //   const ticksSinceSpawn = Game.time - room.memory.lastSpawned;
    //
    //   if (ticksSinceSpawn > 300) return 1;
    //   return 0.5;
    // }))

    this.scores.push(new Score("close to", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<AnyStructure>);
      if (!dest) {
        return 0;
      }
      return creep.pos.isNearTo(dest.pos) ? 0.5 : 0.25;
    }));

    this.scores.push(new Score("enough resource to fill my inventory",({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest?.amount) return 0;

      return dest.amount / (dest.amount + (creep.store.getCapacity(RESOURCE_ENERGY)/1.5));
    }));

    this.scores.push(new Score("proximity to resource", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<Resource>);

      if (!dest?.amount) {
        return ((50 - creep.pos.getRangeTo((dest as unknown as AnyStructure).pos)) / 50);
      }

      return ((50 - creep.pos.getRangeTo(dest.pos)) / 50);
    }));

    // this.scores.push(new Score("super proximity to resource", ({ creep }: IContext): number => {
    //   const dest = Game.getObjectById(destinationId as Id<Resource>);
    //   let distance;
    //   if (!dest?.amount) {
    //     distance = creep.pos.getRangeTo((dest as unknown as AnyStructure).pos);
    //   }
    //   else {
    //     distance = creep.pos.getRangeTo(dest.pos);
    //   }
    //
    //   return distance < 5 ? 0.75 : 0.5;
    // }));


    this.scores.push(new Score("fullness", (): number => {
      const dest = Game.getObjectById(destinationId as Id<StructureContainer>);

      if (!dest?.store) return 0;

      return dest.store.getUsedCapacity(RESOURCE_ENERGY) / dest.store.getCapacity(RESOURCE_ENERGY);
    }));

    this.scores.push(new Score("carry to work ratio", ({ creep }: IContext): number => {
      const creepParts = creep.body.map(b => b.type);

      const value = creepParts.filter(b => b === CARRY).length / creepParts.filter(b => b === WORK).length;

      return value > 0.5 ? 0.5 : value;
    }));
  }
}