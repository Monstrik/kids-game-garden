// =========================================================
    // Robo Saves the Cookies
    // All game logic lives in this single file for easy local use.
    // =========================================================

    const STORAGE_KEYS = {
      words: 'robo-saves-cookies.words',
      sound: 'robo-saves-cookies.sound'
    };

    const FUN_MESSAGES = [
      'More cookies!',
      'I love spelling!',
      'Yummy!',
      'Cookie power!',
      'Robo is proud of you!'
    ];

    const ACCESSORY_REWARDS = [
      { cookies: 5, emoji: '🎩', label: 'hat' },
      { cookies: 10, emoji: '😎', label: 'sunglasses' },
      { cookies: 15, emoji: '🏆', label: 'trophy' },
      { cookies: 20, emoji: '🧢', label: 'cap' },
      { cookies: 25, emoji: '👑', label: 'crown' }
    ];

    const WORD_EMOJIS = {
      apple: '🍎',
      banana: '🍌',
      robot: '🤖',
      school: '🏫',
      friend: '🤝',
      cookie: '🍪',
      cookies: '🍪🍪',
      cat: '🐱',
      dog: '🐶',
      sun: '☀️',
      moon: '🌙',
      book: '📚',
      car: '🚗',
      star: '⭐',
      tree: '🌳',
      ball: '⚽',
      fish: '🐟',
      pizza: '🍕'
    };

    const els = {
      setupScreen: document.getElementById('setupScreen'),
      gameScreen: document.getElementById('gameScreen'),
      endScreen: document.getElementById('endScreen'),
      wordInput: document.getElementById('wordInput'),
      startBtn: document.getElementById('startBtn'),
      clearBtn: document.getElementById('clearBtn'),
      soundBtn: document.getElementById('soundBtn'),
      cookieCount: document.getElementById('cookieCount'),
      accessory: document.getElementById('accessory'),
      roboEmoji: document.getElementById('roboEmoji'),
      roboStatus: document.getElementById('roboStatus'),
      progressFill: document.getElementById('progressFill'),
      progressText: document.getElementById('progressText'),
      wordPosition: document.getElementById('wordPosition'),
      emojiHint: document.getElementById('emojiHint'),
      slots: document.getElementById('slots'),
      letterBank: document.getElementById('letterBank'),
      messageBox: document.getElementById('messageBox'),
      hintText: document.getElementById('hintText'),
      hintBtn: document.getElementById('hintBtn'),
      checkBtn: document.getElementById('checkBtn'),
      nextBtn: document.getElementById('nextBtn'),
      resetBtn: document.getElementById('resetBtn'),
      finalCookies: document.getElementById('finalCookies'),
      endStats: document.getElementById('endStats'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      newWordsBtn: document.getElementById('newWordsBtn')
    };

    const state = {
      soundOn: true,
      allWords: [],
      gameWords: [],
      currentIndex: 0,
      cookies: 0,
      solved: 0,
      currentWord: null,
      selected: [],
      hinted: false,
      locked: false
    };

    // ---------------------------
    // Utility helpers
    // ---------------------------

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
      return localStorage.getItem(STORAGE_KEYS.words) || [
        'apple',
        'banana',
        'robot',
        'school',
        'friend'
      ].join('\n');
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

    function updateSoundButton() {
      els.soundBtn.textContent = state.soundOn ? 'Sound On' : 'Sound Off';
      localStorage.setItem(STORAGE_KEYS.sound, String(state.soundOn));
    }

    function updateRoboAccessory() {
      els.accessory.textContent = getAccessoryForCookies(state.cookies);
      els.roboEmoji.classList.remove('wiggle');
      void els.roboEmoji.offsetWidth;
      els.roboEmoji.classList.add('wiggle');
    }

    function updateHeaderStats() {
      els.cookieCount.textContent = state.cookies;
      els.progressFill.style.width = state.gameWords.length
        ? `${(state.solved / state.gameWords.length) * 100}%`
        : '0%';
      els.progressText.textContent = `${state.solved} of ${state.gameWords.length} words`;
      els.wordPosition.textContent = state.currentWord
        ? `Word ${state.currentIndex + 1} / ${state.gameWords.length}`
        : `Word 0 / ${state.gameWords.length}`;
      updateRoboAccessory();
    }

    function showMessage(text, tone = 'neutral') {
      els.messageBox.textContent = text;
      els.messageBox.classList.remove('good', 'bad', 'slideIn');
      if (tone === 'good') els.messageBox.classList.add('good');
      if (tone === 'bad') els.messageBox.classList.add('bad');
      els.messageBox.classList.add('slideIn');
    }

    function setHint(text) {
      els.hintText.textContent = text || '';
    }

    function clearBoard() {
      state.selected = Array(state.currentWord.letters.length).fill(null);
      state.locked = false;
      state.hinted = false;
      els.hintText.textContent = '';
      els.nextBtn.style.display = 'none';
      els.checkBtn.style.display = 'inline-flex';
      renderSlots();
      renderLetterBank();
    }

    // ---------------------------
    // Game setup / render
    // ---------------------------

    function parseWordsFromTextarea() {
      return els.wordInput.value
        .split(/\r?\n/)
        .map(normalizeWord)
        .filter(Boolean)
        .filter(word => /[A-Z]/.test(word));
    }

    function buildGameWords(words) {
      return fisherYatesShuffle(words).map(word => ({
        answer: word,
        letters: shuffleWordLetters(word),
        emoji: getEmojiForWord(word)
      }));
    }

    function renderSlots() {
      els.slots.innerHTML = '';
      state.currentWord.letters.forEach((_, index) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = String(index);
        const selectedLetterIndex = state.selected[index];
        slot.textContent = selectedLetterIndex === null
          ? ''
          : state.currentWord.letters[selectedLetterIndex];
        if (selectedLetterIndex !== null) slot.classList.add('filled');
        slot.addEventListener('click', () => handleSlotClick(index));
        slot.addEventListener('dragover', event => event.preventDefault());
        slot.addEventListener('drop', event => {
          event.preventDefault();
          const letterIndex = Number(event.dataTransfer.getData('text/plain'));
          placeLetterInSlot(letterIndex, index);
        });
        els.slots.appendChild(slot);
      });
    }

    function renderLetterBank() {
      els.letterBank.innerHTML = '';
      state.currentWord.letters.forEach((letter, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'letterTile';
        button.textContent = letter;
        button.dataset.index = String(index);
        button.draggable = true;
        button.disabled = state.locked || state.selected.includes(index);
        if (state.selected.includes(index)) button.classList.add('used');

        button.addEventListener('click', () => {
          if (!button.disabled) {
            placeLetterInNextOpenSlot(index);
          }
        });
        button.addEventListener('dragstart', event => {
          if (button.disabled) {
            event.preventDefault();
            return;
          }
          event.dataTransfer.setData('text/plain', String(index));
        });

        els.letterBank.appendChild(button);
      });
    }

    function startGame() {
      const words = parseWordsFromTextarea();
      if (!words.length) {
        showMessage('Please enter at least one spelling word!', 'bad');
        setScreen('setup');
        return;
      }

      saveWordsToLocalStorage(els.wordInput.value);
      state.allWords = words;
      state.gameWords = buildGameWords(words);
      state.currentIndex = 0;
      state.cookies = 0;
      state.solved = 0;
      state.currentWord = state.gameWords[0];
      setScreen('game');
      showMessage('Choose a letter to start!');
      setHint('');
      loadCurrentWord();
      playTone(523, 0.08, 'triangle', 0.03);
    }

    function loadCurrentWord() {
      if (!state.currentWord) {
        finishGame();
        return;
      }

      els.emojiHint.textContent = state.currentWord.emoji;
      els.roboStatus.textContent = `Spell ${state.currentWord.answer.length} letters for a cookie!`;
      showMessage('Choose a letter to start!');
      setHint('');
      clearBoard();
      updateHeaderStats();
    }

    function placeLetterInNextOpenSlot(letterIndex) {
      const openIndex = state.selected.findIndex(item => item === null);
      if (openIndex === -1 || state.locked) return;
      state.selected[openIndex] = letterIndex;
      renderSlots();
      renderLetterBank();
      showMessage('Keep going!');
      if (state.selected.every(item => item !== null)) {
        autoCheckWord();
      }
    }

    function placeLetterInSlot(letterIndex, slotIndex) {
      if (state.locked) return;
      state.selected[slotIndex] = letterIndex;
      renderSlots();
      renderLetterBank();
      showMessage('Nice move!');
      if (state.selected.every(item => item !== null)) {
        autoCheckWord();
      }
    }

    function handleSlotClick(slotIndex) {
      if (state.locked) return;
      const selectedIndex = state.selected[slotIndex];
      if (selectedIndex === null) return;
      state.selected[slotIndex] = null;
      renderSlots();
      renderLetterBank();
      showMessage('Oops? Try another letter!');
    }

    function currentGuess() {
      if (state.selected.some(item => item === null)) return '';
      return state.selected.map(letterIndex => state.currentWord.letters[letterIndex]).join('');
    }

    function autoCheckWord() {
      const guess = currentGuess();
      if (guess.length !== state.currentWord.answer.length) return;
      if (guess === state.currentWord.answer) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
    }

    function handleCorrectAnswer() {
      state.locked = true;
      state.cookies += 1;
      state.solved += 1;
      updateHeaderStats();
      showMessage(`Great Job! ${pickFunMessage()}`, 'good');
      els.roboStatus.textContent = 'Yay! Robo got a cookie!';
      els.slots.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('wrongPulse');
        slot.classList.add('correctPulse');
      });
      playTone(659, 0.09, 'triangle', 0.05);
      setTimeout(() => playTone(784, 0.12, 'triangle', 0.05), 110);
      speakWord(state.currentWord.answer);

      els.nextBtn.style.display = 'inline-flex';
      els.checkBtn.style.display = 'none';
      setHint(`The word was ${state.currentWord.answer}.`);
      renderLetterBank();
      renderSlots();
    }

    function handleWrongAnswer() {
      showMessage('Try Again!', 'bad');
      els.roboStatus.textContent = 'Almost there — keep trying!';
      els.slots.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('correctPulse');
        slot.classList.add('wrongPulse');
      });
      playTone(196, 0.12, 'sawtooth', 0.04);
      setTimeout(() => {
        els.slots.querySelectorAll('.slot').forEach(slot => slot.classList.remove('wrongPulse'));
      }, 500);
    }

    function nextWord() {
      state.currentIndex += 1;
      if (state.currentIndex >= state.gameWords.length) {
        finishGame();
        return;
      }
      state.currentWord = state.gameWords[state.currentIndex];
      loadCurrentWord();
    }

    function resetCurrentWord() {
      if (!state.currentWord) return;
      clearBoard();
      els.roboStatus.textContent = 'Try the word again!';
      showMessage('Choose a letter to start!');
    }

    function giveHint() {
      if (!state.currentWord) return;
      const word = state.currentWord.answer;
      const first = word[0];
      const last = word[word.length - 1];
      const hint = word.length === 1
        ? `Hint: It has 1 letter. It starts with ${first}.`
        : `Hint: It starts with ${first} and ends with ${last}. It has ${word.length} letters.`;
      setHint(hint);
      state.hinted = true;
      showMessage('Hint unlocked!', 'good');
      playTone(523, 0.06, 'sine', 0.03);
    }

    function finishGame() {
      setScreen('end');
      els.finalCookies.textContent = state.cookies;
      els.endStats.innerHTML = `Words completed: ${state.solved}<br />Cookies earned: ${state.cookies}`;
      els.roboStatus.textContent = 'All done!';
      showMessage('Great job!');
      if (state.soundOn) {
        playTone(523, 0.08, 'triangle', 0.04);
        setTimeout(() => playTone(659, 0.08, 'triangle', 0.04), 120);
        setTimeout(() => playTone(784, 0.12, 'triangle', 0.04), 240);
      }
    }

    function restartWithSameWords() {
      if (!state.allWords.length) {
        setScreen('setup');
        return;
      }
      state.gameWords = buildGameWords(state.allWords);
      state.currentIndex = 0;
      state.cookies = 0;
      state.solved = 0;
      state.currentWord = state.gameWords[0];
      setScreen('game');
      loadCurrentWord();
    }

    function enterNewWords() {
      setScreen('setup');
      els.wordInput.focus();
    }

    // ---------------------------
    // Events
    // ---------------------------

    els.startBtn.addEventListener('click', startGame);
    els.clearBtn.addEventListener('click', () => {
      els.wordInput.value = '';
      saveWordsToLocalStorage('');
      showMessage('Type some words, then start!', 'good');
    });
    els.soundBtn.addEventListener('click', () => {
      state.soundOn = !state.soundOn;
      updateSoundButton();
      showMessage(state.soundOn ? 'Sound turned on!' : 'Sound turned off!', 'good');
      if (state.soundOn) playTone(523, 0.08, 'triangle', 0.03);
    });
    els.hintBtn.addEventListener('click', giveHint);
    els.checkBtn.addEventListener('click', autoCheckWord);
    els.nextBtn.addEventListener('click', nextWord);
    els.resetBtn.addEventListener('click', resetCurrentWord);
    els.playAgainBtn.addEventListener('click', restartWithSameWords);
    els.newWordsBtn.addEventListener('click', enterNewWords);

    els.wordInput.addEventListener('input', () => {
      saveWordsToLocalStorage(els.wordInput.value);
    });

    // Support keyboard entry in the textarea and quick start with Ctrl/Cmd+Enter.
    els.wordInput.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        startGame();
      }
    });

    // ---------------------------
    // Initial page state
    // ---------------------------

    function init() {
      els.wordInput.value = loadSavedWords();
      state.soundOn = localStorage.getItem(STORAGE_KEYS.sound) !== 'false';
      updateSoundButton();
      setScreen('setup');
      showMessage('Choose a word list and start the game!', 'good');
    }

    init();
