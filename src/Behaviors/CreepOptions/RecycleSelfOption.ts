import { Score } from "../../UtilityAi/Score";
import { RecycleSelector } from "../Selectors/RecycleSelector";
import RoomStatistics from "../../Room/RoomStats";

import getCurrentMiners = RoomStatistics.getCurrentMiners;
import { FIND_SOURCES } from "../../../test/unit/constants";

export class RecycleSelfOption extends RecycleSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }: IContext): boolean => {
      return creep.body.filter((part): boolean => part.type == CARRY).length === 0 && creep.pos.findInRange(FIND_SOURCES, 1).length === 0;
    };

    this.scores = [];

    this.scores.push(new Score("no room for me to mine",({room}: IContext): number => {
      const currentMiners = getCurrentMiners(room.find(FIND_SOURCES), room).length

      const maxMiners = _.sum(room.memory.work.openSpacesPerSource.map((value): any => {
        return value.obj.length
      }));

      if (maxMiners === currentMiners) {
        return 10;
      } else {
        return 0;
      }
    }));

    this.scores.push(new Score("manual trigger", ({creep}: IContext): number => {
      return creep.memory.recycling ? 100 : 0;
    }));
  }
}