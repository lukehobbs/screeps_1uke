import { Option } from "../UtilityAi/Option";
import { PickupAction } from "./PickupAction";

export abstract class PickupOption extends Option {
  action: PickupAction;

  protected constructor(id: string, destinationId: string) {
    super(id, []);
    this.action = new PickupAction(destinationId);
  }
}

