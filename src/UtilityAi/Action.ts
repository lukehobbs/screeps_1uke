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

  public addChild(child: Action) {
    this.children.push(child);
  }

  public abstract run(context: IContext): ActionStatus;
}

export abstract class GenericAction<StorageType> extends Action {
  protected constructor() {
    super();
  }
}

