export class Score {
  description: string;
  fun: (context: IContext) => number;

  constructor(description: string, fun: (context: IContext) => number) {
    this.description = description;
    this.fun = fun;
  }
}