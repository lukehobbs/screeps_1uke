import { Global } from "types";
export import Global = NodeJS.Global;

export const log = (msg: string): void => {
  if ((global as unknown as Global).log === "debug") {
    console.log(`[${Game.time}]: ${msg}`);
  }
};
