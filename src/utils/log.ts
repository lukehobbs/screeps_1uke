import { DIM_GRAY, POWDER_BLUE, RED, WHITE, YELLOW } from "../constants";

export const log = {
  colored: (color: string, msg: string): string => `<span style="color:${color}">${msg}</span>`,
  action: (msg: any, creep?: Creep): void => {
    !!creep ? log.print(log.colored(POWDER_BLUE, `${padCreepName(creep.name)} ${msg}`))
      : log.print(log.colored(POWDER_BLUE, msg));
  },
  info: (msg: any): void => log.print(log.colored(WHITE, msg)),
  error: (msg: any): void => log.print(log.colored(RED, msg)),
  warning: (msg: any): void => log.print(log.colored(YELLOW, msg)),
  debug: (msg: any): void => log.print(log.colored(DIM_GRAY, msg)),
  getTickstamp: (): string => log.colored(DIM_GRAY, `[${Game.time}]`),
  print: (msg: any): void => console.log(`${log.getTickstamp()} ${msg}`)
};

const padCreepName = (name?: string): string => {
  if (!name) return "";
  const creeps = _.values(Game.creeps) as Creep[];
  const longestName = _.last(_.sortBy(creeps, creep => creep.name.length))?.name;
  return "[".concat(name).padEnd(longestName.length + 2, " ").concat("]");
};
