// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "Utils/ErrorMapper";
import { cleanupMemory } from "./Memory/cleanupMemory";
import RoomPlanner from "./Room/RoomPlanner";
import { CreepUtilityAi, initializeCreepOptions } from "./CreepUtilityAi";
import { runOption } from "./UtilityAi/runOption";
import { initializeSpawnOptions, SpawnUtilityAi } from "./SpawnUtilityAi";
import RoomStatistics from "./Room/RoomStats";
import { RoomStats } from "./Types/types";
import { log } from "./Utils/log";
import { RESOURCE_ENERGY, WORK } from "../test/unit/constants";
import { initializeTowerOptions, TowerUtilityAi } from "./TowerUtilityAi";
import { initializeLinkOptions, LinkUtilityAi } from "./LinkUtilityAi";
import updateStats = RoomStatistics.updateStats;

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();
  log.debug(log.colored("white", `---`));

  for (const roomsKey in Game.rooms) {
    // console.log(roomsKey)
    const room = Game.rooms[roomsKey];
    const roomMemory = room.memory as RoomMemory;

    const spawnUtilityAi = new SpawnUtilityAi("spawn-ai");
    const creepUtilityAi = new CreepUtilityAi("creep-ai");
    const towerUtilityAi = new TowerUtilityAi("tower-ai");
    const linkUtilityAi = new LinkUtilityAi("link-ai");

    if (room.controller) {
      if (!roomMemory.planned) {
        RoomPlanner.plan(room, roomMemory);
      }

      if (Game.time - (roomMemory.stats?.lastUpdated ?? 0) >= (roomMemory.stats?.interval ?? 50)) {
        updateStats(room, roomMemory.stats as RoomStats);
      }
      // Can I send myself a notification if it's been X ticks since spawn and we have 0 creeps?
      log.debug(`Ticks since last spawn:\t\t${Game.time - roomMemory.lastSpawned}`);
      log.debug(`Energy available:\t\t${room.energyAvailable}/${room.energyCapacityAvailable}`);
      log.debug(`Controller level progress:\t${((room.controller.progress / room.controller.progressTotal) * 100).toFixed(1)}%`);
      const energyInRoom = _.sum(
        room.find(FIND_DROPPED_RESOURCES).map(r => r.amount).concat(
          room.find(FIND_STRUCTURES).map(r => {
            return (r.structureType === STRUCTURE_CONTAINER || STRUCTURE_STORAGE) ? (r as StructureStorage)?.store?.getUsedCapacity(RESOURCE_ENERGY) : 0;
          })
        )
      );
      log.debug(`Energy in room:\t\t\t${energyInRoom}`);
    } else continue;

    manageSpawnAi(spawnUtilityAi, room);
    manageCreepsAi(creepUtilityAi, room);
    manageTowersAi(towerUtilityAi, room);
    manageLinksAi(linkUtilityAi, room);
  }
});

function manageCreepsAi(creepUtilityAi: CreepUtilityAi, room: Room) {
  let creepLogs: string[] = [];

  initializeCreepOptions(creepUtilityAi, room);
  const spawn = Game.getObjectById(room.memory?.spawn?.id as Id<StructureSpawn>);
  (room.find(FIND_MY_CREEPS) as Creep[]).forEach(c => {
    // (_.values(Game.creeps) as Creep[]).forEach(c => {
    if (Game.creeps[c.name]?.spawning) return;
    const creepContext = { creep: Game.creeps[c.name], room, spawn } as IContext;
    const creepOption = creepUtilityAi.bestOption(creepContext);
    const log = runOption(creepContext, creepOption, true);
    if (log) creepLogs.push(log);
  });
  const sortedLogs = _.groupBy(creepLogs, (logMsg) => {
    if (!logMsg) return -1;
    const noCreepNameMsg = logMsg.substr(logMsg.indexOf("]") + 1, logMsg.length).trim();
    return noCreepNameMsg.substr(0, noCreepNameMsg.indexOf(" "));
    // return _.identity();
  });

  let finalMsg = "";
  for (let action in sortedLogs) {
    finalMsg = finalMsg.concat(`| ${action}:${_.size(sortedLogs[action])} `);
  }
  finalMsg = finalMsg.concat("|");
  log.info(`[${room.name}] ${finalMsg}`);

  // sortedLogs.forEach((msg) => {
  //   log.debug(msg);
  // });
}

function manageSpawnAi(spawnUtilityAi: SpawnUtilityAi, room: Room) {
  initializeSpawnOptions(spawnUtilityAi, room);
  const spawn = Game.getObjectById(room.memory?.spawn?.id as Id<StructureSpawn>);
  if (!spawn) return;
  const spawnContext = { room, spawn, roomStats: room.memory.stats } as IContext;
  const spawnOption = spawnUtilityAi.bestOption(spawnContext);
  log.debug(`Current spawn goal:\t\t${spawnOption.id}`);
  runOption(spawnContext, spawnOption);
}

function manageTowersAi(towerUtilityAi: TowerUtilityAi, room: Room) {
  const spawn = Game.getObjectById(room.memory?.spawn?.id as Id<StructureSpawn>);
  if (!spawn) return;
  initializeTowerOptions(towerUtilityAi, room);
  const towers = room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_TOWER);
  towers.forEach(t => {
    const fakeCreep = t as unknown as Creep;
    fakeCreep.name = `TWR-${t.id.substr(t.id.length - 4, t.id.length)}`;
    fakeCreep.memory = {} as CreepMemory;
    fakeCreep.body = [{ type: WORK }, { type: ATTACK }, { type: HEAL }] as BodyPartDefinition[];
    fakeCreep.getActiveBodyparts = (b) => b === CARRY ? 0 : 1;
    const towerContext = { creep: fakeCreep, room, spawn } as IContext;
    const towerOption = towerUtilityAi.bestOption(towerContext);
    log.debug(runOption(towerContext, towerOption, true));
  });
}

function manageLinksAi(linkUtilityAi: LinkUtilityAi, room: Room) {
  initializeLinkOptions(linkUtilityAi, room);
  const structures = room.find(FIND_MY_STRUCTURES);
  const links = structures.filter(s => s.structureType === STRUCTURE_LINK);
  links.forEach(l => {
    const linkContext = {
      creep: { name: `LNK-${l.id.substr(l.id.length - 4, l.id.length)}` },
      link: l,
      room: room
    } as IContext;
    const linkOption = linkUtilityAi.bestOption(linkContext);
    log.debug(runOption(linkContext, linkOption, true));
  });
}