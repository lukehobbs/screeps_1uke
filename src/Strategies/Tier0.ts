import { Strategy } from "./Strategy";
import { Task, TaskStatus } from "../Tasks/Task";
import { Sequence } from "../Tasks/Sequence";
import { Selector } from "../Tasks/Selector";
import { CreepStoreCondition, StoreConstant } from "../Tasks/Conditions/CreepStoreCondition";
import { TransferAction } from "../Tasks/Actions/TransferAction";
import { HarvestAction } from "../Tasks/Actions/HarvestAction";
import { MoveAction } from "../Tasks/Actions/MoveAction";

export class Tier0 extends Strategy {
  behaviorTree: Task = new Selector();
  behaviorTreeStatus: TaskStatus = TaskStatus.NONE;

  start(creep: Creep): void {
    const sequenceLoad = new Sequence();
    sequenceLoad.addChild(new CreepStoreCondition(RESOURCE_ENERGY, StoreConstant.FULL));

    const selectorMoveOrLoad = new Selector();
    selectorMoveOrLoad.addChild(new MoveAction(creep.memory.loadTarget));
    selectorMoveOrLoad.addChild(new HarvestAction(creep.memory.loadTarget));
    sequenceLoad.addChild(selectorMoveOrLoad);

    const sequenceUnload = new Sequence();
    sequenceUnload.addChild(new CreepStoreCondition(RESOURCE_ENERGY, StoreConstant.NOT_FULL));

    const selectorMoveOrUnload = new Selector();
    selectorMoveOrLoad.addChild(new MoveAction(creep.memory.unloadTarget));
    selectorMoveOrLoad.addChild(new TransferAction(creep.memory.unloadTarget, RESOURCE_ENERGY));
    sequenceUnload.addChild(selectorMoveOrUnload);

    this.behaviorTree.addChild(sequenceLoad);
    this.behaviorTree.addChild(sequenceUnload);
  }

  update(creep: Creep): void {
    super.update(creep);
  }
}