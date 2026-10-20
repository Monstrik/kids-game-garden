(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { utils, ui } = RoboGame;

  const game = {};

  window.GameEngine.attachBaseGame(RoboGame, game, {
    startMessage: "Listen first, then choose a letter to start!",
    onAfterStart: () => ui.setHint(""),
  });

  game.loadCurrentWord = function loadCurrentWord() {
    if (!state.currentWord) {
      game.finishGame();
      return;
    }

    els.emojiHint.textContent = state.currentWord.answer;
    els.roboStatus.textContent = `Listen closely, then spell ${state.currentWord.answer.length} letters for a cookie!`;
    ui.showMessage("Listen carefully!");
    ui.setHint("");
    ui.clearBoard();
    ui.updateHeaderStats();
    setTimeout(() => utils.speakWord(state.currentWord.answer), 180);
  };

  game.placeLetterInNextOpenSlot = function placeLetterInNextOpenSlot(letterIndex) {
    const openIndex = state.selected.findIndex((item) => item === null);
    if (openIndex === -1 || state.locked) return;
    state.selected[openIndex] = letterIndex;
    utils.speakWord(state.currentWord.letters[letterIndex]);
    ui.renderSlots();
    ui.renderLetterBank();
    ui.showMessage("Keep going!");
    if (state.selected.every((item) => item !== null)) {
      game.autoCheckWord();
    }
  };

  game.placeLetterInSlot = function placeLetterInSlot(letterIndex, slotIndex) {
    if (state.locked) return;
    state.selected[slotIndex] = letterIndex;
    utils.speakWord(state.currentWord.letters[letterIndex]);
    ui.renderSlots();
    ui.renderLetterBank();
    ui.showMessage("Nice move!");
    if (state.selected.every((item) => item !== null)) {
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
    ui.showMessage("Oops? Try another letter!");
  };

  game.currentGuess = function currentGuess() {
    if (state.selected.some((item) => item === null)) return "";
    return state.selected.map((letterIndex) => state.currentWord.letters[letterIndex]).join("");
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
    const praise = utils.pickFunMessage();
    ui.updateHeaderStats();
    ui.showMessage(`Great Job! ${praise}`, "good");
    els.roboStatus.textContent = "Yay! Robo got a cookie!";
    els.slots.querySelectorAll(".slot").forEach((slot) => {
      slot.classList.remove("wrongPulse");
      slot.classList.add("correctPulse");
    });
    utils.playTone(659, 0.09, "triangle", 0.05);
    setTimeout(() => utils.playTone(784, 0.12, "triangle", 0.05), 110);
    utils.speakWord(praise);

    els.nextBtn.style.display = "inline-flex";
    els.checkBtn.style.display = "none";
    ui.setHint(`The word was ${state.currentWord.answer}.`);
    ui.renderLetterBank();
    ui.renderSlots();
  };

  game.handleWrongAnswer = function handleWrongAnswer() {
    ui.showMessage("Try Again!", "bad");
    els.roboStatus.textContent = "Almost there — listen again and keep trying!";
    els.slots.querySelectorAll(".slot").forEach((slot) => {
      slot.classList.remove("correctPulse");
      slot.classList.add("wrongPulse");
    });
    utils.playTone(196, 0.12, "sawtooth", 0.04);
    setTimeout(() => {
      els.slots.querySelectorAll(".slot").forEach((slot) => slot.classList.remove("wrongPulse"));
    }, 500);
  };

  game.giveHint = function giveHint() {
    if (!state.currentWord) return;
    const word = state.currentWord.answer;
    const first = word[0];
    const last = word[word.length - 1];
    const hint =
      word.length === 1
        ? `Hint: It has 1 letter. It starts with ${first}.`
        : `Hint: It starts with ${first} and ends with ${last}. It has ${word.length} letters.`;
    ui.setHint(hint);
    state.hinted = true;
    ui.showMessage("Hint unlocked!", "good");
    utils.playTone(523, 0.06, "sine", 0.03);
  };

  RoboGame.game = game;
})();
