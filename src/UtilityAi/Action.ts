// Inspiration:
//  github.com/glitchassassin/screeps
//  edirlei.com/aulas/game-ai-2020/GAME_AI_Lecture_08_Behavior_Trees_2020.html

export enum ActionStatus {
  NONE = "none",
  SUCCESS = "success",
  FAILURE = "failure",
  RUNNING = "running"
}

export abstract class Action {
  public status: ActionStatus;
  protected children: Action[];

  protected constructor() {
    this.children = [];
    this.status = ActionStatus.NONE;
  }

  // public addChild(task: Action) {
  //   this.children.push(task);
  // }

  public abstract run(context: IContext): ActionStatus;
}
