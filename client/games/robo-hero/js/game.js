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
    ui.showMessage('Listen first, then type the word!');
    game.loadCurrentWord();
    utils.playTone(523, 0.08, 'triangle', 0.03);
  };

  game.loadCurrentWord = function loadCurrentWord() {
    if (!state.currentWord) {
      game.finishGame();
      return;
    }

    els.emojiHint.textContent = state.currentWord.emoji;
    els.roboStatus.textContent = `Listen closely, then type ${state.currentWord.answer.length} letters for a cookie!`;
    ui.showMessage('Listen carefully!');
    ui.clearBoard();
    ui.updateHeaderStats();
    setTimeout(() => game.replayWord(), 180);
  };

  game.replayWord = function replayWord() {
    if (!state.currentWord) return;
    utils.speakWord(state.currentWord.answer);
  };

  game.insertKeyboardCharacter = function insertKeyboardCharacter(character) {
    if (!state.currentWord || state.locked || !character) return;
    const nextValue = `${els.answerInput.value}${character}`;
    els.answerInput.value = nextValue;
    state.typedAnswer = nextValue;
    els.answerInput.focus();
  };

  game.removeKeyboardCharacter = function removeKeyboardCharacter() {
    if (!state.currentWord || state.locked) return;
    const nextValue = els.answerInput.value.slice(0, -1);
    els.answerInput.value = nextValue;
    state.typedAnswer = nextValue;
    els.answerInput.focus();
  };

  game.clearTypedAnswer = function clearTypedAnswer() {
    if (!state.currentWord || state.locked) return;
    els.answerInput.value = '';
    state.typedAnswer = '';
    els.answerInput.focus();
  };

  game.placeLetterInNextOpenSlot = function placeLetterInNextOpenSlot() {};

  game.placeLetterInSlot = function placeLetterInSlot() {};

  game.handleSlotClick = function handleSlotClick() {};

  game.currentGuess = function currentGuess() {
    return utils.normalizeWord(els.answerInput.value);
  };

  game.autoCheckWord = function autoCheckWord() {
    if (!state.currentWord || state.locked) return;
    const guess = game.currentGuess();
    if (!guess) {
      ui.showMessage('Type the word first!', 'bad');
      els.answerInput.focus();
      return;
    }
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
    if (els.answerInput) els.answerInput.disabled = true;
    utils.playTone(659, 0.09, 'triangle', 0.05);
    setTimeout(() => utils.playTone(784, 0.12, 'triangle', 0.05), 110);
    utils.speakWord(state.currentWord.answer);

    els.nextBtn.style.display = 'inline-flex';
    els.checkBtn.style.display = 'none';
  };

  game.handleWrongAnswer = function handleWrongAnswer() {
    ui.showMessage('Try Again!', 'bad');
    els.roboStatus.textContent = 'Almost there — listen again and keep trying!';
    utils.playTone(196, 0.12, 'sawtooth', 0.04);
    if (els.answerInput) {
      els.answerInput.focus();
      els.answerInput.select();
    }
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
    els.roboStatus.textContent = 'Try the word again — listen closely!';
    ui.showMessage('Listen carefully!');
    game.replayWord();
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


