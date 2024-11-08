import { IOption } from "./Option";
import { RoomStats } from "../Types/types";

declare global {
  interface IContext {
    creep: Creep;
    room: Room;
    roomStats: RoomStats;
    spawn: StructureSpawn;
    link: StructureLink;
  }

  interface Creep {
    memory: CreepMemory;
  }

  interface CreepMemory {
    _trav: any;
    debug: boolean;
    recycling: boolean;
    target: string;
    targetRoom: string | undefined;
  }

  interface RoomMemory {
    lastSpawned: number;
    debug: boolean;
    spawnSettler: string | undefined;
    spawnSmurfs: boolean | undefined;
    targetRoom: string | undefined;
    spawnOffense: boolean | undefined;
    spawnWarriors: boolean | undefined;
  }
}

interface IUtilityAi {
  name: string;

  options: IOption[];

  addOption(option: IOption): void;

  bestOption(context: IContext): IOption;

  removeOption(id: string): void;
}

export abstract class UtilityAi implements IUtilityAi {
  constructor(name: string) {
    this.name = name;
  }

  addOption(option: IOption): void {
    this.options.push(option);
  }

  bestOption(context: IContext): IOption {
    const optionsMap = this.options.map(a => ({
      id: a.id,
      score: a.eval(context)
    }));
    const cleanOptionsMap = optionsMap.filter((value): boolean => {
      return value.score !== -Infinity;
    });
    if (cleanOptionsMap !== [] && (context.creep && context.creep?.memory?.debug) || (!context.creep && context.room?.memory?.debug)) {
      // console.log(JSON.stringify(cleanOptionsMap));
    }
    const bestId = _.max(optionsMap, option => option.score).id;

    return _.find(this.options, option => option.id === bestId)!;
  }

  public name: string;

  options: IOption[] = [];

  removeOption(id: string) {
    const index = this.options.findIndex(a => a.id === id);
    delete this.options[index];
  }
}