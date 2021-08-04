import { FIND_SOURCES, TERRAIN_MASK_WALL } from "../../test/unit/constants";
import { HARVESTER } from "../constants";
import { CreepMemory, SpawnCreepParams } from "../types/types";
import { getAdjacentTiles } from "../utils/helpers";
import { getCreepBody } from "./getCreepBody";
import { getCreepName } from "./getCreepName";

export const maxSupportedHarvesters = (room: Room | undefined): Map<string, number> => {
  const energySources = room?.find(FIND_SOURCES) ?? [];
  const adjacentTiles: Map<string, RoomPosition[]> = new Map<string, RoomPosition[]>();
  const maxHarvesters: Map<string, number> = new Map<string, number>();
  for (let i = 0; i < energySources.length; i++){
    const source = energySources[i];
    adjacentTiles.set(source.id as string, getAdjacentTiles(source.pos));
    let totalFreeTiles = 0;
    adjacentTiles.get(source.id)?.forEach(tile => {
      if (room?.getTerrain().get(tile.x, tile.y) !== TERRAIN_MASK_WALL) {
        totalFreeTiles++;
      }
    });
    maxHarvesters.set(source.id.toString(), totalFreeTiles);
  }
  return maxHarvesters;
};

export const maybeGetNextHarvester = (spawn: StructureSpawn | undefined, dryRun: boolean): SpawnCreepParams | undefined => {
  let spawnParams: SpawnCreepParams | undefined;
  const currentHarvesters =
    _.filter(Game.creeps, (creep: Creep) => (creep.memory as CreepMemory | null)?.role === HARVESTER)
      .map(creep => (creep.memory as CreepMemory).working);

  const harvesterCountDesired = maxSupportedHarvesters(spawn?.room);

  // TODO: reconcile this and the getAdjacent tile stuff that sends 1 creep per open space
  if (currentHarvesters.length < 2) {
    harvesterCountDesired.forEach((desired: number, sourceId: string) => {
      const sourceHarvesters: number = currentHarvesters.filter(s => s === sourceId).length;

      if (sourceHarvesters < desired) {
        spawnParams = {
          body: getCreepBody(HARVESTER),
          name: getCreepName(HARVESTER) ?? "",
          opts: {
            dryRun: dryRun,
            memory: {
              role: HARVESTER,
              room: spawn?.room?.name ?? "",
              working: sourceId
            } as CreepMemory
          }
        };
        return;
      }
    });
  }
  return spawnParams;
};