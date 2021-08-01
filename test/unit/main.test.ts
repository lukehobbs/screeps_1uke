import { assert } from "chai";
import { spawnHandler } from "../../src/spawn/handler";
import { getAdjacentTiles } from "../../src/utils/helpers";
import { Game, Memory, mockRoomPosition1 } from "./mock";

const globalAny: any = global;

globalAny.log = "debug";

beforeEach(() => {
  global.Game = <Game>_.clone(Game);
  globalAny.Memory = <Memory>_.clone(Memory);
});

describe("spawnHandler", () => {

  it("should set the target spawn", () => {
    spawnHandler();
    assert.isDefined(globalAny.Memory.targetSpawn);
  });

});

describe("getCreepName", () => {

});
