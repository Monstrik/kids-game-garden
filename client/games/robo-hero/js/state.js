(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});

  RoboGame.els = {
    setupScreen: document.getElementById('setupScreen'),
    gameScreen: document.getElementById('gameScreen'),
    endScreen: document.getElementById('endScreen'),
    dictionarySelect: document.getElementById('dictionarySelect'),
    dictionaryNameInput: document.getElementById('dictionaryNameInput'),
    newListBtn: document.getElementById('newListBtn'),
    deleteListBtn: document.getElementById('deleteListBtn'),
    dictionaryInfo: document.getElementById('dictionaryInfo'),
    wordInput: document.getElementById('wordInput'),
    answerInput: document.getElementById('answerInput'),
    startBtn: document.getElementById('startBtn'),
    clearBtn: document.getElementById('clearBtn'),
    themeBtn: document.getElementById('themeBtn'),
    soundBtn: document.getElementById('soundBtn'),
    cookieCount: document.getElementById('cookieCount'),
    accessory: document.getElementById('accessory'),
    roboEmoji: document.getElementById('roboEmoji'),
    roboStatus: document.getElementById('roboStatus'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    wordPosition: document.getElementById('wordPosition'),
    emojiHint: document.getElementById('emojiHint'),
    keyboard: document.getElementById('keyboard'),
    messageBox: document.getElementById('messageBox'),
    replayBtn: document.getElementById('replayBtn'),
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
    typedAnswer: '',
    locked: false
  };
})();


