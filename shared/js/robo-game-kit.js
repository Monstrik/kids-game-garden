(function () {
  const shared = window.GameCommon || {};
  const api = (window.RoboGameKit = window.RoboGameKit || {});

  const DEFAULT_WORDS_KEY = 'kids-game-garden.words';
  const DEFAULT_THEME_KEY = 'mini-game-hub.theme';

  const COMMON_ELEMENT_IDS = {
    setupScreen: 'setupScreen',
    gameScreen: 'gameScreen',
    endScreen: 'endScreen',
    dictionarySelect: 'dictionarySelect',
    dictionaryNameInput: 'dictionaryNameInput',
    newListBtn: 'newListBtn',
    deleteListBtn: 'deleteListBtn',
    dictionaryInfo: 'dictionaryInfo',
    wordInput: 'wordInput',
    startBtn: 'startBtn',
    clearBtn: 'clearBtn',
    themeBtn: 'themeBtn',
    soundBtn: 'soundBtn',
    cookieCount: 'cookieCount',
    accessory: 'accessory',
    roboEmoji: 'roboEmoji',
    roboStatus: 'roboStatus',
    progressFill: 'progressFill',
    progressText: 'progressText',
    wordPosition: 'wordPosition',
    emojiHint: 'emojiHint',
    slots: 'slots',
    letterBank: 'letterBank',
    answerInput: 'answerInput',
    keyboard: 'keyboard',
    choiceGrid: 'choiceGrid',
    messageBox: 'messageBox',
    hintBtn: 'hintBtn',
    replayBtn: 'replayBtn',
    checkBtn: 'checkBtn',
    nextBtn: 'nextBtn',
    resetBtn: 'resetBtn',
    finalCookies: 'finalCookies',
    endStats: 'endStats',
    playAgainBtn: 'playAgainBtn',
    newWordsBtn: 'newWordsBtn'
  };

  const COMMON_STATE = {
    soundOn: true,
    allWords: [],
    gameWords: [],
    currentIndex: 0,
    cookies: 0,
    solved: 0,
    currentWord: null,
    locked: false
  };

  function defaultParseWordsFromTextarea(utils) {
    return utils.loadSavedWords()
      .split(/\r?\n/)
      .map(utils.normalizeWord)
      .filter(Boolean)
      .filter(word => /[A-Z]/.test(word));
  }

  function defaultBuildGameWords(utils, words) {
    return utils.fisherYatesShuffle(words).map(word => ({
      answer: word,
      letters: utils.shuffleWordLetters(word),
      emoji: utils.getEmojiForWord(word)
    }));
  }

  function ensureFunction(value, fallback) {
    return typeof value === 'function' ? value : fallback;
  }

  api.createConstants = function createConstants({ soundKey, funMessages = [], wordsKey = DEFAULT_WORDS_KEY, themeKey = DEFAULT_THEME_KEY } = {}) {
    return {
      STORAGE_KEYS: {
        words: wordsKey,
        sound: soundKey,
        theme: themeKey
      },
      FUN_MESSAGES: [...funMessages],
      ACCESSORY_REWARDS: shared.ACCESSORY_REWARDS,
      WORD_EMOJIS: shared.WORD_EMOJIS,
      DEFAULT_WORDS: shared.DEFAULT_WORDS
    };
  };

  api.createElements = function createElements(extraIds = {}) {
    const ids = { ...COMMON_ELEMENT_IDS, ...extraIds };
    return Object.fromEntries(
      Object.entries(ids).map(([key, id]) => [key, document.getElementById(id)])
    );
  };

  api.createState = function createState(extraState = {}) {
    return { ...COMMON_STATE, ...extraState };
  };

  api.createUtils = function createUtils({ state, els, constants, legacyWordKeys = [] }) {
    const dictionaryManager = window.GameDictionaries;

    const normalizeWord = shared.normalizeWord;
    const fisherYatesShuffle = shared.fisherYatesShuffle;
    const shuffleWordLetters = shared.shuffleWordLetters;
    const getEmojiForWord = word => shared.getEmojiForWord(word, constants.WORD_EMOJIS);
    const getAccessoryForCookies = cookieCount => shared.getAccessoryForCookies(cookieCount, constants.ACCESSORY_REWARDS);
    const pickFunMessage = () => shared.pickFunMessage(constants.FUN_MESSAGES);
    const getPreferredTheme = shared.getPreferredTheme;
    const saveTheme = shared.saveTheme;
    const applyTheme = shared.applyTheme;
    const setScreen = name => shared.setScreen(els, name);
    const playTone = (frequency = 440, duration = 0.12, type = 'sine', volume = 0.05) => {
      shared.playTone(state.soundOn, frequency, duration, type, volume);
    };
    const speakWord = word => shared.speakWord(state.soundOn, word);

    function saveWordsToLocalStorage(text) {
      if (dictionaryManager?.setActiveWords) {
        dictionaryManager.setActiveWords(text);
        return;
      }
      shared.saveWordsToLocalStorage(constants.STORAGE_KEYS, text, legacyWordKeys);
    }

    function loadSavedWords() {
      if (dictionaryManager?.getActiveWords) return dictionaryManager.getActiveWords();
      return shared.loadSavedWords(constants.STORAGE_KEYS, constants.DEFAULT_WORDS, legacyWordKeys);
    }

    return {
      normalizeWord,
      fisherYatesShuffle,
      shuffleWordLetters,
      getEmojiForWord,
      getAccessoryForCookies,
      pickFunMessage,
      saveWordsToLocalStorage,
      loadSavedWords,
      setScreen,
      playTone,
      speakWord,
      getPreferredTheme,
      saveTheme,
      applyTheme
    };
  };

  api.installCommonUi = function installCommonUi({ ui = {}, state, els, constants, getAccessoryForCookies, clearBoard }) {
    ui.updateSoundButton = function updateSoundButton() {
      if (!els.soundBtn) return;
      els.soundBtn.textContent = state.soundOn ? 'Sound On' : 'Sound Off';
      localStorage.setItem(constants.STORAGE_KEYS.sound, String(state.soundOn));
    };

    ui.updateThemeButton = function updateThemeButton(theme) {
      if (!els.themeBtn) return;
      const isDark = theme === 'dark';
      els.themeBtn.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
      els.themeBtn.setAttribute('aria-pressed', String(isDark));
    };

    ui.updateRoboAccessory = function updateRoboAccessory() {
      if (!els.accessory || !els.roboEmoji) return;
      els.accessory.textContent = getAccessoryForCookies(state.cookies);
      els.roboEmoji.classList.remove('wiggle');
      void els.roboEmoji.offsetWidth;
      els.roboEmoji.classList.add('wiggle');
    };

    ui.updateHeaderStats = function updateHeaderStats() {
      if (els.cookieCount) els.cookieCount.textContent = state.cookies;
      if (els.progressFill) {
        els.progressFill.style.width = state.gameWords.length
          ? `${(state.solved / state.gameWords.length) * 100}%`
          : '0';
      }
      if (els.progressText) {
        els.progressText.textContent = `${state.solved} of ${state.gameWords.length} words`;
      }
      if (els.wordPosition) {
        els.wordPosition.textContent = state.currentWord
          ? `Word ${state.currentIndex + 1} / ${state.gameWords.length}`
          : `Word 0 / ${state.gameWords.length}`;
      }
      ui.updateRoboAccessory();
    };

    ui.showMessage = function showMessage(text, tone = 'neutral') {
      if (!els.messageBox) return;
      els.messageBox.textContent = text;
      els.messageBox.classList.remove('good', 'bad', 'slideIn');
      if (tone === 'good') els.messageBox.classList.add('good');
      if (tone === 'bad') els.messageBox.classList.add('bad');
      els.messageBox.classList.add('slideIn');
    };

    if (clearBoard) ui.clearBoard = clearBoard;
    return ui;
  };

  api.bindCommonMain = function bindCommonMain({ state, els, utils, ui, game, constants, setupMessage, initTheme = true, dictionaryManagerBtn = document.getElementById('dictionaryManagerBtn'), onInit = null, onAfterInit = null }) {
    const dictionaryManagerUrl = new URL('../../../games/dictionary-manager/', window.location.href).toString();

    if (els.startBtn && game?.startGame) {
      els.startBtn.addEventListener('click', game.startGame);
    }

    if (dictionaryManagerBtn) {
      dictionaryManagerBtn.addEventListener('click', () => {
        window.location.href = dictionaryManagerUrl;
      });
    }

    if (els.soundBtn) {
      els.soundBtn.addEventListener('click', () => {
        state.soundOn = !state.soundOn;
        ui.updateSoundButton();
        ui.showMessage(state.soundOn ? 'Sound turned on!' : 'Sound turned off!', 'good');
        if (state.soundOn) utils.playTone(523, 0.08, 'triangle', 0.03);
      });
    }

    if (els.playAgainBtn && game?.restartWithSameWords) {
      els.playAgainBtn.addEventListener('click', game.restartWithSameWords);
    }

    if (els.newWordsBtn && game?.enterNewWords) {
      els.newWordsBtn.addEventListener('click', game.enterNewWords);
    }

    if (els.checkBtn && game?.autoCheckWord) {
      els.checkBtn.addEventListener('click', game.autoCheckWord);
    }

    if (els.nextBtn && game?.nextWord) {
      els.nextBtn.addEventListener('click', game.nextWord);
    }

    if (els.resetBtn && game?.resetCurrentWord) {
      els.resetBtn.addEventListener('click', game.resetCurrentWord);
    }

    if (els.hintBtn && game?.giveHint) {
      els.hintBtn.addEventListener('click', game.giveHint);
    }

    if (els.replayBtn && game?.replayWord) {
      els.replayBtn.addEventListener('click', game.replayWord);
    }

    if (typeof onInit === 'function') onInit();

    if (window.GameDictionaries?.initDictionaryManager) {
      window.GameDictionaries.initDictionaryManager(els);
    }

    state.soundOn = localStorage.getItem(constants.STORAGE_KEYS.sound) !== 'false';

    if (initTheme && window.GameTheme?.initTheme && els.themeBtn) {
      window.GameTheme.initTheme(els.themeBtn);
    }

    ui.updateSoundButton();
    utils.setScreen('setup');
    ui.showMessage(setupMessage, 'good');

    if (typeof onAfterInit === 'function') onAfterInit();
  };

  api.createWordGameCore = function createWordGameCore({
    state,
    els,
    utils,
    ui,
    messages = {},
    parseWordsFromTextarea,
    buildGameWords,
    loadCurrentWord,
    onStartGame,
    onFinishGame
  }) {
    const game = {};
    const parseWords = ensureFunction(parseWordsFromTextarea, () => defaultParseWordsFromTextarea(utils));
    const buildWords = ensureFunction(buildGameWords, words => defaultBuildGameWords(utils, words));

    game.parseWordsFromTextarea = parseWords;
    game.buildGameWords = buildWords;

    game.startGame = function startGame() {
      const words = game.parseWordsFromTextarea();
      if (!words.length) {
        ui.showMessage(messages.emptyWords || 'Please choose a word list with words in it!', 'bad');
        utils.setScreen('setup');
        return;
      }

      state.allWords = words;
      state.gameWords = game.buildGameWords(words);
      state.currentIndex = 0;
      state.cookies = 0;
      state.solved = 0;
      state.currentWord = state.gameWords[0] || null;
      state.locked = false;
      utils.setScreen('game');
      ui.showMessage(messages.start || 'Listen carefully!');
      if (typeof onStartGame === 'function') onStartGame();
      if (typeof loadCurrentWord === 'function') loadCurrentWord();
      utils.playTone(523, 0.08, 'triangle', 0.03);
    };

    game.nextWord = function nextWord() {
      state.currentIndex += 1;
      if (state.currentIndex >= state.gameWords.length) {
        game.finishGame();
        return;
      }
      state.currentWord = state.gameWords[state.currentIndex];
      state.locked = false;
      if (typeof loadCurrentWord === 'function') loadCurrentWord();
    };

    game.finishGame = function finishGame() {
      utils.setScreen('end');
      if (els.finalCookies) els.finalCookies.textContent = state.cookies;
      if (els.endStats) {
        els.endStats.innerHTML = `Words completed: ${state.solved}<br />Cookies earned: ${state.cookies}`;
      }
      if (els.roboStatus) els.roboStatus.textContent = messages.finishedStatus || 'All done!';
      ui.showMessage(messages.finishedMessage || 'Great job!');
      if (state.soundOn) {
        utils.playTone(523, 0.08, 'triangle', 0.04);
        setTimeout(() => utils.playTone(659, 0.08, 'triangle', 0.04), 120);
        setTimeout(() => utils.playTone(784, 0.12, 'triangle', 0.04), 240);
      }
      if (typeof onFinishGame === 'function') onFinishGame();
    };

    game.restartWithSameWords = function restartWithSameWords() {
      if (!state.allWords.length) {
        utils.setScreen('setup');
        return;
      }
      state.gameWords = game.buildGameWords(state.allWords);
      state.currentIndex = 0;
      state.cookies = 0;
      state.solved = 0;
      state.currentWord = state.gameWords[0] || null;
      state.locked = false;
      utils.setScreen('game');
      if (typeof loadCurrentWord === 'function') loadCurrentWord();
    };

    game.enterNewWords = function enterNewWords() {
      utils.setScreen('setup');
      document.getElementById('dictionarySelect')?.focus();
    };

    return game;
  };
})();

