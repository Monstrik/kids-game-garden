(function () {
  const RoboGame = window.RoboGame;
  const { state, els, game } = RoboGame;
  const mobileKeyboardQuery = window.matchMedia && window.matchMedia("(max-width: 560px)");
  let useCustomKeyboardOnSmallScreen = false;

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
      els.keyboardModeToggle.setAttribute("aria-pressed", String(useCustomKeyboardOnSmallScreen));
      els.keyboardModeToggle.textContent = useCustomKeyboardOnSmallScreen ? "Use phone keyboard" : "Use game keyboard";
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

  window.GameEngine.attachCommonMainEvents(RoboGame, {
    onReplay: game.replayWord,
    onCheck: game.autoCheckWord,
    onReset: game.resetCurrentWord,
    onAfterCommonBindings: () => {
      els.keyboard.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-key], button[data-action]");
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
          RoboGame.ui.showMessage("Type the word, then press Check Word!");
        }
      });

      els.answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          game.autoCheckWord();
        }
      });
    },
  });

  function setUpKeyboardMediaQuery() {
    if (!mobileKeyboardQuery) {
      return;
    }

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

  function init() {
    setUpKeyboardMediaQuery();
    window.GameEngine.initGameShell(RoboGame, {
      beforeReady: () => {
        applyKeyboardMode();
      },
    });
  }

  init();
})();
