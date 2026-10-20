const path = require("node:path");
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const { createSandbox, loadScriptIntoContext } = require("./helpers/browser-sandbox");

const GAME_COMMON_PATH = path.resolve(__dirname, "../shared/js/game-common.js");

function bootGameCommon() {
  const sandbox = createSandbox();
  loadScriptIntoContext(sandbox.context, GAME_COMMON_PATH);
  return sandbox;
}

describe("GameCommon defensive behavior", () => {
  it("fisherYatesShuffle rejects non-array input", () => {
    const { window } = bootGameCommon();
    assert.throws(() => window.GameCommon.fisherYatesShuffle(null), /expects an array/);
  });

  it("pickFunMessage returns empty string for non-array input", () => {
    const { window } = bootGameCommon();
    assert.equal(window.GameCommon.pickFunMessage("oops"), "");
  });

  it("getAccessoryForCookies ignores malformed rewards", () => {
    const { window } = bootGameCommon();
    const rewards = [{ cookies: 3, emoji: "A" }, { nope: true }, { cookies: 8, emoji: "B" }];
    assert.equal(window.GameCommon.getAccessoryForCookies(9, rewards), "B");
  });

  it("loadSavedWords tolerates localStorage read failures", () => {
    const { window, localStorage } = bootGameCommon();
    localStorage.getItem = () => {
      throw new Error("blocked");
    };

    const result = window.GameCommon.loadSavedWords({ words: "demo.words" }, "DEFAULT");
    assert.equal(result, "DEFAULT");
  });

  it("saveWordsToLocalStorage ignores localStorage write failures", () => {
    const { window, localStorage } = bootGameCommon();
    localStorage.setItem = () => {
      throw new Error("quota");
    };

    assert.doesNotThrow(() =>
      window.GameCommon.saveWordsToLocalStorage({ words: "demo.words" }, "apple", ["legacy.words"]),
    );
  });
});
