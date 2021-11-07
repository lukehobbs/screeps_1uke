import { Score } from "../../UtilityAi/Score";
import { GraffitiSelector } from "../Selectors/GraffitiSelector";

export class GraffitiOption extends GraffitiSelector {
  constructor(destinationId: string) {
    super(destinationId);

    this.condition = ({ room }: IContext): boolean => {
      return room.controller?.sign?.username !== "1uke";
    };

    this.scores = [];

    this.scores.push(new Score("", (): number => {
      return 1;
    }));
  }
}