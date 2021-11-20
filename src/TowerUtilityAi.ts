import { UtilityAi } from "./UtilityAi/UtilityAi";
import { DoNothingOption } from "./Behaviors/Options/GenericOptions/DoNothingOption";
import { AttackOption } from "./Behaviors/Options/CreepOptions/AttackOption";
import { RepairOption } from "./Behaviors/Options/CreepOptions/RepairOption";
import { HealOption } from "./Behaviors/Options/CreepOptions/HealOption";

export class TowerUtilityAi extends UtilityAi {
}

export const initializeTowerOptions = (ai: TowerUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());
  const structures = room.find(FIND_STRUCTURES);

  const creeps = room.find(FIND_CREEPS);
  const creepsNeedingHealing = creeps.filter(c => c.hits < c.hitsMax);
  const invaders = creeps.filter(c => !c.my);
  const repairableStructures = structures.filter(s => s.hits < s.hitsMax);

  creepsNeedingHealing.forEach(c => ai.addOption(new HealOption(c.id)));
  invaders.forEach(i => ai.addOption(new AttackOption(i.id)));
  repairableStructures.forEach(r => ai.addOption(new RepairOption(r.id)));
};