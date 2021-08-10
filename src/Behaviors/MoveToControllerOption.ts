import { Score } from "../UtilityAi/Score";
import { inventoryIsEmpty, inventoryIsFull, MoveOption } from "./GenericOptions/MoveOption";

export class MoveToControllerOption extends MoveOption<StructureController> {
  constructor(destinationId: string) {
    super(`Move to controller ${destinationId}`, destinationId);

    this.condition = ({ creep }): boolean => inventoryIsFull(creep);

    this.scores = [];

    this.scores.push(new Score("upgrade events last tick", (context => {
      const eventLog = context.room.getEventLog();

      const upgradeEvents = eventLog.filter(e => e.event === EVENT_UPGRADE_CONTROLLER);

      return -1 * upgradeEvents.length;
    })))

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 175);
    }));

    this.scores.push(new Score("inventory is empty", ({ creep }: IContext): number => {
      return Number(inventoryIsEmpty(creep) && -150);
    }));

    this.scores.push(new Score("proximity to source", ({ creep, room }: IContext): number => {
      for (let source of room.memory.work.sources) {
        if (creep.pos.isNearTo(source.obj)) {
          return -Infinity;
        }
      }
      return 0;
    }));

    this.scores.push(new Score("no one else near controller", ({ creep, room }): number => {
      const controller = Game.getObjectById(destinationId as Id<StructureController>);

      if (!controller) return -Infinity;

      const { x, y } = controller.pos;

      const creepsNearController = room.lookForAtArea(LOOK_CREEPS, y - 3, x - 3, y + 3, x + 3, true).length;

      return creepsNearController === 0 ? 50 : 0;
    }));
  }
}