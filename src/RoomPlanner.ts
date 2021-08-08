import { CommonPaths, RoomMemory, RoomStats, ScreepsObj, WorkDetails } from "./types/types";
import RoomVisuals from "./RoomVisuals";
import { Traveler } from "./utils/traveler/traveler";
import { getAdjacentTiles } from "./utils/helpers";
import { log } from "./utils/log";

namespace RoomPlanner {
  const openSpacesPerSource = (terrain: RoomTerrain, pos: RoomPosition): number => {
    return getAdjacentTiles(pos).filter(({ x, y }) => terrain.get(x, y) === 0).length;
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
    roomMemory.spawn = spawn(room, roomMemory);
    roomMemory.work = planWork(room);
    roomMemory.paths = commonPaths(roomMemory);
    // Refresh stats every 50 ticks by default
    const maxOutput = roomMemory.work.openSpacesPerSource.reduce((acc, cur) => acc + cur.obj * 2, 0);
    roomMemory.stats = { interval: 50, lastUpdated: Game.time, maxOutput } as RoomStats;
    // TODO: plan / create construction sites for extensions
    RoomVisuals.drawCommonPaths(room, roomMemory.paths);

    log.info(`Finished planning Room ${room.name}`);
    roomMemory.planned = true;
  };

  function planWork(room: Room): WorkDetails {
    const terrain = room.getTerrain();
    const work = {} as WorkDetails;

    work.sources = _.sortBy(room.find(FIND_SOURCES), s => {
      const roomMemory = room.memory as RoomMemory;
      const spawnPosition = roomMemory.spawn.obj;
      return s ? Traveler.findTravelPath(s.pos, { pos: spawnPosition }).cost : -1;
    }).map(s => ({ id: s.id, obj: s.pos } as ScreepsObj<RoomPosition>));

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
      } as ScreepsObj<number>;
    });

    return work;
  }
}

export default RoomPlanner;
