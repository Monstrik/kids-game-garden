(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { utils, ui } = RoboGame;

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function randomLetter(exclude = '') {
    const letters = ALPHABET.split('').filter(letter => letter !== exclude.toUpperCase());
    return letters[Math.floor(Math.random() * letters.length)] || 'A';
  }

  let game;
  game = window.RoboGameKit.createWordGameCore({
    state,
    els,
    utils,
    ui,
    messages: {
      start: 'Listen first, then tap the spelling!',
      emptyWords: 'Please choose a word list with words in it!'
    },
    buildGameWords(words) {
      return utils.fisherYatesShuffle(words).map(word => ({
        answer: word,
        emoji: utils.getEmojiForWord(word)
      }));
    },
    loadCurrentWord() {
      if (!state.currentWord) {
        game.finishGame();
        return;
      }

      els.emojiHint.textContent = state.currentWord.emoji;
      els.roboStatus.textContent = 'Listen closely, then tap the correct spelling!';
      ui.showMessage('Listen carefully!');
      state.currentChoices = game.generateChoices(state.currentWord.answer);
      ui.clearBoard();
      ui.renderChoices();
      ui.updateHeaderStats();
      setTimeout(() => game.replayWord(), 180);
    }
  });

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

  game.resetCurrentWord = function resetCurrentWord() {
    if (!state.currentWord) return;
    state.currentChoices = game.generateChoices(state.currentWord.answer);
    ui.clearBoard();
    ui.renderChoices();
    els.roboStatus.textContent = 'Try this word again — listen closely!';
    ui.showMessage('New choices ready!');
    game.replayWord();
  };

  RoboGame.game = game;
})();

