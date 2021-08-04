import { Game, Memory } from "./mock";

const globalAny: any = global;

globalAny.log = "debug";

beforeEach(() => {
  global.Game = <Game>_.clone(Game);
  globalAny.Memory = <Memory>_.clone(Memory);
});
