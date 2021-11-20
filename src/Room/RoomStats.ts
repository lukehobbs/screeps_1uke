import { RoomStats } from "../Types/types";

namespace RoomStatistics {
  // function energyHarvestedInLastTick(room: Room) {
  //   return _.sum(room.getEventLog().filter(e => e.event === EVENT_HARVEST).map(e => {
  //     // @ts-ignore
  //     return e.data.amount;
  //   }));
  // }

  export function updateStats(room: Room, stats: RoomStats): void {
    // const roomMemory = room.memory as RoomMemory;

    // const sources = roomMemory.work.sources;
    // const sourceObjs = room.find(FIND_SOURCES).filter(source => sources.map(s => s.id).includes(source.id));
    // const harvestedInLastTick = energyHarvestedInLastTick(room);

    // const harvestingCreeps: Creep[] = _.filter(_.values(Game.creeps), (c: Creep) => {
    //   return _.some(sourceObjs, s => {
    //     const travelState = (c.memory as CreepMemory)?._trav?.state;
    //     const travelDestination = travelState ? room.getPositionAt(travelState[4], travelState[5]) : undefined;
    //     const sourceIsDestination = travelDestination
    //       ? travelDestination.x === s.pos.x && travelDestination.y === s.pos.y && (travelDestination?.roomName || "") === s.room.name
    //       : false;
    //     return s.pos.isNearTo(c.pos) || sourceIsDestination;
    //   });
    // });
    //
    // const maxEnergyThisTick = _.reduce(harvestingCreeps, (acc: number, creep: Creep): number => {
    //     return acc + creep.body.filter(p => p.type === WORK).length * 2;
    //   },
    //   0
    // );
    if (!stats) stats = {} as RoomStats;
    stats.lastUpdated = Game.time;
    // stats.lastOutput = stats.output;
    // stats.lastHarvestEvents = stats.harvestEvents;
    // stats.harvestEvents = harvestedInLastTick;
    // stats.output = _.min([maxEnergyThisTick, harvestedInLastTick]) ?? 0;
    // stats.outputEfficiency = stats.output / stats.maxOutput;
  }

  export function getCurrentMiners(sources: Source[], room: Room) {
    return _.flatten(sources.map((source: Source): Creep[] => {
      const top = source.pos.y - 1;
      const bottom = source.pos.y + 1;
      const left = source.pos.x - 1;
      const right = source.pos.x + 1;

      return room.lookForAtArea(LOOK_CREEPS, top, left, bottom, right, true).map((result): Creep => {
        return result.creep;
      });
    }));
  }

  export function findWorstMiner(room: Room): Creep {
    const sources = room.find(FIND_SOURCES)
    const currentMiners: Creep[] = getCurrentMiners(sources, room);
    return _.sortBy(currentMiners, (miner: Creep): number => {
      return _.size(miner.body.filter((part: BodyPartDefinition): boolean => {
        return part.type === WORK
      }))
    })[0];
  }
}

export default RoomStatistics;