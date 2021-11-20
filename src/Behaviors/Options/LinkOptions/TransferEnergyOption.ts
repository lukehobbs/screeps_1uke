import { FIND_SOURCES, RESOURCE_ENERGY } from "../../../../test/unit/constants";
import { Option } from "../../../UtilityAi/Option";
import { LinkTransferAction } from "../../Actions/LinkTransferAction";
import { Action } from "../../../UtilityAi/Action";
import { Scores } from "../../Scores/Scores";

export class TransferEnergyOption extends Option {
  action: Action;

  constructor(targetId: string) {
    super(`Link transfer ${targetId}`, []);

    this.action = new LinkTransferAction(targetId);

    this.condition = ({ link }: IContext): boolean => {
      const ready = link.cooldown === 0;
      const full = link.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

      const isSourceLink = link.pos.findInRange(FIND_SOURCES, 2).length > 0;

      return ready && full && isSourceLink
        || (ready && isSourceLink && link.pos.findInRange(FIND_MY_CREEPS, 2).length == 0 && link.store.getUsedCapacity(RESOURCE_ENERGY) > 500);
    };

    this.scores = [new Scores.Default(1)];
  }
}