import { RenewCreepSelector } from "../Selectors/RenewCreepSelector";
import { Score } from "../../../UtilityAi/Score";
import { Scores } from "../../Scores/Scores";
import SpawnUsedCapacityLinear = Scores.SpawnUsedCapacityLinear;

export class RenewCreepOption extends RenewCreepSelector {
  constructor(spawnId: string) {
    super(spawnId);

    this.condition = ({ spawn, creep, room }: IContext): boolean => {
      const creepCost = _.sum(creep.body.map((b) => BODYPART_COST[b.type]));
      const bodySize = creep.body.length;
      if (Math.ceil(creepCost / 2.5 / bodySize) > room.energyAvailable) return false;
      if (spawn.spawning) return false;
      const ticksToLive = creep.ticksToLive || 0;

      if (creep.pos.isNearTo(spawn.pos) && ticksToLive < 300) return true;
      return ticksToLive < creep.pos.getRangeTo(spawn) + 10;
    };

    this.scores = [];

    this.scores.push(new Score("creep body worth renewing", ({ creep }: IContext): number => {
      // Only renewing the hauler creeps for now -- doesn't seem to make sense to tell the miners to leave their post
      // and go stand by the spawn to renew (when we could time it so a new creep is created right when the miner dies)
      // if (creep.getActiveBodyparts(WORK) > 4) return 1;
      if (creep.getActiveBodyparts(CARRY) > 6 && creep.getActiveBodyparts(WORK) > 2) return 1;

      return -Infinity;
    }));

    this.scores.push(new Score("ticks to live", ({ creep }: IContext): number => {
      return (1500 - (creep.ticksToLive || 0)) / 1500;
    }));

    this.scores.push(new SpawnUsedCapacityLinear());
  }

}

