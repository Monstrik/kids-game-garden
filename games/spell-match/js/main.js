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

  els.choiceGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-choice]');
    if (!button) return;
    game.handleChoice(button.dataset.choice, button);
  });
})();


