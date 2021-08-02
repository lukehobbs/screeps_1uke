export function log(msg: string, creep: Creep | null = null): void {
  const creeps = _.values(Game.creeps) as Creep[];
  const longestName = _.last(_.sortBy(creeps, function(creep) {
    return creep.name.length;
  })).name;

  let creepName = creep?.name;
  if (creepName !== undefined) {
    creepName = "\t[".concat(creepName).padEnd(longestName.length + 2, " ").concat("]: ");
  } else {
    creepName = "";
  }
  console.log(`[${Game.time}]:${creepName} ${msg}`);
}

export function logHorizSeparator(): void {
  log("---------------------");
}
