(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.els = window.GameEngine.collectEls(["choiceGrid", "replayBtn"]);

  RoboGame.state = window.GameEngine.createBaseState({
    currentChoices: [],
  });
})();
