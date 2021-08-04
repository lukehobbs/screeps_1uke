import { assert } from "chai";
import { maxSupportedHarvesters } from "../../src/spawn/maybeGetNextHarvester";
import { getAdjacentTiles} from "../../src/utils/helpers";
import { Game, Memory, mockRoom, mockRoomPosition1 } from "./mock";

const globalAny: any = global;

globalAny.log = "debug";

beforeEach(() => {
  global.Game = <Game>_.clone(Game);
  globalAny.Memory = <Memory>_.clone(Memory);
});

describe("getAdjacentTiles", () => {

  it("should get all adjacent tiles", () => {
    const results: RoomPosition[] = getAdjacentTiles(mockRoomPosition1);
    const expected: RoomPosition[] = [
      { x: 28, y: 33, roomName: "Room1" } as RoomPosition,
      { x: 28, y: 34, roomName: "Room1" } as RoomPosition,
      { x: 28, y: 35, roomName: "Room1" } as RoomPosition,
      { x: 29, y: 33, roomName: "Room1" } as RoomPosition,
      { x: 29, y: 35, roomName: "Room1" } as RoomPosition,
      { x: 30, y: 33, roomName: "Room1" } as RoomPosition,
      { x: 30, y: 34, roomName: "Room1" } as RoomPosition,
      { x: 30, y: 35, roomName: "Room1" } as RoomPosition
    ];

    assert.deepEqual(results, expected);
  });
});


describe("maxSupportedHarvesters", () => {

  it("should count adjacent tiles where terrain supports a harvester", () => {
    const results = maxSupportedHarvesters(mockRoom);

    const expected = new Map([
      ["source1", 3],
      ["source2", 1]
    ]);

    assert.deepEqual(results, expected);
  });
});

