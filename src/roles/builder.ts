import { log } from "../log";
import { CreepMemory } from "../types";
import { distanceBetween } from "../utils/helpers";
import "../utils/traveler/traveler";
import { pickupClosestDroppedEnergy } from "./hauler";

function getBuildTarget(creep: Creep): ConstructionSite | undefined {
  const constructionSites = _.values(Game.constructionSites);

  return _.sortBy(constructionSites, function(site: ConstructionSite) {
    return distanceBetween(creep.pos, site.pos);
  })[0] as ConstructionSite;
}

function createConstructionSite(creep: Creep, room: Room): void {
  // TODO: pick location and start new construction site
}

export function execute(creep: Creep): void {
  const spawn = _.values(Game.spawns)[0] as StructureSpawn;

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    (creep.memory as CreepMemory).unloading = false;
  }

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 || (creep.memory as CreepMemory).unloading) {
    const buildTarget = getBuildTarget(creep) as ConstructionSite;
    if (buildTarget === undefined || (creep.memory as CreepMemory).repairing) {
      const repairSites = (_.collect(Game.structures) as Structure[]).filter(function(structure) {
        return structure.hits < structure.hitsMax;
      });
      if (repairSites.length !== 0) {
        (creep.memory as CreepMemory).repairing = true;
        if (creep.repair(repairSites[0]) === ERR_NOT_IN_RANGE) {
          log(`Moving to repair at (${buildTarget?.pos?.x},${buildTarget?.pos?.y})`, creep);
          creep.travelTo(repairSites[0]);
        }
      }
    } else {
      (creep.memory as CreepMemory).unloading = true;
      (creep.memory as CreepMemory).working = buildTarget?.id as string;

      let err = creep.build(buildTarget);
      if (err === ERR_NOT_IN_RANGE) {
        log(`Moving to construction site at (${buildTarget?.pos?.x},${buildTarget?.pos?.y})`, creep);
        creep.travelTo(buildTarget);
      } else if (err === ERR_INVALID_TARGET) {
        log(`Finding new construction site`, creep);
        (creep.memory as CreepMemory).working = getBuildTarget(creep)?.id as string;
      } else if (err === OK) {
        log(`Building construction site at (${buildTarget?.pos?.x},${buildTarget?.pos?.y})`, creep);
      }
    }
  } else {
    (creep.memory as CreepMemory).unloading = false;
    pickupClosestDroppedEnergy(spawn, creep);
  }
}
