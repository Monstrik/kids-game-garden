(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const shared = window.GameCommon || {};
  const { ACCESSORY_REWARDS, WORDS, DEFAULT_WORDS } = shared;

  RoboGame.constants = {
    STORAGE_KEYS: {
      words: "kids-game-garden.words",
      sound: "robo-saves-cookies.sound",
      theme: "mini-game-hub.theme",
    },
    FUN_MESSAGES: [
      "More cookies!",
      "I love spelling!",
      "Yummy!",
      "Cookie power!",
      "Robo is proud of you!",
    ],
    ACCESSORY_REWARDS,
    WORDS,
    DEFAULT_WORDS,
  };
})();
