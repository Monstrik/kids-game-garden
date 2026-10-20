(function () {
  const RoboGame = window.RoboGame;
  const { state, els } = RoboGame;
  const { utils, ui, game } = RoboGame;
  const dictionaryManagerUrl = new URL("../dictionary-manager/", window.location.href).toString();

  function attachEvents() {
    els.startBtn.addEventListener("click", game.startGame);
    document.getElementById("dictionaryManagerBtn")?.addEventListener("click", () => {
      window.location.href = dictionaryManagerUrl;
    });
    els.soundBtn.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      ui.updateSoundButton();
      ui.showMessage(state.soundOn ? "Sound turned on!" : "Sound turned off!", "good");
      if (state.soundOn) utils.playTone(523, 0.08, "triangle", 0.03);
    });
    els.replayBtn.addEventListener("click", game.replayWord);
    els.nextBtn.addEventListener("click", game.nextWord);
    els.playAgainBtn.addEventListener("click", game.restartWithSameWords);
    els.newWordsBtn.addEventListener("click", game.enterNewWords);

    els.choiceGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-choice]");
      if (!button) return;
      game.handleChoice(button.dataset.choice, button);
    });
  }

  function init() {
    if (window.GameDictionaries?.initDictionaryManager) {
      window.GameDictionaries.initDictionaryManager(els);
    }
    state.soundOn = localStorage.getItem(RoboGame.constants.STORAGE_KEYS.sound) !== "false";
    GameTheme.initTheme(els.themeBtn);
    ui.updateSoundButton();
    utils.setScreen("setup");
    ui.showMessage("Choose a word list and start the game!", "good");
  }

  attachEvents();
  init();
})();
