import { Option } from "../UtilityAi/Option";
import { HarvestAction } from "./HarvestAction";

export abstract class HarvestOption<T extends HasPos> extends Option {
  action: HarvestAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new HarvestAction(destinationId);
  }
}

