(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { utils, ui } = RoboGame;

  const game = {};

  game.parseWordsFromTextarea = function parseWordsFromTextarea() {
    return els.wordInput.value
      .split(/\r?\n/)
      .map(utils.normalizeWord)
      .filter(Boolean)
      .filter(word => /[A-Z]/.test(word));
  };

  game.buildGameWords = function buildGameWords(words) {
    return utils.fisherYatesShuffle(words).map(word => ({
      answer: word,
      letters: utils.shuffleWordLetters(word),
      emoji: utils.getEmojiForWord(word)
    }));
  };

  game.startGame = function startGame() {
    const words = game.parseWordsFromTextarea();
    if (!words.length) {
      ui.showMessage('Please enter at least one spelling word!', 'bad');
      utils.setScreen('setup');
      return;
    }

    utils.saveWordsToLocalStorage(els.wordInput.value);
    state.allWords = words;
    state.gameWords = game.buildGameWords(words);
    state.currentIndex = 0;
    state.cookies = 0;
    state.solved = 0;
    state.currentWord = state.gameWords[0];
    utils.setScreen('game');
    ui.showMessage('Choose a letter to start!');
    ui.setHint('');
    game.loadCurrentWord();
    utils.playTone(523, 0.08, 'triangle', 0.03);
  };

  game.loadCurrentWord = function loadCurrentWord() {
    if (!state.currentWord) {
      game.finishGame();
      return;
    }

    els.emojiHint.textContent = state.currentWord.emoji;
    els.roboStatus.textContent = `Spell ${state.currentWord.answer.length} letters for a cookie!`;
    ui.showMessage('Choose a letter to start!');
    ui.setHint('');
    ui.clearBoard();
    ui.updateHeaderStats();
  };

  game.placeLetterInNextOpenSlot = function placeLetterInNextOpenSlot(letterIndex) {
    const openIndex = state.selected.findIndex(item => item === null);
    if (openIndex === -1 || state.locked) return;
    state.selected[openIndex] = letterIndex;
    ui.renderSlots();
    ui.renderLetterBank();
    ui.showMessage('Keep going!');
    if (state.selected.every(item => item !== null)) {
      game.autoCheckWord();
    }
  };

  game.placeLetterInSlot = function placeLetterInSlot(letterIndex, slotIndex) {
    if (state.locked) return;
    state.selected[slotIndex] = letterIndex;
    ui.renderSlots();
    ui.renderLetterBank();
    ui.showMessage('Nice move!');
    if (state.selected.every(item => item !== null)) {
      game.autoCheckWord();
    }
  };

  game.handleSlotClick = function handleSlotClick(slotIndex) {
    if (state.locked) return;
    const selectedIndex = state.selected[slotIndex];
    if (selectedIndex === null) return;
    state.selected[slotIndex] = null;
    ui.renderSlots();
    ui.renderLetterBank();
    ui.showMessage('Oops? Try another letter!');
  };

  game.currentGuess = function currentGuess() {
    if (state.selected.some(item => item === null)) return '';
    return state.selected.map(letterIndex => state.currentWord.letters[letterIndex]).join('');
  };

  game.autoCheckWord = function autoCheckWord() {
    const guess = game.currentGuess();
    if (guess.length !== state.currentWord.answer.length) return;
    if (guess === state.currentWord.answer) {
      game.handleCorrectAnswer();
    } else {
      game.handleWrongAnswer();
    }
  };

  game.handleCorrectAnswer = function handleCorrectAnswer() {
    state.locked = true;
    state.cookies += 1;
    state.solved += 1;
    ui.updateHeaderStats();
    ui.showMessage(`Great Job! ${utils.pickFunMessage()}`, 'good');
    els.roboStatus.textContent = 'Yay! Robo got a cookie!';
    els.slots.querySelectorAll('.slot').forEach(slot => {
      slot.classList.remove('wrongPulse');
      slot.classList.add('correctPulse');
    });
    utils.playTone(659, 0.09, 'triangle', 0.05);
    setTimeout(() => utils.playTone(784, 0.12, 'triangle', 0.05), 110);
    utils.speakWord(state.currentWord.answer);

    els.nextBtn.style.display = 'inline-flex';
    els.checkBtn.style.display = 'none';
    ui.setHint(`The word was ${state.currentWord.answer}.`);
    ui.renderLetterBank();
    ui.renderSlots();
  };

  game.handleWrongAnswer = function handleWrongAnswer() {
    ui.showMessage('Try Again!', 'bad');
    els.roboStatus.textContent = 'Almost there — keep trying!';
    els.slots.querySelectorAll('.slot').forEach(slot => {
      slot.classList.remove('correctPulse');
      slot.classList.add('wrongPulse');
    });
    utils.playTone(196, 0.12, 'sawtooth', 0.04);
    setTimeout(() => {
      els.slots.querySelectorAll('.slot').forEach(slot => slot.classList.remove('wrongPulse'));
    }, 500);
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
    ui.clearBoard();
    els.roboStatus.textContent = 'Try the word again!';
    ui.showMessage('Choose a letter to start!');
  };

  game.giveHint = function giveHint() {
    if (!state.currentWord) return;
    const word = state.currentWord.answer;
    const first = word[0];
    const last = word[word.length - 1];
    const hint = word.length === 1
      ? `Hint: It has 1 letter. It starts with ${first}.`
      : `Hint: It starts with ${first} and ends with ${last}. It has ${word.length} letters.`;
    ui.setHint(hint);
    state.hinted = true;
    ui.showMessage('Hint unlocked!', 'good');
    utils.playTone(523, 0.06, 'sine', 0.03);
  };

  game.finishGame = function finishGame() {
    utils.setScreen('end');
    els.finalCookies.textContent = state.cookies;
    els.endStats.innerHTML = `Words completed: ${state.solved}<br />Cookies earned: ${state.cookies}`;
    els.roboStatus.textContent = 'All done!';
    ui.showMessage('Great job!');
    if (state.soundOn) {
      utils.playTone(523, 0.08, 'triangle', 0.04);
      setTimeout(() => utils.playTone(659, 0.08, 'triangle', 0.04), 120);
      setTimeout(() => utils.playTone(784, 0.12, 'triangle', 0.04), 240);
    }
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
    state.currentWord = state.gameWords[0];
    utils.setScreen('game');
    game.loadCurrentWord();
  };

  game.enterNewWords = function enterNewWords() {
    utils.setScreen('setup');
    els.wordInput.focus();
  };

  RoboGame.game = game;
})();

