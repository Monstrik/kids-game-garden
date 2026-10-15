(function () {
  const RoboGame = window.RoboGame;
  const { state, els } = RoboGame;
  const { utils, ui, game } = RoboGame;

  function attachEvents() {
    els.themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme || utils.getPreferredTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      utils.applyTheme(nextTheme);
      utils.saveTheme(nextTheme);
      ui.updateThemeButton(nextTheme);
    });

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
    els.hintBtn.addEventListener('click', game.giveHint);
    els.checkBtn.addEventListener('click', game.autoCheckWord);
    els.nextBtn.addEventListener('click', game.nextWord);
    els.resetBtn.addEventListener('click', game.resetCurrentWord);
    els.playAgainBtn.addEventListener('click', game.restartWithSameWords);
    els.newWordsBtn.addEventListener('click', game.enterNewWords);

    els.wordInput.addEventListener('input', () => {
      utils.saveWordsToLocalStorage(els.wordInput.value);
    });

    // Support keyboard entry in the textarea and quick start with Ctrl/Cmd+Enter.
    els.wordInput.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        game.startGame();
      }
    });
  }

  function init() {
    els.wordInput.value = utils.loadSavedWords();
    state.soundOn = localStorage.getItem(RoboGame.constants.STORAGE_KEYS.sound) !== 'false';
    const theme = utils.loadSavedTheme();
    utils.applyTheme(theme);
    ui.updateThemeButton(theme);
    ui.updateSoundButton();
    utils.setScreen('setup');
    ui.showMessage('Choose a word list and start the game!', 'good');
  }

  attachEvents();
  init();
})();


