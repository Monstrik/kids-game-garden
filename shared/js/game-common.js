(function () {
  const api = (window.GameCommon = window.GameCommon || {});

  api.WORDS = ["apple", "banana", "robot", "school", "friend"];
  api.DEFAULT_WORDS = api.WORDS.join("\n");
  api.ACCESSORY_REWARDS = [
    { cookies: 5, emoji: "🎩", label: "hat" },
    { cookies: 10, emoji: "😎", label: "sunglasses" },
    { cookies: 15, emoji: "🏆", label: "trophy" },
    { cookies: 20, emoji: "🧢", label: "cap" },
    { cookies: 25, emoji: "👑", label: "crown" },
  ];

  api.normalizeWord = function normalizeWord(raw) {
    return String(raw || "")
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();
  };

  api.fisherYatesShuffle = function fisherYatesShuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  api.shuffleWordLetters = function shuffleWordLetters(word) {
    const letters = String(word || "").split("");
    if (letters.length <= 1) return letters;

    let shuffled = api.fisherYatesShuffle(letters);
    let attempts = 0;
    while (shuffled.join("") === letters.join("") && attempts < 10) {
      shuffled = api.fisherYatesShuffle(letters);
      attempts += 1;
    }
    return shuffled;
  };

  api.getAccessoryForCookies = function getAccessoryForCookies(
    cookieCount,
    rewards = api.ACCESSORY_REWARDS,
  ) {
    let current = "";
    for (const reward of rewards) {
      if (cookieCount >= reward.cookies) current = reward.emoji;
    }
    return current;
  };

  api.pickFunMessage = function pickFunMessage(messages = []) {
    if (!messages.length) return "";
    return messages[Math.floor(Math.random() * messages.length)];
  };

  api.getPreferredTheme = function getPreferredTheme() {
    if (window.GameTheme?.getPreferredTheme)
      return window.GameTheme.getPreferredTheme();
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  api.saveTheme = function saveTheme(theme) {
    if (window.GameTheme?.saveTheme) {
      window.GameTheme.saveTheme(theme);
      return;
    }
    localStorage.setItem("mini-game-hub.theme", theme);
  };

  api.applyTheme = function applyTheme(theme) {
    if (window.GameTheme?.applyTheme) {
      window.GameTheme.applyTheme(theme);
      return;
    }
    document.documentElement.dataset.theme = theme;
  };

  api.setScreen = function setScreen(els, name) {
    if (!els) return;
    els.setupScreen?.classList.toggle("active", name === "setup");
    els.gameScreen?.classList.toggle("active", name === "game");
    els.endScreen?.classList.toggle("active", name === "end");
  };

  api.playTone = function playTone(
    soundOn,
    frequency = 440,
    duration = 0.12,
    type = "sine",
    volume = 0.05,
  ) {
    if (!soundOn) return;
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
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
  };

  api.speakWord = function speakWord(soundOn, word) {
    if (!soundOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      String(word || "").toLowerCase(),
    );
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  api.playFireworks = function playFireworks(bursts = 7) {
    if (!document?.body) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const overlay = document.createElement("div");
    overlay.className = "fireworksOverlay";

    const safeBursts = Math.max(1, Math.min(Number(bursts) || 7, 12));
    for (let i = 0; i < safeBursts; i += 1) {
      const centerX = 10 + Math.random() * 80;
      const centerY = 10 + Math.random() * 55;
      const hue = Math.floor(Math.random() * 360);
      const delay = (Math.random() * 0.35).toFixed(2);

      for (let p = 0; p < 14; p += 1) {
        const particle = document.createElement("span");
        const angle = (Math.PI * 2 * p) / 14;
        const distance = 28 + Math.random() * 42;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        particle.className = "fireworkParticle";
        particle.style.left = `${centerX}%`;
        particle.style.top = `${centerY}%`;
        particle.style.setProperty("--dx", `${dx.toFixed(1)}px`);
        particle.style.setProperty("--dy", `${dy.toFixed(1)}px`);
        particle.style.setProperty("--hue", String((hue + p * 7) % 360));
        particle.style.animationDelay = `${delay}s`;
        overlay.appendChild(particle);
      }
    }

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1700);
  };

  api.loadSavedWords = function loadSavedWords(
    storageKeys,
    defaultWords = api.DEFAULT_WORDS,
    legacyKeys = [],
  ) {
    if (window.GameDictionaries?.getActiveWords)
      return window.GameDictionaries.getActiveWords();
    const keys = [storageKeys?.words, ...legacyKeys].filter(Boolean);
    for (const key of keys) {
      const saved = localStorage.getItem(key);
      if (saved) return saved;
    }
    return defaultWords;
  };

  api.saveWordsToLocalStorage = function saveWordsToLocalStorage(
    storageKeys,
    text,
    legacyKeys = [],
  ) {
    if (window.GameDictionaries?.setActiveWords) {
      window.GameDictionaries.setActiveWords(text);
      return;
    }
    const keys = [storageKeys?.words, ...legacyKeys].filter(Boolean);
    for (const key of keys) localStorage.setItem(key, text);
  };
})();
