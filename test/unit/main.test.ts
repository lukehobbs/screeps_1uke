import { assert } from "chai";
import { getAdjacentTiles, loop } from "../../src/main";
import { Memory, Game } from "./mock";

describe("main", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
    // runs before each test in this block
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(Game);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = _.clone(Memory);
  });

  it("should export a loop function", () => {
    assert.isTrue(typeof loop === "function");
  });

  it("should return void when called with no context", () => {
    assert.isUndefined(loop());
  });

  it("should delete memory of missing creeps", () => {
    Memory.creeps.persistValue = "any value";
    Memory.creeps.notPersistValue = "any value";

    Game.creeps.persistValue = "any value";

    loop();

    assert.isDefined(Memory.creeps.persistValue);
    assert.isUndefined(Memory.creeps.notPersistValue);
  });

  it("should set target spawn", () => {
    Memory.targetSpawn = undefined;
    loop();
    console.log(Memory);
    assert.isDefined(Memory.targetSpawn);
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
