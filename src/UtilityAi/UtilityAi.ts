import { IAction, IContext } from "../Tasks/Actions/Action";

interface IUtilityAi {
  name: string;

  actions: IAction[];

  addAction(action: IAction): void;

  removeAction(id: string): void;

  best(context: IContext): IAction;
}

export abstract class UtilityAi implements IUtilityAi {
  actions: IAction[] = [];

  protected constructor(name: string) {
    this.name = name;
  }

  addAction(action: IAction): void {
    this.actions.push(action);
  }

  public name: string;

  removeAction(id: string) {
    const index = this.actions.findIndex(a => a.id === id);
    delete this.actions[index];
  }

  best(context: IContext): IAction {
    return this.actions
      .map(a => ({
        action: a.id,
        score: a.eval(context)
      }))
      .reduce((acc, { action, score }) => acc.score !== undefined && acc.score > score ? acc : action, {} as any);
  }
}