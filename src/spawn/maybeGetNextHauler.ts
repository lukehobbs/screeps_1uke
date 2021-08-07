import { FIND_MY_SPAWNS, FIND_STRUCTURES } from "../../test/unit/constants";
import { HAULER } from "../constants";
import { CreepMemory, SpawnCreepParams } from "../types/types";
import { getCreepBody } from "./getCreepBody";
import { getCreepName } from "./getCreepName";

export const maybeGetNextHauler = (spawn: StructureSpawn | undefined, dryRun: boolean): SpawnCreepParams | undefined => {
  let spawnParams: SpawnCreepParams | undefined;
  const currentHaulers =
    _.filter(Game.creeps, (creep: Creep) => (creep.memory as CreepMemory | null)?.role === HAULER)
      .map(creep => (creep.memory as CreepMemory).working);

  const haulerCountDesired = getDesiredHaulers(spawn?.room);

  haulerCountDesired?.forEach(d => {
    let currentHaulersForTarget: number = currentHaulers.filter(s => s === d[0]).length;

    if (d[0] === "extensions") {
      const extensions = spawn?.room.find(FIND_STRUCTURES).filter(s => s.structureType === STRUCTURE_EXTENSION).map(s => s.id);
      currentHaulersForTarget = currentHaulers.filter(s => (s ?? "") in (extensions ?? [])).length;
    }

    if (currentHaulersForTarget < d[1]) {
      spawnParams = {
        body: getCreepBody(HAULER),
        name: getCreepName(HAULER) ?? "",
        opts: {
          dryRun: dryRun,
          memory: {
            role: HAULER,
            room: spawn?.room?.name ?? "",
            working: d[0]
          }
        }
      };
      return;
    }
  });

  return spawnParams;
};

function getDesiredHaulers(room: Room | undefined): [string, number][] {
  if (room === undefined) return [];
  let structures: [string, number][] = [];

  const controller = room.find(FIND_STRUCTURES)
    .filter(structure => structure.structureType === STRUCTURE_CONTROLLER)[0] as StructureController;

  const spawn = room.find(FIND_MY_SPAWNS)[0] as StructureSpawn;

  if (spawn !== undefined) structures.push([spawn.id, 1]);
  if (controller !== undefined) structures.push([controller.id, 3]);
  structures.push(["extensions", 2]);

  return structures;
}