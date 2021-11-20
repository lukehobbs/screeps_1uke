import { Score } from "../../../UtilityAi/Score";
import { Option } from "../../../UtilityAi/Option";
import { DropAction } from "../../Actions/DropAction";
import { Action } from "UtilityAi/Action";
import RoomPlanner from "../../../Room/RoomPlanner";

export class DropEnergyOption extends Option {
  action: Action;

  constructor() {
    super("Drop energy", []);

    this.action = new DropAction(RESOURCE_ENERGY);

    this.condition = ({ creep, room }: IContext): boolean => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
      if (creep?.ticksToLive && creep.ticksToLive < 2) return true;
      if (!room.memory.work) return false;
      const tiles = RoomPlanner.getAdjacentTiles(creep.pos);
      return _.all(tiles, (t: RoomPosition): boolean => {
        return new RoomPosition(t.x, t.y, room.name).lookFor("creep").length === 1;
      });
    };

    this.scores = [];

    this.scores.push(new Score("base value", (): number => 200));
  }
}