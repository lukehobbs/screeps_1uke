import { Option } from "../../UtilityAi/Option";
import { HarvestAction } from "../Actions/HarvestAction";
import { BuildAction } from "../Actions/BuildAction";

export abstract class BuildOption<T extends HasPos> extends Option {
  action: HarvestAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new BuildAction(destinationId);
  }
}

