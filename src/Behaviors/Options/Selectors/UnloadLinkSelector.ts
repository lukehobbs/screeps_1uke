import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { UnloadLinkAction } from "../../Actions/UnloadLinkAction";

export class UnloadLinkSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Unload link ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = this.MoveOrUnloadLinkSelector();
  }

  MoveOrUnloadLinkSelector = (): Action => {
    const selector = new Selector();

    selector.addChild(new UnloadLinkAction(this.destinationId));
    selector.addChild(new MoveAction<StructureLink>(this.destinationId));

    return selector;
  };
}