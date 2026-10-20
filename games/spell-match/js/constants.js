(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const shared = window.GameCommon || {};
  const { ACCESSORY_REWARDS, WORDS, DEFAULT_WORDS } = shared;

  RoboGame.constants = {
    STORAGE_KEYS: {
      words: "kids-game-garden.words",
      sound: "spell-match.sound",
      theme: "mini-game-hub.theme",
    },
    FUN_MESSAGES: [
      "Great job!",
      "Well done!",
      "Excellent work!",
      "That's correct!",
      "Nice going!",
      "Perfect!",
      "Outstanding!",
      "You got it right!",
      "Keep it up!",
      "Fantastic work!",
      "Amazing!",
      "Brilliant!",
      "Super work!",
      "You nailed it!",
      "Way to go!",
    ],
    ACCESSORY_REWARDS,
    WORDS,
    DEFAULT_WORDS,
  };
})();
