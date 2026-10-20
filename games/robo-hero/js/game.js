(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { utils, ui } = RoboGame;

  const game = {};

  window.GameEngine.attachBaseGame(RoboGame, game, {
    startMessage: "Listen first, then type the word!",
    replayCurrentWord: () => game.replayWord(),
    onResetCurrentWord: () => ui.clearBoard(),
  });

  game.loadCurrentWord = function loadCurrentWord() {
    if (!state.currentWord) {
      game.finishGame();
      return;
    }

    els.emojiHint.textContent = state.currentWord.answer;
    els.roboStatus.textContent = `Listen closely, then type ${state.currentWord.answer.length} letters for a cookie!`;
    ui.showMessage("Listen carefully!");
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
    els.answerInput.value = "";
    state.typedAnswer = "";
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
      ui.showMessage("Type the word first!", "bad");
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
    const praise = utils.pickFunMessage();
    ui.updateHeaderStats();
    ui.showMessage(`Great Job! ${praise}`, "good");
    els.roboStatus.textContent = "Yay! Robo got a cookie!";
    if (els.answerInput) els.answerInput.disabled = true;
    utils.playTone(659, 0.09, "triangle", 0.05);
    setTimeout(() => utils.playTone(784, 0.12, "triangle", 0.05), 110);
    utils.speakWord(praise);

    els.nextBtn.style.display = "inline-flex";
    els.checkBtn.style.display = "none";
  };

  game.handleWrongAnswer = function handleWrongAnswer() {
    ui.showMessage("Try Again!", "bad");
    els.roboStatus.textContent = "Almost there — listen again and keep trying!";
    utils.playTone(196, 0.12, "sawtooth", 0.04);
    if (els.answerInput) {
      els.answerInput.focus();
      els.answerInput.select();
    }
  };

  RoboGame.game = game;
})();
