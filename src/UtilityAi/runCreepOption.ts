import { IOption } from "./Option";

export const runCreepOption = (creep: Creep, room: Room, option: IOption) => {
  let status = option.action.run(creep);
  console.log(status);
};