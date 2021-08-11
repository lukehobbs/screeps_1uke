import { Option } from "../../UtilityAi/Option";
import { MineAction } from "../Actions/MineAction";
import { BuildAction } from "../Actions/BuildAction";

export abstract class BuildOption<T extends HasPos> extends Option {
  action: MineAction<T>;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new BuildAction(destinationId);
  }
}

