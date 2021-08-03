import random_name from "node-random-name";
import type { Spawn } from "../main";
import { bodyCost } from "../utils/helpers";

const baseCreepBody = [WORK, CARRY, MOVE];
const minCreepCost = bodyCost(baseCreepBody);

const randomName = random_name({ first: true });

export class SpawnAi {
  spawn: Spawn;
  spawnCapacity: number;
  spawnEnergy: number;
  extensionsEnergy: number;

  energyAvailable: number;
  nextCreepBodyParts: BodyPartConstant[];

  nextCreepCost(): number {
    return bodyCost(this.nextCreepBodyParts);
  };

  tasks: any;

  bodyPartsPriority(): Map<number, BodyPartConstant> {
    return new Map();
  };

  constructor(spawn: Spawn) {
    this.spawn = spawn;
    this.spawnCapacity = this.spawn.object.store.getCapacity(RESOURCE_ENERGY);
    this.spawnEnergy = this.spawn.object.store.getUsedCapacity(RESOURCE_ENERGY);
    this.extensionsEnergy = _.sum(this.spawn.extensions.map((e) => {
      return e.store.getUsedCapacity(RESOURCE_ENERGY);
    }));
    this.energyAvailable = this.spawnEnergy + this.extensionsEnergy;
    this.nextCreepBodyParts = [MOVE];
  }

  execute() {
    let i = 0;
    // TODO: this seems to be an infinite loop
    while (this.energyAvailable > this.nextCreepCost()) {
      console.log(i);
      console.log(this.energyAvailable);
      console.log(this.nextCreepCost());
      const nextPart = this.bodyPartsPriority().get(i) as BodyPartConstant;
      const nextPartCost = BODYPART_COST[nextPart];

      if (this.energyAvailable > (this.nextCreepCost() + nextPartCost)) {
        this.nextCreepBodyParts.push(nextPart);
        this.energyAvailable -= nextPartCost;
      }
      i++;
    }
    console.log(`Energy available: ${this.energyAvailable}`);
    console.log(`Next creep body: ${this.nextCreepBodyParts}`);
    console.log(`Next creep cost: ${this.nextCreepCost()}`);
  }
}