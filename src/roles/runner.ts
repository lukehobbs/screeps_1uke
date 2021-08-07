import { log } from "../utils/log";
import { CreepMemory } from "../types/types";
import { globalMemory } from "../memory/globalMemory";
import { FIND_STRUCTURES } from "../../test/unit/constants";
import { HOME_SPAWN } from "../constants";

const getPickupTarget = (runner: Creep) => _.sortBy(
  runner.room.find(FIND_DROPPED_RESOURCES)
    .filter(r => r.resourceType === RESOURCE_ENERGY && r.amount >= runner.store.getCapacity(RESOURCE_ENERGY)),
  r => runner.pos.getRangeTo(r))[0].id;

function getConstructionSite(constructionSites: { [p: string]: ConstructionSite }, runner: Creep) {
  return _.sortBy(constructionSites, s => runner.pos.getRangeTo(s))[0]?.id;
}

function bringEnergyToConstructionSites(runner: Creep, constructionSites: { [p: string]: ConstructionSite }, waterCooler: Flag, controller: string & Tag.OpaqueTag<Structure<StructureConstant>>) {
  let creepMemory = runner.memory as CreepMemory;
  if (creepMemory.working) {
    if (!creepMemory.unloading) {
      const pickupTarget = creepMemory.pickupTarget;
      if (!pickupTarget) {
        creepMemory.pickupTarget = getPickupTarget(runner);
      } else {
        const pickupTargetObj = new Resource(pickupTarget as Id<Resource<RESOURCE_ENERGY>>);
        if (runner.pickup(pickupTargetObj) === ERR_NOT_IN_RANGE) {
          log.action(`Moving to dropped resources at (${pickupTargetObj.pos.x},${pickupTargetObj.pos.y})`, runner);
          runner.travelTo(pickupTargetObj);
        } else {
          log.action(`Picking up resources at (${pickupTargetObj.pos.x},${pickupTargetObj.pos.y})`, runner);
          if (runner.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creepMemory.unloading = true;
            creepMemory.pickupTarget = undefined;
          }
        }
      }
    } else if (creepMemory.working !== "") {
      let unloadTarget = Game.getObjectById(creepMemory.working);
      if (runner.pos.isNearTo(unloadTarget as AnyStructure)) {
        runner.drop(RESOURCE_ENERGY);
        creepMemory.working = undefined;
        creepMemory.unloading = undefined;
      } else {
        runner.travelTo(unloadTarget as AnyStructure);
      }
    }
  } else if (!!constructionSites && runner.pos.isNearTo(waterCooler)) {
    creepMemory.working = getConstructionSite(constructionSites, runner);
  } else if (!!controller && runner.pos.isNearTo(waterCooler)) {
    creepMemory.working = controller;
  } else {
    runner.travelTo(waterCooler);
  }
}

export const execute = (runner: Creep) => {
  const spawn = Game.spawns[HOME_SPAWN];
  const waterCooler = Game.flags["WaterCooler"];
  const constructionSites = Game.constructionSites;
  const controller = globalMemory(Memory).controllers[0];
  const creepMemory = runner.memory as CreepMemory;

  if (creepMemory.recycling) {
    if (spawn.recycleCreep(runner) === ERR_NOT_IN_RANGE) {
      runner.travelTo(spawn);
    }
  }

  if (_.size(constructionSites) != 0) {
    creepMemory.repairing = false;
    bringEnergyToConstructionSites(runner, constructionSites, waterCooler, controller);
  } else {
    creepMemory.repairing = true;
  }

  if (creepMemory.repairing) {
    if (!creepMemory.working) {
      const structures = runner.room.find(FIND_STRUCTURES).filter(s => s.hits < s.hitsMax);
      if (structures.length > 0) {
        creepMemory.working = structures[0].id;
      }
    }
    const target = runner.room.find(FIND_STRUCTURES).find(s => s.id === creepMemory.working);
    creepMemory.working = target?.id;
    if (!target) {
      log.error(`can't find target for ${runner.name}`);
      creepMemory.working = undefined;
    } else {
      let err = runner.repair(target);
      if (err === ERR_NOT_IN_RANGE) {
        runner.travelTo(target);
      } else if (err === ERR_NO_BODYPART) {
        creepMemory.recycling = true;
      } else {
        creepMemory.working = undefined;
      }
    }
  }

};