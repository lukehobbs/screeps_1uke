import { Option } from "../../UtilityAi/Option";
import { MineAction } from "../Actions/MineAction";

export abstract class HarvestOption<T extends HasPos> extends Option {
  action: MineAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new MineAction(destinationId);
  }
}

