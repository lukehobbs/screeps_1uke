import { RoomMemory, WorkDetails, CommonPaths } from "./types/types";
import { ROOM_ORIGIN } from "./constants";
import { getAdjacentTiles } from "./utils/helpers";
import { FIND_STRUCTURES } from "../test/unit/constants";

const number = 3000;
namespace RoomPlanner {

  function spawnLocation(terrain: RoomTerrain): RoomPosition {
    let spawnLocation;

    while (spawnLocation === undefined) {
      ROOM_ORIGIN.forEach(({ x, y }) => {
        const mapOrigin = terrain.get(x, y) as 0 | TERRAIN_MASK_WALL | TERRAIN_MASK_SWAMP;
        if (mapOrigin === 0) {
          spawnLocation = { x: x, y: y };
          return;
        }
      });
    }

    return spawnLocation as RoomPosition;
  }

  function calculatePartsPerSource(terrain: RoomTerrain, pos: RoomPosition): number {
    const adjacentTiles = getAdjacentTiles(pos);
    return Math.ceil(5 / adjacentTiles.filter(({ x, y }) => terrain.get(x, y) === 0).length);
  }

  function planWork(room: Room, terrain: RoomTerrain, work: WorkDetails) {
    work.sources = room.find(FIND_SOURCES).map(s => [s.id, s.pos]);
    work.controllers = room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_CONTROLLER).map(s => [s.id, s.pos]);
    work.numSources = work.sources.length;
    work.outputParts = work.numSources * 5;
    work.outputPartsPerSource = work.sources.map(s => [s[0], calculatePartsPerSource(terrain, s[1])]);
  }

  function createSpawn(room: Room, terrain: RoomTerrain) {
    if (room.find(FIND_MY_SPAWNS).length === 0) {
      room.createConstructionSite(spawnLocation(terrain), STRUCTURE_SPAWN);
    }
    (room.memory as RoomMemory).spawn = _.map(room.find(FIND_MY_SPAWNS), s => [s.id, s.pos])[0] as [string, RoomPosition];
  }

  function storeCommonPaths(room: Room, work: WorkDetails, paths: CommonPaths) {
    const spawn = (room.memory as RoomMemory).spawn;
    if (!spawn) return;
    paths.spawnToSources = work.sources?.map(c => spawn[1].findPathTo(c[1]));
    paths.spawnToControllers = work.controllers?.map(c => spawn[1].findPathTo(c[1]));
    paths.sourcesToControllers = work.sources?.flatMap(s => (work.controllers ?? []).map(c => s[1].findPathTo(c[1])));
  }

  export const plan = (room: Room) => {
    const { planned } = room.memory as RoomMemory;
    if (planned) return;

    const { work, paths } = room.memory as RoomMemory;

    const terrain = room.getTerrain();

    createSpawn(room, terrain);
    planWork(room, terrain, work);
    storeCommonPaths(room, work, paths);
  };

}

export default RoomPlanner;