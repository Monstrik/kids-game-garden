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
      "Amazing work!",
      "Fantastic spelling!",
      "You nailed it!",
      "Super smart!",
      "Brilliant job!",
      "Awesome effort!",
      "You are on fire!",
      "Way to go!",
      "Impressive thinking!",
      "You did it!",
    ],
    ACCESSORY_REWARDS,
    WORDS,
    DEFAULT_WORDS,
  };
})();
