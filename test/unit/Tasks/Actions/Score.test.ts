import { Score } from "../../../../src/UtilityAi/Score";
import { assert } from "chai";

describe("Score", () => {
  it("should store a description and a function that returns a number", () => {
    const results = new Score("screep is spawning", (): number => {
      return 11;
    });

    assert.equal(results.description, "screep is spawning");
    assert.equal(results.fun({} as IContext), 11);
  });
});