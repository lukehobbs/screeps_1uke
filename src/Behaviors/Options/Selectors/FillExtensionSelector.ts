import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { TransferAction } from "../../Actions/TransferAction";

export class FillExtensionSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Fill ext. ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = this.MoveOrFillExtensionSelector();
  }

  MoveOrFillExtensionSelector = (): Action => {
    const selector = new Selector();

    selector.addChild(new TransferAction(this.destinationId));
    selector.addChild(new MoveAction<StructureExtension>(this.destinationId));

    return selector;
  };
}