// noinspection JSUnusedGlobalSymbols

import { ErrorMapper } from "utils/ErrorMapper";
import { SpawnAi } from "./ai-v2/spawn-ai";
import { cleanupMemory } from "./cleanupMemory";
import { logHorizSeparator } from "./log";
import { spawnHandler } from "./spawn/handler";
import { workHandler } from "./work/handler";

export class Spawn {
  object: StructureSpawn;
  id: string;
  room: Room;
  creeps: Creep[];
  flags: Flag[];
  structures: AnyStructure[];
  controller: StructureController;
  sources: Source[];
  extensions: StructureExtension[];
  containers: StructureContainer[];
  constructionSites: ConstructionSite[];
  droppedResources: Resource[];
  droppedEnergy: Resource<RESOURCE_ENERGY>[];

  constructor(spawnName: string) {
    this.id = spawnName;
    this.object = Game.spawns[spawnName as string];

    this.room = this.object.room;
    this.structures = this.room.find(FIND_STRUCTURES);
    this.constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
    this.extensions = this.structures?.filter((s) => {
      return s.structureType === STRUCTURE_EXTENSION;
    }) as StructureExtension[];
    this.containers = this.structures?.filter((s) => {
      return s.structureType === STRUCTURE_CONTAINER;
    }) as StructureContainer[];
    this.controller = _.first(this.structures.filter((s) => {
      return s.structureType === STRUCTURE_CONTROLLER;
    })) as StructureController;
    this.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);
    this.sources = this.room.find(FIND_SOURCES);
    this.creeps = _.values(Game.creeps);
    this.flags = _.values(Game.flags);


    this.droppedEnergy = this.droppedResources.filter((r) => {
      return r.resourceType === RESOURCE_ENERGY;
    }) as Resource<RESOURCE_ENERGY>[];
  }
}

export const spawn = new Spawn("Home");
export const spawnAi = new SpawnAi(spawn);

export const loop = ErrorMapper.wrapLoop(() => {
  logHorizSeparator();
  cleanupMemory();
  spawnHandler();
  workHandler();
  // spawnAi.execute();
});
