import { FIND_SOURCES } from "../../test/unit/constants";
import { Memory } from "../types";

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

export const maxSupportedHarvesters = (room: Room | undefined): Map<string, number> => {
  const energySources = room?.find(FIND_SOURCES);
  const adjacentTiles: Map<string, RoomPosition[]> = new Map<string, RoomPosition[]>();
  const maxHarvesters: Map<string, number> = new Map<string, number>();
  energySources?.forEach(source => {
    adjacentTiles.set(source.id.toString(), getAdjacentTiles(source.pos));
    let totalFreeTiles = 0;
    adjacentTiles.forEach(tiles => {
      tiles.forEach(tile => {
        if (new Room.Terrain(room?.name ?? "").get(tile.x, tile.y) !== TERRAIN_MASK_WALL) {
          totalFreeTiles++;
        }
      });
    });
    maxHarvesters.set(source.id.toString(), totalFreeTiles);
  });
  return maxHarvesters;
};


export const globalMemory = function(memory: any) {
  return memory as unknown as Memory;
};

export const distanceBetween = function(a: RoomPosition, b: RoomPosition): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
};
