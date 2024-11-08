import { Action } from "./Action";
import { Score } from "./Score";
import { log } from "../Utils/log";

export interface IOption {
  id: string;
  action: Action;

  scores: Score[];
  condition: (context: IContext) => boolean;

  eval(context: IContext): number;

  validateScore(score: number): void;
}

export abstract class Option implements IOption {
  abstract action: Action;

  protected constructor(id: string, scores: Score[]) {
    this.id = id;
    this.scores = scores;
  };

  condition: (context: IContext) => boolean = () => true;

  eval(context: IContext): number {
    if (!this.condition(context)) {
      return -Infinity;
    }

    let score = this.scores
      .map(_score => {
        // console.log(`${_score.description} score: ${this.validateScore(_score.fun(context))}`)
        return this.validateScore(_score.fun(context));
      })
      .reduce((acc, s) => acc + s, 0);

    score = score / this.scores.length;

    // if (!context.creep) {
    //   console.log(`[${context.spawn.id}:${this.id}] Score: ${score}`);
    // }

    if (context?.creep && this.id !== "" && context.creep?.memory?.debug && score > 0) {
      log.action(`${this.id.padEnd(32, " ")}\tScore: ${log.score(score)}`, context.creep);
    }

    return score;
  }

  id: string;

  validateScore(score: number): number {
    if (!isNaN(score)) return score;
    else return 0;
  }
  scores: Score[];
}