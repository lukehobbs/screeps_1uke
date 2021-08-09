import { Score } from "../../../../src/Tasks/Actions/Score";
import { assert } from "chai";

export interface IContext {
}

describe("Score", () => {
  it("should store a description and a function that returns a number", () => {
    const results = new Score("screep is spawning", (context: IContext): number => {
      return 11;
    });

    assert.equal(results.description, "screep is spawning");
    assert.equal(results.fun({} as IContext), 11);
  });
});