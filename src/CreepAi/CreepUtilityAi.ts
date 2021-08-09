import { UtilityAi } from "../UtilityAi/UtilityAi";

export class CreepUtilityAi extends UtilityAi {
}

declare global {
  interface IContext {
    creep: Creep;
    room: Room;
  }
}

