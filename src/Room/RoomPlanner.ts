import { CommonPaths, RoomMemory, RoomStats, ScreepsObj, WorkDetails } from "../Types/types";
import RoomVisuals from "./RoomVisuals";
import { Traveler } from "../Utils/traveler/traveler";
import { log } from "../Utils/log";

namespace RoomPlanner {
  export const getAdjacentTiles = (pos: RoomPosition): RoomPosition[] => {
    const adjacentTiles: RoomPosition[] = [];

    for (let x = pos.x - 1; x < pos.x + 2; x++) {
      for (let y = pos.y - 1; y < pos.y + 2; y++) {
        if (pos.x !== x || pos.y !== y) {
          const position = _.clone(pos);
          position.x = x;
          position.y = y;
          adjacentTiles.push(position);
        }
      }
    }
    return adjacentTiles;
  };

  const openSpacesPerSource = (terrain: RoomTerrain, pos: RoomPosition): RoomPosition[] => {
    return getAdjacentTiles(pos).filter(({ x, y }) => terrain.get(x, y) === 0);
  };

  const commonPaths = (roomMemory: RoomMemory): CommonPaths => {
    if (!roomMemory?.spawn) return {} as CommonPaths;

    const work = roomMemory.work;
    const sources = work.sources ?? [];
    const controllers = work.controllers ?? [];
    const roomSpawn = roomMemory.spawn.obj;

    return {
      spawnToSources: sources ? sources.map(c => Traveler.findTravelPath({ pos: roomSpawn }, c.obj).path) : [],
      spawnToControllers: controllers
        ? controllers.map(c => Traveler.findTravelPath({ pos: roomSpawn }, c.obj).path)
        : [],
      sourcesToControllers: _.flatten(
          _.map(controllers, c => _.map(sources, s => Traveler.findTravelPath(s.obj, c.obj).path)))
        ?? []
    };
  };

  const spawn = (room: Room, roomMemory: RoomMemory): ScreepsObj<RoomPosition> => {
    return roomMemory?.spawn ??
      _.map(room.find(FIND_MY_SPAWNS), s => {
        return { id: s.id, obj: s.pos } as ScreepsObj<RoomPosition>;
      })[0];
  };

  export const plan = (room: Room, roomMemory: RoomMemory): void => {
    if (!room.controller?.my) return;
    roomMemory.spawn = spawn(room, roomMemory);
    roomMemory.work = planWork(room);
    roomMemory.paths = commonPaths(roomMemory);
    // Refresh stats every 50 ticks by default
    const maxOutput = roomMemory.work.openSpacesPerSource.reduce((acc, cur) => acc + cur.obj.length * 2, 0);
    roomMemory.stats = { interval: 50, lastUpdated: Game.time, maxOutput } as RoomStats;
    // TODO: plan / create construction sites for extensions
    RoomVisuals.drawCommonPaths(room, roomMemory.paths);
    createConstructionSites(room);
    log.info(`Finished planning Room ${room.name}`);
    roomMemory.planned = true;
  };

  function createConstructionSites(room: Room) {
    for (let path of room.memory.paths?.spawnToSources) {
      for (let { x, y } of path) {
        room.createConstructionSite(room.getPositionAt(x, y)!, STRUCTURE_ROAD);
      }
    }
    for (let path of room.memory.paths?.sourcesToControllers) {
      for (let { x, y } of path) {
        room.createConstructionSite(room.getPositionAt(x, y)!, STRUCTURE_ROAD);
      }
    }
    for (let path of room.memory.paths?.spawnToControllers) {
      for (let { x, y } of path) {
        room.createConstructionSite(room.getPositionAt(x, y)!, STRUCTURE_ROAD);
      }
    }
  }

  function planWork(room: Room): WorkDetails {
    const terrain = room.getTerrain();
    const work = {} as WorkDetails;

    work.sources = _.sortBy(room.find(FIND_SOURCES), s => {
      const roomMemory = room.memory as RoomMemory;
      const spawnPosition = roomMemory?.spawn?.obj;
      return s ? Traveler.findTravelPath(s.pos, { pos: spawnPosition }).cost : -1;
    })?.map(s => ({ id: s.id, obj: s.pos } as ScreepsObj<RoomPosition>));

    work.controllers = room
      .find(FIND_STRUCTURES)
      .filter(s => s.structureType === STRUCTURE_CONTROLLER)
      .map(s => ({ id: s.id, obj: s.pos } as ScreepsObj<RoomPosition>));

    work.numSources = work.sources.length;
    work.outputParts = work.numSources * 5;

    work.openSpacesPerSource = work.sources.map(s => {
      return {
        id: s.id,
        obj: openSpacesPerSource(terrain, s.obj)
      } as ScreepsObj<RoomPosition[]>;
    });

    return work;
  }
}

export default RoomPlanner;
