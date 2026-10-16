(function () {
  const RoboGame = window.RoboGame;
  const { state, els, utils, ui, game } = RoboGame;
  const touchKeyboardMode = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  window.RoboGameKit.bindCommonMain({
    state,
    els,
    utils,
    ui,
    game,
    constants: RoboGame.constants,
    setupMessage: 'Choose a word list and start the game!',
    onInit() {
      els.answerInput.readOnly = touchKeyboardMode;
      els.answerInput.setAttribute('inputmode', touchKeyboardMode ? 'none' : 'text');
    }
  });

  els.keyboard.addEventListener('click', event => {
    const button = event.target.closest('button[data-key], button[data-action]');
    if (!button || !state.currentWord || state.locked) return;

    event.preventDefault();
    const { key, action } = button.dataset;
    if (key) {
      game.insertKeyboardCharacter(key);
      return;
    }

    if (action === 'space') game.insertKeyboardCharacter(' ');
    if (action === 'backspace') game.removeKeyboardCharacter();
    if (action === 'clear') game.clearTypedAnswer();
  });

  els.answerInput.addEventListener('input', () => {
    if (!state.locked) {
      state.typedAnswer = els.answerInput.value;
      ui.showMessage('Type the word, then press Check Word!');
    }
  });

  els.answerInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      game.autoCheckWord();
    }
  });
})();


