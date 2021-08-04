import { FIND_SOURCES, FIND_STRUCTURES, STRUCTURE_CONTROLLER } from "../../test/unit/constants";
import { log } from "../utils/log";
import { Memory } from "../types/types";

export const globalMemory = (memory: any) => (memory as unknown as Memory);

let findEnergySources = (room: Room): Id<Source>[] => {
  log.debug(`Searching for energy sources in ${room.name}`);
  return room.find(FIND_SOURCES).map((s: Source) => s.id);
};

export const getEnergySources = (room: Room): Id<Source>[] => {
  globalMemory(Memory).energySources = globalMemory(Memory)?.energySources ?? findEnergySources(room);
  return globalMemory(Memory).energySources;
};

let findExtensions = (room: Room): Id<Structure>[] => {
  log.debug(`Searching for extensions in ${room.name}`);
  return room.find(FIND_STRUCTURES).filter((s: Structure) => s.structureType === STRUCTURE_EXTENSION).map((s: Structure) => s.id);
};

export const getExtensions = (room: Room) => {
  globalMemory(Memory).extensions = globalMemory(Memory)?.extensions ?? findExtensions(room);
  return globalMemory(Memory).extensions;
};

let findControllers = (room: Room): Id<Structure>[] => {
  log.debug(`Searching for controllers in ${room.name}`);
  return room.find(FIND_STRUCTURES).filter((s: Structure) => s.structureType === STRUCTURE_CONTROLLER).map((s: Structure) => s.id);
};

export const getControllers = (room: Room) => {
  globalMemory(Memory).controllers = globalMemory(Memory)?.controllers ?? findControllers(room);
  return globalMemory(Memory).controllers;
};

let findContainers = (room: Room): Id<Structure>[] => {
  log.debug(`Searching for containers in ${room.name}`);
  globalMemory(Memory).containersLastChecked = Game.time;
  return room.find(FIND_STRUCTURES).filter((s: Structure) => s.structureType === STRUCTURE_CONTAINER).map((s: Structure) => s.id);
};

export const getContainers = (room: Room) => {
  if ((Game.time - (globalMemory(Memory).containersLastChecked ?? 0)) >= 100) {
    globalMemory(Memory).containers = findContainers(room);
  }
  globalMemory(Memory).containers = globalMemory(Memory)?.containers ?? findContainers(room);
  return globalMemory(Memory).containers;
};