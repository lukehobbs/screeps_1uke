import { Score } from "../UtilityAi/Score";
import { inventoryIsFull } from "./GenericOptions/MoveOption";
import { RESOURCE_ENERGY } from "../../test/unit/constants";
import { BuildOption } from "./GenericOptions/BuildOption";

export class BuildConstructionSiteOption extends BuildOption<AnyStructure> {
  constructor(destinationId: string) {
    super(`Work on construction site ${destinationId}`, destinationId);

    this.condition = ({ creep }): boolean => {
      const dest = Game.getObjectById(destinationId as Id<AnyStructure>);

      if (!dest) return false;

      return creep.pos.isNearTo(dest.pos) && creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0;
    };

    this.scores = [];

    this.scores.push(new Score("upgrade events last tick", (context => {
      const eventLog = context.room.getEventLog();

      const upgradeEvents = eventLog.filter(e => e.event === EVENT_UPGRADE_CONTROLLER);

      return 5 * upgradeEvents.length;
    })))

    this.scores.push(new Score("near to site", ({ creep }: IContext): number => {
      const dest = Game.getObjectById(destinationId as Id<AnyStructure>);

      if (!dest) return -Infinity;

      return Number((creep.pos.getRangeTo(dest.pos) === 1) && 50);
    }));

    this.scores.push(new Score("inventory is full", ({ creep }: IContext): number => {
      return Number(inventoryIsFull(creep) && 50);
    }));

    this.scores.push(new Score("energy onboard", ({ creep: { store } }: IContext): number => {
      return Number(store.getUsedCapacity(RESOURCE_ENERGY));
    }));
  }
}