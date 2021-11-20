// Colors
import { ActionStatus } from "../UtilityAi/Action";

const WHITE = "#FFFFFF";
const RED = "#FF0000";
const POWDER_BLUE = "#DDDDFF";
const YELLOW = "#00FFFF";
const DIM_GRAY = "#555555";
const GREEN = "#00FF00";

const COLOR_SCALE = [
  "#29f800",
  "#50f100",
  "#75ea00",
  "#00ff00",
  "#97e300",
  "#b7dc00",
  "#d4d400",
  "#cdab00",
  "#c68400",
  "#bf6000",
  "#b83d00",
  "#b11e00",
  "#aa0000"
];

export const log = {
  colored: (color: string, msg: string): string => `<span style="color:${color}">${msg}</span>`,
  coloredAction: (color: string, msg: string, creep?: Creep): string => `<span style="color:${color}">${!!creep ? padCreepName(creep.name) : ""} ${msg}</span>`,
  action: (msg: any, creep?: Creep): void => {
    !!creep ? log.print(log.colored(POWDER_BLUE, `${padCreepName(creep.name)} ${msg}`))
      : log.print(log.colored(POWDER_BLUE, msg));
  },
  info: (msg: any): void => log.print(log.colored(WHITE, msg)),
  error: (msg: any): void => log.print(log.colored(RED, msg)),
  warning: (msg: any): void => log.print(log.colored(YELLOW, msg)),
  debug: (msg: any): void => log.print(log.colored(DIM_GRAY, msg)),
  debugAction: (msg: any, creep?: Creep): void => {
    !!creep ? log.print(log.colored(DIM_GRAY, `${padCreepName(creep.name)} ${msg}`))
      : log.print(log.colored(DIM_GRAY, msg));
  },
  // getTickstamp: (): string => log.colored(DIM_GRAY, `[${Game.time}]`),
  // getTickstamp: (): string => "",
  print: (msg: any): void => console.log(msg),
  success: (msg: any): void => log.print(log.colored(GREEN, msg)),
  score: (score: number): string => {
    return `<span style="color:${COLOR_SCALE[Math.floor((1 - score) * (COLOR_SCALE.length - 1))]}">${score.toFixed(2)}</span>`;
  },
  status: (state: ActionStatus): string => {
    const score = state === ActionStatus.SUCCESS ? 1 : 0;
    return `<span style="color:${COLOR_SCALE[Math.floor((1 - score) * (COLOR_SCALE.length - 1))]}">${state}</span>`;
  }
};

const padCreepName = (name?: string): string => {
  if (!name) return "";
  const creeps = _.values(Game.creeps) as Creep[];
  const longestName = _.last(_.sortBy(creeps, creep => creep.name.length))?.name;
  return "[".concat(name).padEnd(longestName.length + 1, " ").concat("]");
};

