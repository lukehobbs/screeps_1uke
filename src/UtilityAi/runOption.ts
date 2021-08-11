import { IOption } from "./Option";
import { log } from "../Utils/log";

export const runOption = (context: IContext, option: IOption, debug: boolean = false) => {
  let status = option.action.run(context);
  if (debug) {
    log.debug(`${option.id} : ${status}`);
  }
};