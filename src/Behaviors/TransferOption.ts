import { Option } from "../UtilityAi/Option";
import { TransferAction } from "./TransferAction";

export abstract class TransferOption extends Option {
  action: TransferAction;

  protected constructor(id: string, destinationId: string, resourceType: ResourceConstant) {
    super(id, []);
    this.action = new TransferAction(destinationId, resourceType);
  }
}

