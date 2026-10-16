(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  RoboGame.utils = window.RoboGameKit.createUtils({
    state: RoboGame.state,
    els: RoboGame.els,
    constants: RoboGame.constants,
    legacyWordKeys: ['spell-match.words']
  });
})();


