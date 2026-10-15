(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { STORAGE_KEYS, FUN_MESSAGES, ACCESSORY_REWARDS, WORD_EMOJIS, DEFAULT_WORDS } = RoboGame.constants;
  const { state, els } = RoboGame;

  function normalizeWord(raw) {
    return raw
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }

  function fisherYatesShuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function shuffleWordLetters(word) {
    const letters = word.split('');
    if (letters.length <= 1) return letters;

    let shuffled = fisherYatesShuffle(letters);
    // Try a few times to avoid showing the exact same order for longer words.
    let attempts = 0;
    while (shuffled.join('') === letters.join('') && attempts < 10) {
      shuffled = fisherYatesShuffle(letters);
      attempts += 1;
    }
    return shuffled;
  }

  function getEmojiForWord(word) {
    return WORD_EMOJIS[word.toLowerCase()] || '✨';
  }

  function getAccessoryForCookies(cookieCount) {
    let current = '';
    for (const reward of ACCESSORY_REWARDS) {
      if (cookieCount >= reward.cookies) current = reward.emoji;
    }
    return current;
  }

  function pickFunMessage() {
    return FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
  }

  function saveWordsToLocalStorage(text) {
    localStorage.setItem(STORAGE_KEYS.words, text);
  }

  function loadSavedWords() {
    return localStorage.getItem(STORAGE_KEYS.words)
      || localStorage.getItem('robo-saves-cookies.words')
      || DEFAULT_WORDS;
  }

  function getPreferredTheme() {
    if (window.GameTheme?.getPreferredTheme) return window.GameTheme.getPreferredTheme();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function saveTheme(theme) {
    if (window.GameTheme?.saveTheme) {
      window.GameTheme.saveTheme(theme);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    localStorage.setItem('robo-saves-cookies.theme', theme);
  }

  function applyTheme(theme) {
    if (window.GameTheme?.applyTheme) {
      window.GameTheme.applyTheme(theme);
      return;
    }
    document.documentElement.dataset.theme = theme;
  }

  function setScreen(name) {
    els.setupScreen.classList.toggle('active', name === 'setup');
    els.gameScreen.classList.toggle('active', name === 'game');
    els.endScreen.classList.toggle('active', name === 'end');
  }

  function playTone(frequency = 440, duration = 0.12, type = 'sine', volume = 0.05) {
    if (!state.soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audio = new AudioContextClass();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = volume;
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + duration);
      osc.onended = () => audio.close?.();
    } catch {
      // Sound is optional; if the browser blocks it, the game still works.
    }
  }

  function speakWord(word) {
    if (!state.soundOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  RoboGame.utils = {
    normalizeWord,
    fisherYatesShuffle,
    shuffleWordLetters,
    getEmojiForWord,
    getAccessoryForCookies,
    pickFunMessage,
    saveWordsToLocalStorage,
    setScreen,
    playTone,
    speakWord,
    getPreferredTheme,
    saveTheme,
    applyTheme
  };

  RoboGame.utils.loadSavedWords = loadSavedWords;
})();


