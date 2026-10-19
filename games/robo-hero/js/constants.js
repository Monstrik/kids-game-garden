(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const shared = window.GameCommon || {};
  const { ACCESSORY_REWARDS, WORDS, DEFAULT_WORDS } = shared;

  RoboGame.constants = {
    STORAGE_KEYS: {
      words: "kids-game-garden.words",
      sound: "robo-spelling-hero.sound",
      theme: "mini-game-hub.theme",
    },
    FUN_MESSAGES: [
      "Hero power!",
      "Typing champion!",
      "Yay for spelling!",
      "Super speedy!",
      "Robo is proud of you!",
    ],
    ACCESSORY_REWARDS,
    WORDS,
    DEFAULT_WORDS,
  };
})();
