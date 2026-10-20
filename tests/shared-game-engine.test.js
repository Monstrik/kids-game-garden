const path = require("node:path");
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const { createSandbox, loadScriptIntoContext } = require("./helpers/browser-sandbox");

const GAME_ENGINE_PATH = path.resolve(__dirname, "../shared/js/game-engine.js");

const COMMON_IDS = [
  "setupScreen",
  "gameScreen",
  "endScreen",
  "dictionarySelect",
  "dictionaryNameInput",
  "newListBtn",
  "deleteListBtn",
  "dictionaryInfo",
  "wordInput",
  "startBtn",
  "clearBtn",
  "themeBtn",
  "soundBtn",
  "cookieCount",
  "accessory",
  "roboEmoji",
  "roboStatus",
  "progressFill",
  "progressText",
  "wordPosition",
  "emojiHint",
  "messageBox",
  "nextBtn",
  "resetBtn",
  "finalCookies",
  "endStats",
  "playAgainBtn",
  "newWordsBtn",
];

function bootGameEngine(elementIds = COMMON_IDS) {
  const sandbox = createSandbox({ elementIds });
  loadScriptIntoContext(sandbox.context, GAME_ENGINE_PATH);
  return sandbox;
}

describe("GameEngine helpers", () => {
  it("collectEls rejects invalid extraElementIds", () => {
    const { window } = bootGameEngine();
    assert.throws(() => window.GameEngine.collectEls("not-array"), /collectEls/);
    assert.throws(() => window.GameEngine.collectEls([""]), /non-empty string/);
  });

  it("createBaseState keeps shared defaults and merges game-specific values", () => {
    const { window } = bootGameEngine();
    const state = window.GameEngine.createBaseState({ typedAnswer: "", custom: 3 });

    assert.equal(state.soundOn, true);
    assert.equal(state.locked, false);
    assert.equal(state.currentWord, null);
    assert.equal(state.typedAnswer, "");
    assert.equal(state.custom, 3);
  });

  it("attachCommonMainEvents fails fast when required elements are missing", () => {
    const { window } = bootGameEngine(["soundBtn"]);
    const RoboGame = {
      state: { soundOn: true },
      els: window.GameEngine.collectEls([]),
      utils: { playTone() {} },
      ui: { updateSoundButton() {}, showMessage() {} },
      game: {
        startGame() {},
        nextWord() {},
        restartWithSameWords() {},
        enterNewWords() {},
      },
    };

    assert.throws(() => window.GameEngine.attachCommonMainEvents(RoboGame), /startBtn/);
  });

  it("attachBaseGame falls back to setup when parsed words are empty", () => {
    const { window } = bootGameEngine();
    const setScreenCalls = [];
    const messageCalls = [];

    const RoboGame = {
      state: {
        allWords: [],
        gameWords: [],
        currentIndex: 0,
        cookies: 0,
        solved: 0,
        currentWord: null,
        soundOn: true,
      },
      els: window.GameEngine.collectEls([]),
      utils: {
        loadSavedWords() {
          return "\n\n";
        },
        normalizeWord(value) {
          return String(value).toUpperCase();
        },
        fisherYatesShuffle(words) {
          return words;
        },
        shuffleWordLetters(word) {
          return word.split("");
        },
        setScreen(name) {
          setScreenCalls.push(name);
        },
        playTone() {},
        speakWord() {},
        playFireworks() {},
      },
      ui: {
        showMessage(text, tone) {
          messageCalls.push({ text, tone });
        },
      },
    };

    const game = {
      loadCurrentWord() {},
    };

    window.GameEngine.attachBaseGame(RoboGame, game);
    game.startGame();

    assert.equal(setScreenCalls.at(-1), "setup");
    assert.equal(messageCalls.at(-1).tone, "bad");
  });
});
