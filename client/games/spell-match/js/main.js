(function () {
  const RoboGame = window.RoboGame;
  const { state, els } = RoboGame;
  const { utils, ui, game } = RoboGame;

  function attachEvents() {
    els.startBtn.addEventListener('click', game.startGame);
    els.clearBtn.addEventListener('click', () => {
      els.wordInput.value = '';
      utils.saveWordsToLocalStorage('');
      ui.showMessage('Type some words, then start!', 'good');
    });
    els.soundBtn.addEventListener('click', () => {
      state.soundOn = !state.soundOn;
      ui.updateSoundButton();
      ui.showMessage(state.soundOn ? 'Sound turned on!' : 'Sound turned off!', 'good');
      if (state.soundOn) utils.playTone(523, 0.08, 'triangle', 0.03);
    });
    els.replayBtn.addEventListener('click', game.replayWord);
    els.nextBtn.addEventListener('click', game.nextWord);
    els.resetBtn.addEventListener('click', game.resetCurrentWord);
    els.playAgainBtn.addEventListener('click', game.restartWithSameWords);
    els.newWordsBtn.addEventListener('click', game.enterNewWords);

    els.choiceGrid.addEventListener('click', event => {
      const button = event.target.closest('button[data-choice]');
      if (!button) return;
      game.handleChoice(button.dataset.choice, button);
    });

    els.wordInput.addEventListener('input', () => {
      utils.saveWordsToLocalStorage(els.wordInput.value);
    });

    els.wordInput.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        game.startGame();
      }
    });
  }

  function init() {
    els.wordInput.value = utils.loadSavedWords();
    state.soundOn = localStorage.getItem(RoboGame.constants.STORAGE_KEYS.sound) !== 'false';
    GameTheme.initTheme(els.themeBtn);
    ui.updateSoundButton();
    utils.setScreen('setup');
    ui.showMessage('Choose a word list and start the game!', 'good');
  }

  attachEvents();
  init();
})();


