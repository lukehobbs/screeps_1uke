import { UtilityAi } from "./UtilityAi/UtilityAi";
import { FillSpawnOption } from "./Behaviors/Options/CreepOptions/FillSpawnOption";
import { MineOption } from "./Behaviors/Options/CreepOptions/MineOption";
import { UpgradeControllerOption } from "./Behaviors/Options/CreepOptions/UpgradeControllerOption";
import { PickupStructureOption } from "./Behaviors/Options/CreepOptions/PickupStructureOption";
import { DoNothingOption } from "./Behaviors/Options/GenericOptions/DoNothingOption";
import { BuildOption } from "./Behaviors/Options/CreepOptions/BuildOption";
import { GraffitiOption } from "./Behaviors/Options/CreepOptions/GraffitiOption";
import { RecycleCreepOption } from "./Behaviors/Options/CreepOptions/RecycleCreepOption";
import { FillExtensionOption } from "./Behaviors/Options/CreepOptions/FillExtensionOption";
import { AttackOption } from "./Behaviors/Options/CreepOptions/AttackOption";
import { RepairOption } from "./Behaviors/Options/CreepOptions/RepairOption";
import { PickupResourceOption } from "./Behaviors/Options/CreepOptions/PickupResourceOption";
import { RenewCreepOption } from "./Behaviors/Options/CreepOptions/RenewCreepOption";
import { HealOption } from "./Behaviors/Options/CreepOptions/HealOption";
import { FillTowerOption } from "./Behaviors/Options/CreepOptions/FillTowerOption";
import { RESOURCE_ENERGY } from "../test/unit/constants";
import { UnloadLinkOption } from "./Behaviors/Options/CreepOptions/UnloadLinkOption";
import { FillStorageOption } from "./Behaviors/Options/CreepOptions/FillStorageOption";
import { getContainers, getExtensions, getLinks, getStorages, getTowers } from "./Utils/Helpers";
import { ClaimControllerOption } from "./Behaviors/Options/CreepOptions/ClaimControllerOption";

// import { DropEnergyOption } from "./Behaviors/CreepOptions/DropEnergyOption";

export class CreepUtilityAi extends UtilityAi {
}

export const initializeCreepOptions = (ai: CreepUtilityAi, room: Room) => {
  const structures = room.find(FIND_STRUCTURES);

  let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
  // const newSpawn = _.first(Game.rooms["E23S13"].find(FIND_CONSTRUCTION_SITES).filter(s => s.structureType === STRUCTURE_SPAWN));
  // if (newSpawn) constructionSites.push(newSpawn);
  const containers = getContainers(structures);
  const controllers = room.memory?.work?.controllers;
  const creeps = room.find(FIND_CREEPS);
  const creepsNeedingHealing = creeps.filter(c => c.hits < c.hitsMax);
  const droppedResources = room.find(FIND_DROPPED_RESOURCES);
  const extensions = getExtensions(structures);
  const invaders = creeps.filter(c => !c.my);
  const links = getLinks(structures);
  const repairableStructures = structures.filter(s => s.hits < s.hitsMax);
  const ruins = room.find(FIND_RUINS);
  const sources = room.memory?.work?.sources;
  const spawns = room.find(FIND_MY_SPAWNS);
  const storages = getStorages(structures);
  const tombstones = room.find(FIND_TOMBSTONES);
  const towers = getTowers(structures);

  ai.addOption(new DoNothingOption());
  // ai.addOption(new DropEnergyOption());

  constructionSites.forEach(c => ai.addOption(new BuildOption(c.id)));
  containers.forEach(c => ai.addOption(new PickupStructureOption(c.id, RESOURCE_ENERGY)));
  let controllerIds = controllers !== undefined ? controllers.map(c => c.id) : [];
  // if (Game.rooms["E23S13"]?.controller)  controllerIds.push(Game.rooms["E23S12"].controller.id);
  // if (room?.memory?.spawnSettler != null) {
  //   controllerIds.push(room?.memory?.spawnSettler);
  // }
  ai.addOption(new ClaimControllerOption("5bbcae659099fc012e638f06"));
  controllerIds.forEach(c => {
    ai.addOption(new ClaimControllerOption(c));
    ai.addOption(new UpgradeControllerOption(c));
    ai.addOption(new GraffitiOption(c));
  });
  creepsNeedingHealing.forEach(c => ai.addOption(new HealOption(c.id)));
  droppedResources.forEach(d => ai.addOption(new PickupResourceOption(d.id)));
  extensions.forEach(e => ai.addOption(new FillExtensionOption(e.id)));
  links.forEach(l => ai.addOption(new UnloadLinkOption(l.id)));
  invaders.forEach(i => ai.addOption(new AttackOption(i.id)));
  repairableStructures.forEach(r => ai.addOption(new RepairOption(r.id)));
  ruins.forEach(r => ai.addOption(new PickupStructureOption(r.id, RESOURCE_ENERGY)));
  if (sources !== undefined) sources.forEach(s => ai.addOption(new MineOption(s.id)));
  spawns.forEach(s => {
    ai.addOption(new FillSpawnOption(s.id));
    ai.addOption(new RecycleCreepOption(s.id));
    ai.addOption(new RenewCreepOption(s.id));
  });
  storages.forEach(s => {
    ai.addOption(new PickupStructureOption(s.id, RESOURCE_ENERGY));
    ai.addOption(new FillStorageOption(s.id));
  });
  tombstones.forEach(t => ai.addOption(new PickupStructureOption(t.id, RESOURCE_ENERGY)));
  towers.forEach(t => ai.addOption(new FillTowerOption(t.id)));

  ai.addOption(new AttackOption("617f3c9004063f62471023af"));
  ai.addOption(new AttackOption("618169cccb300b90d761d562"));
  ai.addOption(new AttackOption("6186823798dbf627f8ecb0e7"));
  ai.addOption(new AttackOption("60def5229d77df419469df5d"));
  ai.addOption(new AttackOption("618d485e5c00566c7d8b3cc1"));

  const remoteRoomName = "E25S13";
  const remoteRoom = Game.rooms[remoteRoomName];
  if (!!remoteRoom) {
    // const structures = Game.rooms["E25S13"].find(FIND_STRUCTURES).filter(s => s.hits > 0);
    // structures.forEach(s => {
    //   if (s.structureType === STRUCTURE_WALL && s.pos.y !== 31) {
    //     return;
    //   }
    //   else {
    //     ai.addOption(new AttackOption(s.id));
    //   }
    // });
    const resources = remoteRoom.find(FIND_DROPPED_RESOURCES);
    resources.forEach(s => ai.addOption(new PickupResourceOption(s.id)));

    const sources = remoteRoom.find(FIND_SOURCES);
    sources.forEach(s => ai.addOption(new MineOption(s.id)));
  }
};