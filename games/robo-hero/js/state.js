(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.els = window.GameEngine.collectEls([
    "answerInput",
    "keyboardModeToggle",
    "keyboard",
    "replayBtn",
    "checkBtn",
  ]);

  RoboGame.state = window.GameEngine.createBaseState({
    typedAnswer: "",
  });
})();
