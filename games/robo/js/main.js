(function () {
  const RoboGame = window.RoboGame;
  const { game } = RoboGame;

  window.GameEngine.attachCommonMainEvents(RoboGame, {
    onHint: game.giveHint,
    onCheck: game.autoCheckWord,
    onReset: game.resetCurrentWord,
  });

  window.GameEngine.initGameShell(RoboGame);
})();
