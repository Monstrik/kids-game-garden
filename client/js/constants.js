(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.constants = {
    STORAGE_KEYS: {
      words: 'robo-saves-cookies.words',
      sound: 'robo-saves-cookies.sound'
    },
    FUN_MESSAGES: [
      'More cookies!',
      'I love spelling!',
      'Yummy!',
      'Cookie power!',
      'Robo is proud of you!'
    ],
    ACCESSORY_REWARDS: [
      { cookies: 5, emoji: '🎩', label: 'hat' },
      { cookies: 10, emoji: '😎', label: 'sunglasses' },
      { cookies: 15, emoji: '🏆', label: 'trophy' },
      { cookies: 20, emoji: '🧢', label: 'cap' },
      { cookies: 25, emoji: '👑', label: 'crown' }
    ],
    WORD_EMOJIS: {
      apple: '🍎',
      banana: '🍌',
      robot: '🤖',
      school: '🏫',
      friend: '🤝',
      cookie: '🍪',
      cookies: '🍪🍪',
      cat: '🐱',
      dog: '🐶',
      sun: '☀️',
      moon: '🌙',
      book: '📚',
      car: '🚗',
      star: '⭐',
      tree: '🌳',
      ball: '⚽',
      fish: '🐟',
      pizza: '🍕'
    },
    DEFAULT_WORDS: ['apple', 'banana', 'robot', 'school', 'friend'].join('\n')
  };
})();


