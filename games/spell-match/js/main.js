(function () {
  const RoboGame = window.RoboGame;
  const { els, game } = RoboGame;

  window.GameEngine.attachCommonMainEvents(RoboGame, {
    onReplay: game.replayWord,
    onAfterCommonBindings: () => {
      els.choiceGrid.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-choice]");
        if (!button) return;
        game.handleChoice(button.dataset.choice, button);
      });
    },
  });

  window.GameEngine.initGameShell(RoboGame);
})();
