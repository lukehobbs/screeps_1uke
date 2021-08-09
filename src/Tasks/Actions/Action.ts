import { Task } from "../Task";
import { Score } from "./Score";

export interface IAction {
  id: string;
  task: Task;

  scores: Score[];
  condition: (context: IContext) => boolean;

  eval(context: IContext): number;

  validateScore(score: number): void;
}

export interface IContext {
}

export abstract class Action implements IAction {
  protected constructor(id: string, scores: Score[]) {
    this.id = id;
    this.scores = scores;
  };

  condition: (context: IContext) => boolean = () => true;

  eval(context: IContext): number {
    if (!this.condition(context)) {
      return -Infinity;
    }

    return this.scores
      .map(_score => {
        return this.validateScore(_score.fun(context));
      })
      .reduce((acc, s) => acc + s, 0);
  }

  id: string;
  scores: Score[];
  abstract task: Task;

  validateScore(score: number): number {
    if (!isNaN(score)) return score;
    else return 0;
  }
}