(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { STORAGE_KEYS, FUN_MESSAGES, DEFAULT_WORDS, ACCESSORY_REWARDS } = RoboGame.constants;
  const { GameCommon } = window;
  const dictionaryManager = window.GameDictionaries;

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
    GameCommon.saveWordsToLocalStorage(STORAGE_KEYS, text, ["robo-spelling-hero.words"]);
  }

  function loadSavedWords() {
    if (dictionaryManager?.getActiveWords) return dictionaryManager.getActiveWords();
    return GameCommon.loadSavedWords(STORAGE_KEYS, DEFAULT_WORDS, ["robo-spelling-hero.words"]);
  }

  RoboGame.utils = {
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
  };

  RoboGame.utils.loadSavedWords = loadSavedWords;
})();
