export const bodyCost = (body: BodyPartConstant[]): number => {
  let sum = 0;
  for (let i in body)
    sum += BODYPART_COST[body[i]];
  return sum;
};

export const getAdjacentTiles = (pos: RoomPosition): RoomPosition[] => {
  const adjacentTiles: RoomPosition[] = [];

  for (let x = pos.x - 1; x < pos.x + 2; x++) {
    for (let y = pos.y - 1; y < pos.y + 2; y++) {
      if (pos.x !== x || pos.y !== y) {
        const position = _.clone(pos);
        position.x = x;
        position.y = y;
        adjacentTiles.push(position);
      }
    }
  }
  return adjacentTiles;
};

