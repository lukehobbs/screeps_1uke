import { CreepMemory, RoomMemory, RoomStats } from "./types/types";

namespace RoomStatistics {
  function energyHarvestedInLastTick(room: Room) {
    return _.sum(room.getEventLog().filter(e => e.event === EVENT_HARVEST).map(e => {
      // @ts-ignore
      return e.data.amount;
    }));
  }

  export function updateStats(room: Room, stats: RoomStats): void {
    const roomMemory = room.memory as RoomMemory;
    const sources = roomMemory.work.sources;
    const sourceObjs = room.find(FIND_SOURCES).filter(source => sources.map(s => s.id).includes(source.id));
    const harvestedInLastTick = energyHarvestedInLastTick(room);

    const harvestingCreeps: Creep[] = _.filter(_.values(Game.creeps), (c: Creep) => {
      return _.some(sourceObjs, s => {
        const travelState = (c.memory as CreepMemory)?._trav?.state;
        const travelDestination = travelState ? new RoomPosition(travelState[4], travelState[5], s.room.name) : undefined;
        const sourceIsDestination = travelDestination
          ? travelDestination.x === s.pos.x && travelDestination.y === s.pos.y && travelDestination.roomName === s.room.name
          : false;
        return s.pos.isNearTo(c.pos) || sourceIsDestination;
      });
    });

    const maxEnergyThisTick = _.reduce(harvestingCreeps, (acc: number, creep: Creep): number => {
        return acc + creep.body.filter(p => p.type === WORK).length * 2;
      },
      0
    );

    stats.lastUpdated = Game.time;
    stats.lastOutput = stats.output;
    stats.lastHarvestEvents = stats.harvestEvents;
    stats.harvestEvents = harvestedInLastTick;
    stats.output = _.min([maxEnergyThisTick, harvestedInLastTick]) ?? 0;
    stats.outputEfficiency = stats.output / stats.maxOutput;
  }
}

export default RoomStatistics;