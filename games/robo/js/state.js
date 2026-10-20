(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.els = window.GameEngine.collectEls(["slots", "letterBank", "hintText", "hintBtn", "checkBtn"]);

  RoboGame.state = window.GameEngine.createBaseState({
    selected: [],
    hinted: false,
  });
})();
