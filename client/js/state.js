(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.els = {
    setupScreen: document.getElementById('setupScreen'),
    gameScreen: document.getElementById('gameScreen'),
    endScreen: document.getElementById('endScreen'),
    wordInput: document.getElementById('wordInput'),
    startBtn: document.getElementById('startBtn'),
    clearBtn: document.getElementById('clearBtn'),
    soundBtn: document.getElementById('soundBtn'),
    cookieCount: document.getElementById('cookieCount'),
    accessory: document.getElementById('accessory'),
    roboEmoji: document.getElementById('roboEmoji'),
    roboStatus: document.getElementById('roboStatus'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    wordPosition: document.getElementById('wordPosition'),
    emojiHint: document.getElementById('emojiHint'),
    slots: document.getElementById('slots'),
    letterBank: document.getElementById('letterBank'),
    messageBox: document.getElementById('messageBox'),
    hintText: document.getElementById('hintText'),
    hintBtn: document.getElementById('hintBtn'),
    checkBtn: document.getElementById('checkBtn'),
    nextBtn: document.getElementById('nextBtn'),
    resetBtn: document.getElementById('resetBtn'),
    finalCookies: document.getElementById('finalCookies'),
    endStats: document.getElementById('endStats'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    newWordsBtn: document.getElementById('newWordsBtn')
  };

  RoboGame.state = {
    soundOn: true,
    allWords: [],
    gameWords: [],
    currentIndex: 0,
    cookies: 0,
    solved: 0,
    currentWord: null,
    selected: [],
    hinted: false,
    locked: false
  };
})();


