import { assert } from "chai";
import { getAdjacentTiles, spawnHandler } from "../../src/main";
import { Game, Memory, mockRoom } from "./mock";

const globalAny:any = global;

describe("getAdjacentTiles", () => {
  beforeEach(() => {
    global.Game = <Game>_.clone(Game);
    globalAny.Memory = <Memory>_.clone(Memory);
  });

  it("should get all adjacent tiles", () => {
    const results: RoomPosition[] = getAdjacentTiles(mockRoom);
    const expected: RoomPosition[] = [
      {x: 9, y: 9, roomName: "Room1"} as RoomPosition,
      {x: 9, y: 10, roomName: "Room1"} as RoomPosition,
      {x: 9, y: 11, roomName: "Room1"} as RoomPosition,
      {x: 10, y: 9, roomName: "Room1"} as RoomPosition,
      {x: 10, y: 11, roomName: "Room1"} as RoomPosition,
      {x: 11, y: 9, roomName: "Room1"} as RoomPosition,
      {x: 11, y: 10, roomName: "Room1"} as RoomPosition,
      {x: 11, y: 11, roomName: "Room1"} as RoomPosition,
    ];

    assert.deepEqual(results, expected);
  });
})

describe("spawnHandler", () => {

  beforeEach(() => {
    global.Game = <Game>_.clone(Game);
    globalAny.Memory = <Memory>_.clone(Memory);
  });

  it("should set the target spawn", () => {
    spawnHandler();
    assert.isDefined(globalAny.Memory.targetSpawn);
  });

});
