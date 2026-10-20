(function () {
  const RoboGame = window.RoboGame;
  const { state, els } = RoboGame;
  const { utils, ui, game } = RoboGame;
  const mobileKeyboardQuery =
    window.matchMedia && window.matchMedia("(max-width: 560px)");
  let useCustomKeyboardOnSmallScreen = false;
  const dictionaryManagerUrl = new URL(
    "../dictionary-manager/",
    window.location.href,
  ).toString();

  function isSmallScreen() {
    return Boolean(mobileKeyboardQuery && mobileKeyboardQuery.matches);
  }

  function applyKeyboardMode(options = {}) {
    const { shouldFocusNative = false } = options;
    const smallScreen = isSmallScreen();
    const customKeyboardVisible = !smallScreen || useCustomKeyboardOnSmallScreen;
    const nativeKeyboardEnabled = !smallScreen || !useCustomKeyboardOnSmallScreen;

    if (els.keyboard) {
      els.keyboard.hidden = !customKeyboardVisible;
    }

    if (els.keyboardModeToggle) {
      els.keyboardModeToggle.hidden = !smallScreen;
      els.keyboardModeToggle.setAttribute(
        "aria-pressed",
        String(useCustomKeyboardOnSmallScreen),
      );
      els.keyboardModeToggle.textContent = useCustomKeyboardOnSmallScreen
        ? "Use phone keyboard"
        : "Use game keyboard";
    }

    if (!els.answerInput) {
      return;
    }

    els.answerInput.readOnly = !nativeKeyboardEnabled;
    els.answerInput.setAttribute("inputmode", nativeKeyboardEnabled ? "text" : "none");

    if (nativeKeyboardEnabled && shouldFocusNative && !state.locked) {
      els.answerInput.focus();
    }
  }

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

    els.keyboardModeToggle?.addEventListener("click", () => {
      if (!isSmallScreen()) {
        return;
      }
      useCustomKeyboardOnSmallScreen = !useCustomKeyboardOnSmallScreen;
      applyKeyboardMode({ shouldFocusNative: !useCustomKeyboardOnSmallScreen });
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
    if (mobileKeyboardQuery) {
      const handleKeyboardQueryChange = () => {
        if (!isSmallScreen()) {
          useCustomKeyboardOnSmallScreen = false;
        }
        applyKeyboardMode();
      };

      if (typeof mobileKeyboardQuery.addEventListener === "function") {
        mobileKeyboardQuery.addEventListener("change", handleKeyboardQueryChange);
      } else if (typeof mobileKeyboardQuery.addListener === "function") {
        mobileKeyboardQuery.addListener(handleKeyboardQueryChange);
      }
    }

    applyKeyboardMode();
    GameTheme.initTheme(els.themeBtn);
    ui.updateSoundButton();
    utils.setScreen("setup");
    ui.showMessage("Choose a word list and start the game!", "good");
  }

  attachEvents();
  init();
})();
