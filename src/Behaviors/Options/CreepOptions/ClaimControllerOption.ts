import { Score } from "../../../UtilityAi/Score";
import { ClaimControllerSelector } from "../Selectors/ClaimControllerSelector";
import { Scores } from "../../Scores/Scores";

export class ClaimControllerOption extends ClaimControllerSelector {
  target: string | undefined;
  targetRoom: string | undefined;

  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ creep }: IContext): boolean => {
      this.target = creep.memory.target;
      if (!this.target) return false;
      this.targetRoom = creep.memory.targetRoom;
      if (!this.targetRoom) return false;

      return creep.getActiveBodyparts(CLAIM) > 0 || (this.targetRoom !== undefined && this.targetRoom !== creep.room.name);
    };

    this.scores = [];

    this.scores.push(new Score("", (): number => {
      return 2;
    }));

    this.scores.push(new Scores.CreepUsedCapacityLinear());
  }
}