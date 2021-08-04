import { FIND_MY_SPAWNS, FIND_STRUCTURES } from "../../test/unit/constants";
import { CreepMemory, SpawnCreepParams } from "../types";
import { getCreepBody } from "./getCreepBody";
import { getCreepName } from "./getCreepName";

export const maybeGetNextHauler = (spawn: StructureSpawn | undefined, dryRun: boolean): SpawnCreepParams | undefined => {
  let spawnParams: SpawnCreepParams | undefined;
  const currentHaulers =
    _.filter(Game.creeps, (creep: Creep) => (creep.memory as CreepMemory | null)?.role === "hauler")
      .map(creep => (creep.memory as CreepMemory).working);

  const haulerCountDesired = getDesiredHaulers(spawn?.room);

  haulerCountDesired?.forEach((desired: number, sourceId: string) => {
    const sourceHaulers: number = currentHaulers.filter(s => s === sourceId).length;

    if (sourceHaulers < desired) {
      spawnParams = {
        body: getCreepBody("hauler"),
        name: getCreepName("hauler") ?? "",
        opts: {
          dryRun: dryRun,
          memory: {
            role: "hauler",
            room: spawn?.room?.name ?? "",
            working: sourceId
          }
        }
      };
      return;
    }
  });

  return spawnParams;
};

function getDesiredHaulers(room: Room | undefined): Map<string, number> | undefined {
  if (room === undefined) return undefined;
  let structures: Map<string, number> = new Map();

  const controller = room.find(FIND_STRUCTURES)
    .filter(structure => structure.structureType === STRUCTURE_CONTROLLER)[0] as StructureController;

  const spawn = room.find(FIND_MY_SPAWNS)[0] as StructureSpawn;

  if (spawn !== undefined) structures.set(spawn.id, 1);
  structures.set("extensions", 1);
  if (controller !== undefined) structures.set(controller.id, 4);

  return structures;
}