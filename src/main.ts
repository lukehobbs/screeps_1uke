// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "Utils/ErrorMapper";
import { cleanupMemory } from "./Memory/cleanupMemory";
import RoomPlanner from "./Room/RoomPlanner";
import { MoveToSpawnOption } from "./CreepAi/Options/MoveToSpawnOption";
import { TransferEnergyToSpawn } from "./CreepAi/Options/TransferEnergyToSpawn";
import { MoveToSourceOption } from "./CreepAi/Options/MoveToSourceOption";
import { CreepUtilityAi } from "./CreepAi/CreepUtilityAi";
import { HarvestSourceOption } from "./CreepAi/Options/HarvestSourceOption";
import { runCreepOption } from "./UtilityAi/runCreepOption";
import { DropEnergyOption } from "./CreepAi/Options/DropEnergyOption";


function initializeCreepOptions(ai: CreepUtilityAi, room: Room) {
  ai.addOption(new MoveToSpawnOption(room.memory.spawn.id));
  ai.addOption(new TransferEnergyToSpawn(room.memory.spawn.id));
  ai.addOption(new DropEnergyOption());

  for (let source of room.memory.work.sources) {
    ai.addOption(new MoveToSourceOption(source.id));
    ai.addOption(new HarvestSourceOption(source.id));
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  cleanupMemory();

  const creepUtilityAi = new CreepUtilityAi("creep-ai");

  for (const roomsKey in Game.rooms) {
    const room = Game.rooms[roomsKey];
    const roomMemory = room.memory as RoomMemory;

    if (!roomMemory.planned) {
      RoomPlanner.plan(room, roomMemory);
    }

    initializeCreepOptions(creepUtilityAi, room);

    for (const creep in Game.creeps) {
      const context = { creep: Game.creeps[creep], room: room } as IContext;

      const option = creepUtilityAi.bestOption(context);

      console.log(option.id);

      runCreepOption(Game.creeps[creep], room, option);
    }
  }
});
