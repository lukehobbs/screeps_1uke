import { assert } from "chai";
import { getAdjacentTiles, loop, spawnHandler } from "../../src/main";
import { Memory, Game } from "./mock";

import global = NodeJS.Global;

describe("get adjacent tiles", () => {

})

describe("main", () => {

  beforeEach(() => {
    global.Game = <Game>_.clone(Game);
    // @ts-ignore
    global.Memory = <Memory>_.clone(Memory);
  });

  it("should set target spawn", () => {
    spawnHandler();
    assert.isDefined(global.Memory.targetSpawn);
  });

  it("should get adjacent tiles", () => {
    const position = new RoomPosition(10, 10, "XYZ");
    const results: RoomPosition[] = getAdjacentTiles(position);
    const expected: RoomPosition[] = [
      new RoomPosition(9, 9, "XYZ"),
      new RoomPosition(9, 10, "XYZ"),
      new RoomPosition(9, 11, "XYZ"),
      new RoomPosition(10, 9, "XYZ"),
      new RoomPosition(10, 11, "XYZ"),
      new RoomPosition(11, 9, "XYZ"),
      new RoomPosition(11, 10, "XYZ"),
      new RoomPosition(11, 11, "XYZ")
    ];

    assert.equal(results, expected);
  });
});
