import { IOption } from "./Option";
import { log } from "../Utils/log";

export const runOption = (context: IContext, option: IOption, debug: boolean = false): string | null => {
  let status = option.action.run(context);
  if (debug) {
    return log.coloredAction("dimgray", _.padRight(option.id, 36) + `: ${status}`, context.creep);
  } else return null;
};