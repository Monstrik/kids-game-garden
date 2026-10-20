(function () {
  const shared = (window.GameEngine = window.GameEngine || {});
  const COMMON_ELEMENT_IDS = [
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

  function fail(message) {
    throw new Error(`[GameEngine] ${message}`);
  }

  function assertObject(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      fail(`${name} must be an object.`);
    }
  }

  function assertFunction(value, name) {
    if (typeof value !== "function") {
      fail(`${name} must be a function.`);
    }
  }

  function assertElement(els, key) {
    if (!els[key]) {
      fail(`Missing required element: #${key}`);
    }
  }

  function assertCallbacks(options, keys) {
    for (const key of keys) {
      if (options[key] != null && typeof options[key] !== "function") {
        fail(`${key} must be a function when provided.`);
      }
    }
  }

  shared.createConstants = function createConstants(options = {}) {
    const gameCommon = window.GameCommon || {};
    const { ACCESSORY_REWARDS = [], WORDS = [], DEFAULT_WORDS = "" } = gameCommon;
    const { soundKey = "mini-game.sound", funMessages = [] } = options;

    return {
      STORAGE_KEYS: {
        words: "kids-game-garden.words",
        sound: soundKey,
        theme: "mini-game-hub.theme",
      },
      FUN_MESSAGES: [...funMessages],
      ACCESSORY_REWARDS,
      WORDS,
      DEFAULT_WORDS,
    };
  };

  shared.collectEls = function collectEls(extraElementIds = []) {
    if (!Array.isArray(extraElementIds)) {
      fail("collectEls(extraElementIds) expects an array of element ids.");
    }
    for (const id of extraElementIds) {
      if (typeof id !== "string" || !id.trim()) {
        fail("collectEls(extraElementIds) expects each extra id to be a non-empty string.");
      }
    }

    const allElementIds = [...new Set([...COMMON_ELEMENT_IDS, ...extraElementIds])];
    return allElementIds.reduce((elements, id) => {
      elements[id] = document.getElementById(id);
      return elements;
    }, {});
  };

  shared.createBaseState = function createBaseState(extraState = {}) {
    assertObject(extraState, "extraState");

    return {
      soundOn: true,
      allWords: [],
      gameWords: [],
      currentIndex: 0,
      cookies: 0,
      solved: 0,
      currentWord: null,
      locked: false,
      ...extraState,
    };
  };

  shared.createUtils = function createUtils(RoboGame, options = {}) {
    assertObject(RoboGame, "RoboGame");
    assertObject(options, "options");
    assertObject(RoboGame.constants, "RoboGame.constants");
    assertObject(RoboGame.state, "RoboGame.state");
    assertObject(RoboGame.els, "RoboGame.els");

    const { state, els } = RoboGame;
    const { STORAGE_KEYS, FUN_MESSAGES, DEFAULT_WORDS, ACCESSORY_REWARDS } = RoboGame.constants;
    const { GameCommon } = window;
    if (!GameCommon) {
      fail("window.GameCommon is required before createUtils().");
    }
    assertFunction(GameCommon.normalizeWord, "GameCommon.normalizeWord");
    assertFunction(GameCommon.fisherYatesShuffle, "GameCommon.fisherYatesShuffle");
    assertFunction(GameCommon.shuffleWordLetters, "GameCommon.shuffleWordLetters");
    assertFunction(GameCommon.getAccessoryForCookies, "GameCommon.getAccessoryForCookies");
    assertFunction(GameCommon.pickFunMessage, "GameCommon.pickFunMessage");
    assertFunction(GameCommon.setScreen, "GameCommon.setScreen");
    assertFunction(GameCommon.playTone, "GameCommon.playTone");
    assertFunction(GameCommon.speakWord, "GameCommon.speakWord");
    assertFunction(GameCommon.playFireworks, "GameCommon.playFireworks");
    assertFunction(GameCommon.loadSavedWords, "GameCommon.loadSavedWords");
    assertFunction(GameCommon.saveWordsToLocalStorage, "GameCommon.saveWordsToLocalStorage");

    const dictionaryManager = window.GameDictionaries;
    const { legacyWordKeys = [] } = options;
    if (!Array.isArray(legacyWordKeys)) {
      fail("options.legacyWordKeys must be an array when provided.");
    }

    const normalizeWord = GameCommon.normalizeWord;
    const fisherYatesShuffle = GameCommon.fisherYatesShuffle;
    const shuffleWordLetters = GameCommon.shuffleWordLetters;
    const getAccessoryForCookies = (cookieCount) => GameCommon.getAccessoryForCookies(cookieCount, ACCESSORY_REWARDS);
    const pickFunMessage = () => GameCommon.pickFunMessage(FUN_MESSAGES);
    const getPreferredTheme = GameCommon.getPreferredTheme;
    const saveTheme = GameCommon.saveTheme;
    const applyTheme = GameCommon.applyTheme;
    const setScreen = (name) => GameCommon.setScreen(els, name);
    const playTone = (frequency = 440, duration = 0.12, type = "sine", volume = 0.05) => {
      GameCommon.playTone(state.soundOn, frequency, duration, type, volume);
    };
    const speakWord = (word) => GameCommon.speakWord(state.soundOn, word);
    const playFireworks = (bursts = 7) => GameCommon.playFireworks(bursts);

    function saveWordsToLocalStorage(text) {
      if (dictionaryManager?.setActiveWords) {
        dictionaryManager.setActiveWords(text);
        return;
      }
      GameCommon.saveWordsToLocalStorage(STORAGE_KEYS, text, legacyWordKeys);
    }

    function loadSavedWords() {
      if (dictionaryManager?.getActiveWords) return dictionaryManager.getActiveWords();
      return GameCommon.loadSavedWords(STORAGE_KEYS, DEFAULT_WORDS, legacyWordKeys);
    }

    return {
      normalizeWord,
      fisherYatesShuffle,
      shuffleWordLetters,
      getAccessoryForCookies,
      pickFunMessage,
      saveWordsToLocalStorage,
      setScreen,
      playTone,
      speakWord,
      playFireworks,
      getPreferredTheme,
      saveTheme,
      applyTheme,
      loadSavedWords,
    };
  };

  shared.attachCommonUi = function attachCommonUi(RoboGame, ui) {
    assertObject(RoboGame, "RoboGame");
    assertObject(ui, "ui");

    const { state, els } = RoboGame;
    assertObject(state, "RoboGame.state");
    assertObject(els, "RoboGame.els");
    assertElement(els, "soundBtn");
    assertElement(els, "themeBtn");
    assertElement(els, "accessory");
    assertElement(els, "roboEmoji");
    assertElement(els, "cookieCount");
    assertElement(els, "progressFill");
    assertElement(els, "progressText");
    assertElement(els, "wordPosition");
    assertElement(els, "messageBox");

    const { getAccessoryForCookies } = RoboGame.utils;
    assertFunction(getAccessoryForCookies, "RoboGame.utils.getAccessoryForCookies");

    ui.updateSoundButton = function updateSoundButton() {
      els.soundBtn.textContent = state.soundOn ? "Sound On" : "Sound Off";
      localStorage.setItem(RoboGame.constants.STORAGE_KEYS.sound, String(state.soundOn));
    };

    ui.updateThemeButton = function updateThemeButton(theme) {
      const isDark = theme === "dark";
      els.themeBtn.textContent = isDark ? "☀️" : "🌙";
      els.themeBtn.setAttribute("aria-pressed", String(isDark));
    };

    ui.updateRoboAccessory = function updateRoboAccessory() {
      els.accessory.textContent = getAccessoryForCookies(state.cookies);
      els.roboEmoji.classList.remove("wiggle");
      void els.roboEmoji.offsetWidth;
      els.roboEmoji.classList.add("wiggle");
    };

    ui.updateHeaderStats = function updateHeaderStats() {
      els.cookieCount.textContent = state.cookies;
      els.progressFill.style.width = state.gameWords.length ? `${(state.solved / state.gameWords.length) * 100}%` : "0";
      els.progressText.textContent = `${state.solved} of ${state.gameWords.length} words`;
      els.wordPosition.textContent = state.currentWord
        ? `Word ${state.currentIndex + 1} / ${state.gameWords.length}`
        : `Word 0 / ${state.gameWords.length}`;
      ui.updateRoboAccessory();
    };

    ui.showMessage = function showMessage(text, tone = "neutral") {
      els.messageBox.textContent = text;
      els.messageBox.classList.remove("good", "bad", "slideIn");
      if (tone === "good") els.messageBox.classList.add("good");
      if (tone === "bad") els.messageBox.classList.add("bad");
      els.messageBox.classList.add("slideIn");
    };

    return ui;
  };

  shared.attachCommonMainEvents = function attachCommonMainEvents(RoboGame, options = {}) {
    assertObject(RoboGame, "RoboGame");
    assertObject(options, "options");

    const { state, els } = RoboGame;
    const { utils, ui, game } = RoboGame;
    assertObject(state, "RoboGame.state");
    assertObject(els, "RoboGame.els");
    assertObject(utils, "RoboGame.utils");
    assertObject(ui, "RoboGame.ui");
    assertObject(game, "RoboGame.game");
    const {
      dictionaryManagerPath = "../dictionary-manager/",
      onHint,
      onReplay,
      onCheck,
      onReset,
      onAfterCommonBindings,
    } = options;
    assertCallbacks(options, ["onHint", "onReplay", "onCheck", "onReset", "onAfterCommonBindings"]);
    assertFunction(game.startGame, "RoboGame.game.startGame");
    assertFunction(game.nextWord, "RoboGame.game.nextWord");
    assertFunction(game.restartWithSameWords, "RoboGame.game.restartWithSameWords");
    assertFunction(game.enterNewWords, "RoboGame.game.enterNewWords");
    assertFunction(ui.updateSoundButton, "RoboGame.ui.updateSoundButton");
    assertFunction(ui.showMessage, "RoboGame.ui.showMessage");
    assertFunction(utils.playTone, "RoboGame.utils.playTone");

    assertElement(els, "startBtn");
    assertElement(els, "soundBtn");

    const dictionaryManagerUrl = new URL(dictionaryManagerPath, window.location.href).toString();

    els.startBtn.addEventListener("click", game.startGame);
    document.getElementById("dictionaryManagerBtn")?.addEventListener("click", () => {
      window.location.href = dictionaryManagerUrl;
    });
    els.soundBtn.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      ui.updateSoundButton();
      ui.showMessage(state.soundOn ? "Sound turned on!" : "Sound turned off!", "good");
      if (state.soundOn) utils.playTone(523, 0.08, "triangle", 0.03);
    });
    els.nextBtn?.addEventListener("click", game.nextWord);
    els.playAgainBtn?.addEventListener("click", game.restartWithSameWords);
    els.newWordsBtn?.addEventListener("click", game.enterNewWords);

    if (typeof onHint === "function") {
      els.hintBtn?.addEventListener("click", onHint);
    }
    if (typeof onReplay === "function") {
      els.replayBtn?.addEventListener("click", onReplay);
    }
    if (typeof onCheck === "function") {
      els.checkBtn?.addEventListener("click", onCheck);
    }
    if (typeof onReset === "function") {
      els.resetBtn?.addEventListener("click", onReset);
    }
    if (typeof onAfterCommonBindings === "function") {
      onAfterCommonBindings();
    }
  };

  shared.initGameShell = function initGameShell(RoboGame, options = {}) {
    assertObject(RoboGame, "RoboGame");
    assertObject(options, "options");

    const { state, els } = RoboGame;
    const { utils, ui } = RoboGame;
    const { startupMessage = "Choose a word list and start the game!", beforeReady } = options;
    assertCallbacks(options, ["beforeReady"]);
    assertObject(state, "RoboGame.state");
    assertObject(els, "RoboGame.els");
    assertObject(utils, "RoboGame.utils");
    assertObject(ui, "RoboGame.ui");

    assertElement(els, "themeBtn");
    assertFunction(ui.updateSoundButton, "RoboGame.ui.updateSoundButton");
    assertFunction(ui.showMessage, "RoboGame.ui.showMessage");
    assertFunction(utils.setScreen, "RoboGame.utils.setScreen");

    if (window.GameDictionaries?.initDictionaryManager) {
      window.GameDictionaries.initDictionaryManager(els);
    }
    state.soundOn = localStorage.getItem(RoboGame.constants.STORAGE_KEYS.sound) !== "false";
    if (typeof beforeReady === "function") {
      beforeReady();
    }
    if (window.GameTheme?.initTheme) {
      window.GameTheme.initTheme(els.themeBtn);
    }
    ui.updateSoundButton();
    utils.setScreen("setup");
    ui.showMessage(startupMessage, "good");
  };

  shared.attachBaseGame = function attachBaseGame(RoboGame, game, options = {}) {
    assertObject(RoboGame, "RoboGame");
    assertObject(game, "game");
    assertObject(options, "options");

    const { state, els } = RoboGame;
    const { utils, ui } = RoboGame;
    assertObject(state, "RoboGame.state");
    assertObject(els, "RoboGame.els");
    assertObject(utils, "RoboGame.utils");
    assertObject(ui, "RoboGame.ui");

    const {
      noWordsMessage = "Please choose a word list with words in it!",
      startMessage = "Listen first, then choose a letter to start!",
      buildWordEntry = (word) => ({ answer: word, letters: utils.shuffleWordLetters(word) }),
      onAfterStart,
      replayCurrentWord,
      onResetCurrentWord,
      retryStatusMessage = "Try the word again — listen closely!",
      retryMessage = "Listen carefully!",
    } = options;
    assertCallbacks(options, ["onAfterStart", "replayCurrentWord", "onResetCurrentWord"]);
    assertFunction(utils.loadSavedWords, "RoboGame.utils.loadSavedWords");
    assertFunction(utils.normalizeWord, "RoboGame.utils.normalizeWord");
    assertFunction(utils.fisherYatesShuffle, "RoboGame.utils.fisherYatesShuffle");
    assertFunction(utils.shuffleWordLetters, "RoboGame.utils.shuffleWordLetters");
    assertFunction(utils.setScreen, "RoboGame.utils.setScreen");
    assertFunction(utils.playTone, "RoboGame.utils.playTone");
    assertFunction(utils.speakWord, "RoboGame.utils.speakWord");
    assertFunction(utils.playFireworks, "RoboGame.utils.playFireworks");
    assertFunction(ui.showMessage, "RoboGame.ui.showMessage");

    game.parseWordsFromTextarea = function parseWordsFromTextarea() {
      return utils
        .loadSavedWords()
        .split(/\r?\n/)
        .map(utils.normalizeWord)
        .filter(Boolean)
        .filter((word) => /[A-Z]/.test(word));
    };

    game.buildGameWords = function buildGameWords(words) {
      return utils.fisherYatesShuffle(words).map((word) => buildWordEntry(word, utils));
    };

    game.startGame = function startGame() {
      const words = game.parseWordsFromTextarea();
      if (!words.length) {
        ui.showMessage(noWordsMessage, "bad");
        utils.setScreen("setup");
        return;
      }

      state.allWords = words;
      state.gameWords = game.buildGameWords(words);
      if (!Array.isArray(state.gameWords) || !state.gameWords.length) {
        ui.showMessage(noWordsMessage, "bad");
        utils.setScreen("setup");
        return;
      }
      state.currentIndex = 0;
      state.cookies = 0;
      state.solved = 0;
      state.currentWord = state.gameWords[0];
      utils.setScreen("game");
      ui.showMessage(startMessage);
      if (typeof onAfterStart === "function") {
        onAfterStart();
      }
      game.loadCurrentWord();
    };

    game.nextWord = function nextWord() {
      state.currentIndex += 1;
      if (state.currentIndex >= state.gameWords.length) {
        game.finishGame();
        return;
      }
      state.currentWord = state.gameWords[state.currentIndex];
      game.loadCurrentWord();
    };

    game.resetCurrentWord = function resetCurrentWord() {
      if (!state.currentWord) return;
      if (typeof onResetCurrentWord === "function") {
        onResetCurrentWord();
      }
      els.roboStatus.textContent = retryStatusMessage;
      ui.showMessage(retryMessage);

      if (typeof replayCurrentWord === "function") {
        replayCurrentWord();
        return;
      }
      utils.speakWord(state.currentWord.answer);
    };

    game.finishGame = function finishGame() {
      utils.setScreen("end");
      utils.playFireworks(8);
      els.finalCookies.textContent = state.cookies;
      els.endStats.innerHTML = `Words completed: ${state.solved}<br />Cookies earned: ${state.cookies}`;
      els.roboStatus.textContent = "All done!";
      ui.showMessage("Great job!");
      if (state.soundOn) {
        utils.playTone(523, 0.08, "triangle", 0.04);
        setTimeout(() => utils.playTone(659, 0.08, "triangle", 0.04), 120);
        setTimeout(() => utils.playTone(784, 0.12, "triangle", 0.04), 240);
      }
    };

    game.restartWithSameWords = function restartWithSameWords() {
      if (!state.allWords.length) {
        utils.setScreen("setup");
        return;
      }
      state.gameWords = game.buildGameWords(state.allWords);
      state.currentIndex = 0;
      state.cookies = 0;
      state.solved = 0;
      state.currentWord = state.gameWords[0];
      utils.setScreen("game");
      game.loadCurrentWord();
    };

    game.enterNewWords = function enterNewWords() {
      utils.setScreen("setup");
      document.getElementById("dictionarySelect")?.focus();
    };

    return game;
  };
})();
