(function () {
  const RoboGame = window.RoboGame;
  const { state, els, utils, ui, game } = RoboGame;

  window.RoboGameKit.bindCommonMain({
    state,
    els,
    utils,
    ui,
    game,
    constants: RoboGame.constants,
    setupMessage: 'Choose a word list and start the game!'
  });

  els.hintBtn.addEventListener('click', game.giveHint);
  els.checkBtn.addEventListener('click', game.autoCheckWord);
  els.nextBtn.addEventListener('click', game.nextWord);
  els.resetBtn.addEventListener('click', game.resetCurrentWord);
})();


