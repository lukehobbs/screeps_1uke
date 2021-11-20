import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { TransferAction } from "../../Actions/TransferAction";

export class FillSpawnSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(destinationId: string) {
    super(`Fill spawn ${destinationId}`, []);
    this.destinationId = destinationId;

    this.action = this.MoveOrFillSpawnSelector();
  }

  MoveOrFillSpawnSelector = (): Action => {
    const selector = new Selector();

    selector.addChild(new TransferAction(this.destinationId));
    selector.addChild(new MoveAction<StructureSpawn>(this.destinationId));

    return selector;
  };
}