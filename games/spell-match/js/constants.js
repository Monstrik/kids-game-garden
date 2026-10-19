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
      "Great ear!",
      "Spelling star!",
      "Match master!",
      "Awesome choice!",
      "Robo is proud of you!",
    ],
    ACCESSORY_REWARDS,
    WORDS,
    DEFAULT_WORDS,
  };
})();
