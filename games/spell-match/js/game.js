(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { utils, ui } = RoboGame;

  const game = {};
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function randomLetter(exclude = '') {
    const letters = ALPHABET.split('').filter(letter => letter !== exclude.toUpperCase());
    return letters[Math.floor(Math.random() * letters.length)] || 'A';
  }

  game.parseWordsFromTextarea = function parseWordsFromTextarea() {
    return utils.loadSavedWords()
      .split(/\r?\n/)
      .map(utils.normalizeWord)
      .filter(Boolean)
      .filter(word => /[A-Z]/.test(word));
  };

  game.buildGameWords = function buildGameWords(words) {
    return utils.fisherYatesShuffle(words).map(word => ({
      answer: word
    }));
  };

  game.createDecoyWord = function createDecoyWord(answer, usedChoices) {
    const base = answer.split('');
    const attempts = 12;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const candidate = [...base];
      const editableIndexes = candidate
        .map((char, index) => (char === ' ' ? -1 : index))
        .filter(index => index >= 0);

      if (!editableIndexes.length) {
        const seed = `${answer} ${randomLetter()}`.trim();
        if (!usedChoices.has(seed)) return seed;
        continue;
      }

      if (candidate.length > 3 && Math.random() < 0.4) {
        const first = editableIndexes[Math.floor(Math.random() * editableIndexes.length)];
        let second = first;
        while (second === first && editableIndexes.length > 1) {
          second = editableIndexes[Math.floor(Math.random() * editableIndexes.length)];
        }
        if (first !== second) {
          [candidate[first], candidate[second]] = [candidate[second], candidate[first]];
        }
      } else {
        const index = editableIndexes[Math.floor(Math.random() * editableIndexes.length)];
        candidate[index] = randomLetter(candidate[index]);
      }

      const result = candidate.join('');
      if (result !== answer && !usedChoices.has(result)) return result;
    }

    return `${answer}${randomLetter()}`;
  };

  game.generateChoices = function generateChoices(answer) {
    const choices = new Set([answer]);
    const otherWords = utils.fisherYatesShuffle(state.allWords.filter(word => word !== answer));

    for (const word of otherWords) {
      choices.add(word);
      if (choices.size >= 4) break;
    }

    while (choices.size < 4) {
      choices.add(game.createDecoyWord(answer, choices));
    }

    return utils.fisherYatesShuffle([...choices]);
  };

  game.startGame = function startGame() {
    const words = game.parseWordsFromTextarea();
    if (!words.length) {
      ui.showMessage('Please choose a word list with words in it!', 'bad');
      utils.setScreen('setup');
      return;
    }

    state.allWords = words;
    state.gameWords = game.buildGameWords(words);
    state.currentIndex = 0;
    state.cookies = 0;
    state.solved = 0;
    state.currentWord = state.gameWords[0];
    utils.setScreen('game');
    ui.showMessage('Listen first, then tap the spelling!');
    game.loadCurrentWord();
    utils.playTone(523, 0.08, 'triangle', 0.03);
  };

  game.loadCurrentWord = function loadCurrentWord() {
    if (!state.currentWord) {
      game.finishGame();
      return;
    }

    els.emojiHint.textContent = state.currentWord.answer;
    els.roboStatus.textContent = 'Listen closely, then tap the correct spelling!';
    ui.showMessage('Listen carefully!');
    state.currentChoices = game.generateChoices(state.currentWord.answer);
    ui.clearBoard();
    ui.renderChoices();
    ui.updateHeaderStats();
    setTimeout(() => game.replayWord(), 180);
  };

  game.replayWord = function replayWord() {
    if (!state.currentWord) return;
    utils.speakWord(state.currentWord.answer);
  };

  game.handleChoice = function handleChoice(choice, button) {
    if (!state.currentWord || state.locked) return;
    if (choice === state.currentWord.answer) {
      game.handleCorrectAnswer(button);
    } else {
      game.handleWrongAnswer(button);
    }
  };

  game.handleCorrectAnswer = function handleCorrectAnswer(button) {
    state.locked = true;
    state.cookies += 1;
    state.solved += 1;
    ui.updateHeaderStats();
    ui.showMessage(`Great Job! ${utils.pickFunMessage()}`, 'good');
    els.roboStatus.textContent = 'Yay! Robo got a cookie!';
    utils.playTone(659, 0.09, 'triangle', 0.05);
    setTimeout(() => utils.playTone(784, 0.12, 'triangle', 0.05), 110);
    utils.speakWord(state.currentWord.answer);

    if (button) button.classList.add('correctPulse');
    els.choiceGrid.querySelectorAll('button').forEach(choiceButton => {
      choiceButton.disabled = true;
    });

    els.nextBtn.style.display = 'inline-flex';
  };

  game.handleWrongAnswer = function handleWrongAnswer(button) {
    ui.showMessage('Try Again!', 'bad');
    els.roboStatus.textContent = 'Almost there — listen again and keep trying!';
    utils.playTone(196, 0.12, 'sawtooth', 0.04);
    if (button) {
      button.classList.add('wrongPulse');
      setTimeout(() => button.classList.remove('wrongPulse'), 500);
    }
  };

  game.nextWord = function nextWord() {
    state.currentIndex += 1;
    if (state.currentIndex >= state.gameWords.length) {
      game.finishGame();
      return;
    }
    state.currentWord = state.gameWords[state.currentIndex];
    game.loadCurrentWord();
  };

  game.resetCurrentWord = function resetCurrentWord() {
    if (!state.currentWord) return;
    state.currentChoices = game.generateChoices(state.currentWord.answer);
    ui.clearBoard();
    ui.renderChoices();
    els.roboStatus.textContent = 'Try this word again — listen closely!';
    ui.showMessage('New choices ready!');
    game.replayWord();
  };


  game.finishGame = function finishGame() {
    utils.setScreen('end');
    els.finalCookies.textContent = state.cookies;
    els.endStats.innerHTML = `Words completed: ${state.solved}<br />Cookies earned: ${state.cookies}`;
    els.roboStatus.textContent = 'All done!';
    ui.showMessage('Great job!');
    if (state.soundOn) {
      utils.playTone(523, 0.08, 'triangle', 0.04);
      setTimeout(() => utils.playTone(659, 0.08, 'triangle', 0.04), 120);
      setTimeout(() => utils.playTone(784, 0.12, 'triangle', 0.04), 240);
    }
  };

  game.restartWithSameWords = function restartWithSameWords() {
    if (!state.allWords.length) {
      utils.setScreen('setup');
      return;
    }
    state.gameWords = game.buildGameWords(state.allWords);
    state.currentIndex = 0;
    state.cookies = 0;
    state.solved = 0;
    state.currentWord = state.gameWords[0];
    utils.setScreen('game');
    game.loadCurrentWord();
  };

  game.enterNewWords = function enterNewWords() {
    utils.setScreen('setup');
    document.getElementById('dictionarySelect')?.focus();
  };

  RoboGame.game = game;
})();


