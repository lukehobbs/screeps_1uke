export const log = {
  colored: (color: string, msg: string): string => `<span style="color:${color}">${msg}</span>`,
  action: (msg: any, creep?: Creep): void => {
    !!creep ? log.print(log.colored("powderblue", `${padCreepName(creep.name)} ${msg}`))
      : log.print(log.colored("powderblue", msg));
  },
  info: (msg: any): void => log.print(log.colored("white", msg)),
  error: (msg: any): void => log.print(log.colored("red", msg)),
  warning: (msg: any): void => log.print(log.colored("yellow", msg)),
  debug: (msg: any): void => log.print(log.colored("dimgray", msg)),
  getTickstamp: (): string => log.colored("dimgray", `[${Game.time}]`),
  print: (msg: any): void => console.log(`${log.getTickstamp()} ${msg}`)
};

const padCreepName = (name?: string): string => {
  if (!name) return "";
  const creeps = _.values(Game.creeps) as Creep[];
  const longestName = _.last(_.sortBy(creeps, creep => creep.name.length))?.name;
  return "[".concat(name).padEnd(longestName.length + 2, " ").concat("]");
};
