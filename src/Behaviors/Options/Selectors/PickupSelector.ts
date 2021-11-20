import { Option } from "../../../UtilityAi/Option";
import { Action } from "../../../UtilityAi/Action";
import { Selector } from "../../../UtilityAi/Selector";
import { MoveAction } from "../../Actions/MoveAction";
import { PickupResourceAction, PickupStructureAction } from "../../Actions/PickupActions";

export class PickupStructureSelector<StorageType extends Structure | Tombstone | Ruin> extends Option {
  action: Action;
  destinationId: string;

  constructor(storageId: string, resourceType: ResourceConstant) {
    super(`Pickup ${storageId}`, []);
    this.destinationId = storageId;

    this.action = new Selector();
    this.action.addChild(new PickupStructureAction(this.destinationId, resourceType));
    this.action.addChild(new MoveAction<StorageType>(this.destinationId));
  }
}

export class PickupResourceSelector extends Option {
  action: Action;
  destinationId: string;

  constructor(resourceId: string) {
    super(`Pickup ${resourceId}`, []);
    this.destinationId = resourceId;

    this.action = new Selector();
    this.action.addChild(new PickupResourceAction(this.destinationId));
    this.action.addChild(new MoveAction<Resource>(this.destinationId));
  }
}