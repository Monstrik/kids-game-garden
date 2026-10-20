(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  RoboGame.utils = window.GameEngine.createUtils(RoboGame, {
    legacyWordKeys: ["spell-match.words"],
  });
})();
