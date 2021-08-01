export function log(msg: string, creep: Creep | null = null): void {
  let creepName = creep?.name?.concat("\t\t| ");
  creepName = creepName?.padStart(creepName.length + 1, "\t") ?? "";
  console.log(`[${Game.time}]:${creepName} ${msg}`);
}

export function logHorizSeparator(): void {
  log("---------------------");
}
