import { CreepMemory } from "../types/types";
import { distanceBetween } from "../utils/helpers";
import { log } from "../utils/log";
import "../utils/traveler/traveler";

const getBuildTarget = (creep: Creep): ConstructionSite | undefined => {
  const constructionSites = _.values(Game.constructionSites);

  return _.sortBy(constructionSites, ({ pos }: ConstructionSite) => distanceBetween(creep.pos, pos))[0] as ConstructionSite;
};

// TODO: use path lengths rather than euclidean distance
export const pickupClosestDroppedEnergy = (spawn: StructureSpawn, creep: Creep): ScreepsReturnCode => {
  const droppedEnergies = spawn?.room.find(FIND_DROPPED_RESOURCES)
    .filter(function(resource) {
      return resource.resourceType === RESOURCE_ENERGY;
    });

  const closestDroppedEnergy = _.sortBy(droppedEnergies, function(dropped) {
    return distanceBetween(creep.pos, dropped.pos);
  })[0];

  const containers = _.sortBy(_.filter(Game.structures, s => s.structureType === STRUCTURE_CONTAINER), s => creep.pos.getRangeTo(s));
  if (creep.pos.getRangeTo(containers[0]) < creep.pos.getRangeTo(closestDroppedEnergy)) {
    if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      log.action(`Moving to container at (${containers[0]?.pos?.x},${containers[0]?.pos?.y})`, creep);
      return creep.travelTo(containers[0]) as ScreepsReturnCode;
    }
  }

  if (creep.pickup(closestDroppedEnergy as Resource<RESOURCE_ENERGY>) === ERR_NOT_IN_RANGE) {
    log.action(`Moving to dropped resources at (${closestDroppedEnergy?.pos?.x},${closestDroppedEnergy?.pos?.y})`, creep);
    return creep.travelTo(closestDroppedEnergy) as ScreepsReturnCode;
  }

  return 0;
};
export const execute = (creep: Creep): void => {
  const spawn = _.values(Game.spawns)[0] as StructureSpawn;

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    (creep.memory as CreepMemory).unloading = false;
  }

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 || (creep.memory as CreepMemory).unloading) {
    const buildTarget = getBuildTarget(creep) as ConstructionSite;
    if (buildTarget === undefined || (creep.memory as CreepMemory).repairing) {
      const repairSites = (_.collect(Game.structures) as Structure[]).filter(structure => structure.hits < structure.hitsMax);
      if (repairSites.length !== 0) {
        (creep.memory as CreepMemory).repairing = true;
        if (creep.repair(repairSites[0]) === ERR_NOT_IN_RANGE) {
          log.action(`Moving to repair at (${buildTarget?.pos?.x},${buildTarget?.pos?.y})`, creep);
          creep.travelTo(repairSites[0]);
        }
      }
    } else {
      (creep.memory as CreepMemory).unloading = true;
      (creep.memory as CreepMemory).working = buildTarget?.id as string;

      let err = creep.build(buildTarget);
      if (err === ERR_NOT_IN_RANGE) {
        log.action(`Moving to construction site at (${buildTarget?.pos?.x},${buildTarget?.pos?.y})`, creep);
        creep.travelTo(buildTarget);
      } else if (err === ERR_INVALID_TARGET) {
        log.action(`Finding new construction site`, creep);
        (creep.memory as CreepMemory).working = getBuildTarget(creep)?.id as string;
      } else if (err === OK) {
        log.action(`Building construction site at (${buildTarget?.pos?.x},${buildTarget?.pos?.y})`, creep);
      }
    }
  } else {
    (creep.memory as CreepMemory).unloading = false;
    pickupClosestDroppedEnergy(spawn, creep);
  }
};
