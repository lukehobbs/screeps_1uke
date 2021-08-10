import { Action, ActionStatus } from "../../UtilityAi/Action";

export class BuildAction extends Action {
  siteId: string;


  constructor(siteId: string) {
    super();
    this.siteId = siteId;
  }

  run(context: IContext): ActionStatus {
    const site = Game.getObjectById(this.siteId as Id<ConstructionSite>);

    if (!site) return ActionStatus.FAILURE;

    const err = context.creep.build(site);

    if (err === OK) {
      return ActionStatus.SUCCESS;
    } else {
      return ActionStatus.FAILURE;
    }
  }
}