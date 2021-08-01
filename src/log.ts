export function log(msg: string, creep: Creep | null = null): void {
  let creepName = creep?.name;
  if (creepName !== undefined) {
    creepName = "\t[".concat(creepName).padEnd(22, " ").concat("]: ");
  } else {
    creepName = "";
  }
  console.log(`[${Game.time}]:${creepName} ${msg}`);
}

export function logHorizSeparator(): void {
  log("---------------------");
}
