import { UtilityAi } from "./UtilityAi/UtilityAi";
import { DoNothingOption } from "./Behaviors/Options/GenericOptions/DoNothingOption";
import { FIND_STRUCTURES } from "../test/unit/constants";
import { TransferEnergyOption } from "./Behaviors/Options/LinkOptions/TransferEnergyOption";

export class LinkUtilityAi extends UtilityAi {
}

export const initializeLinkOptions = (ai: LinkUtilityAi, room: Room) => {
  ai.addOption(new DoNothingOption());

  const structures = room.find(FIND_STRUCTURES);
  const links = structures.filter(s => s.structureType === STRUCTURE_LINK);

  // links.forEach(l => ai.addOption(new TransferEnergyOption(l.id)));
  if (links.length === 2) {
    const sourceLink = _.first(links.filter(l => l.pos.findInRange(FIND_SOURCES, 2).length > 0));
    const targetLink = _.first(links.filter(l => l.id !== sourceLink.id));

    ai.addOption(new TransferEnergyOption(targetLink.id));
  }
};