import { UtilityAi } from "utility-ai";
import { Action } from "./Tasks/Actions/Action";
import { MoveAction } from "./Tasks/Actions/MoveAction";


//create move action with task isnide as prop

const utilityAi = new UtilityAi;

utilityAi.addAction(new MoveAction("Move to source"));
// utilityAi.addAction("Move to spawn");
// utilityAi.addAction("Move to extension");
// utilityAi.addAction("Move to controller");
// utilityAi.addAction("Move to construction site");
// utilityAi.addAction("Move to container");
//
// utilityAi.addAction("Mine source");
//
// utilityAi.addAction("Transfer energy to spawn");
// utilityAi.addAction("Transfer energy to extension");
// utilityAi.addAction("Transfer energy to controller");
// utilityAi.addAction("Transfer energy to construction site");
//
// utilityAi.addAction("Transfer energy to container");
// utilityAi.addAction("Transfer energy from container");