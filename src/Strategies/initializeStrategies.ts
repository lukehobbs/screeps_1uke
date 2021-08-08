import { PrioritizedStrategies, Strategies, Strategy } from "./Strategy";
import { Tier0 } from "./Tier0";

export function initializeStrategies(...args: Strategy[]) {
  for (let strategy of args) {
    if (!Strategies[strategy.id]) {
      Strategies[strategy.id] = strategy;
      PrioritizedStrategies.push(strategy);
    }
  }
  PrioritizedStrategies.sort((a, b) => b.priority - a.priority);
}

initializeStrategies(
  new Tier0(10)
);