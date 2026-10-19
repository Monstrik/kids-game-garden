(function () {
  const RoboGame = window.RoboGame;
  const { state, els } = RoboGame;
  const { utils, ui, game } = RoboGame;
  const touchKeyboardMode =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const dictionaryManagerUrl = new URL(
    "../../../games/dictionary-manager/",
    window.location.href,
  ).toString();

  function attachEvents() {
    els.startBtn.addEventListener("click", game.startGame);
    document
      .getElementById("dictionaryManagerBtn")
      ?.addEventListener("click", () => {
        window.location.href = dictionaryManagerUrl;
      });
    els.soundBtn.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      ui.updateSoundButton();
      ui.showMessage(
        state.soundOn ? "Sound turned on!" : "Sound turned off!",
        "good",
      );
      if (state.soundOn) utils.playTone(523, 0.08, "triangle", 0.03);
    });
    els.replayBtn.addEventListener("click", game.replayWord);
    els.checkBtn.addEventListener("click", game.autoCheckWord);
    els.nextBtn.addEventListener("click", game.nextWord);
    els.resetBtn.addEventListener("click", game.resetCurrentWord);
    els.playAgainBtn.addEventListener("click", game.restartWithSameWords);
    els.newWordsBtn.addEventListener("click", game.enterNewWords);

    els.keyboard.addEventListener("click", (event) => {
      const button = event.target.closest(
        "button[data-key], button[data-action]",
      );
      if (!button || !state.currentWord || state.locked) return;

      event.preventDefault();
      const { key, action } = button.dataset;
      if (key) {
        game.insertKeyboardCharacter(key);
        return;
      }

      if (action === "space") game.insertKeyboardCharacter(" ");
      if (action === "backspace") game.removeKeyboardCharacter();
      if (action === "clear") game.clearTypedAnswer();
    });

    els.answerInput.addEventListener("input", () => {
      if (!state.locked) {
        state.typedAnswer = els.answerInput.value;
        ui.showMessage("Type the word, then press Check Word!");
      }
    });

    els.answerInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        game.autoCheckWord();
      }
    });
  }

  function init() {
    if (window.GameDictionaries?.initDictionaryManager) {
      window.GameDictionaries.initDictionaryManager(els);
    }
    state.soundOn =
      localStorage.getItem(RoboGame.constants.STORAGE_KEYS.sound) !== "false";
    els.answerInput.readOnly = touchKeyboardMode;
    els.answerInput.setAttribute(
      "inputmode",
      touchKeyboardMode ? "none" : "text",
    );
    GameTheme.initTheme(els.themeBtn);
    ui.updateSoundButton();
    utils.setScreen("setup");
    ui.showMessage("Choose a word list and start the game!", "good");
  }

  attachEvents();
  init();
})();
