import { Option } from "../../UtilityAi/Option";
import { RESOURCE_ENERGY } from "../../../test/unit/constants";
import { DropAction } from "../Actions/DropAction";

export abstract class DropOption extends Option {
  action: DropAction;

  protected constructor(id: string, resourceType: ResourceConstant = RESOURCE_ENERGY) {
    super(id, []);
    this.action = new DropAction(resourceType);
  }
}

