export const log = (msg: string): void => {
  console.log(`[${Game.time}]: ${msg}`);
};

export const execute = (creep: Creep): void => {
  log(`Executing harvester commands for ${creep.name}`);
}
