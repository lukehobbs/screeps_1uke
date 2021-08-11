import { CommonPaths } from "../Types/types";

namespace RoomVisuals {
  const drawPath = (room: Room, path: RoomPosition[]): void => {
    for (let i = 1; i < path.length; i++) {
      const { x: x1, y: y1 } = path[i - 1];
      const { x: x2, y: y2 } = path[i];
      room.visual.line(x1, y1, x2, y2);
    }
  };

  export const drawPaths = (room: Room, paths: RoomPosition[][]): void => {
    paths.forEach(path => drawPath(room, path));
  };

  export const drawCommonPaths = (room: Room, paths: CommonPaths): void => {
    drawPaths(room, paths.spawnToControllers);
    drawPaths(room, paths.spawnToSources);
    drawPaths(room, paths.sourcesToControllers);
  };
}

export default RoomVisuals;
