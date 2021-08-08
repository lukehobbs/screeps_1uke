// Heavily inspired by github.com/glitchassassin/screeps
// And this lecture on behavior trees https://edirlei.com/aulas/game-ai-2020/GAME_AI_Lecture_08_Behavior_Trees_2020.html

export enum TaskStatus {
  NONE = "none",
  SUCCESS = "success",
  FAILURE = "failure",
  RUNNING = "running"
}

export abstract class Task {
  public status: TaskStatus;
  protected children: Task[];

  protected constructor() {
    this.children = [];
    this.status = TaskStatus.NONE;
  }

  public addChild(task: Task) {
    this.children.push(task);
  }

  public abstract run(strategy: any, creep: Creep): TaskStatus;
}
