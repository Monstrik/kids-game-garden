(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { getAccessoryForCookies } = RoboGame.utils;

  const ui = window.RoboGameKit.installCommonUi({
    ui: {},
    state,
    els,
    constants: RoboGame.constants,
    getAccessoryForCookies,
    clearBoard() {
      state.selected = Array(state.currentWord.letters.length).fill(null);
      state.locked = false;
      state.hinted = false;
      els.hintText.textContent = '';
      els.nextBtn.style.display = 'none';
      els.checkBtn.style.display = 'inline-flex';
      ui.renderSlots();
      ui.renderLetterBank();
    }
  });

  ui.setHint = function setHint(text) {
    els.hintText.textContent = text || '';
  };

  ui.renderSlots = function renderSlots() {
    els.slots.innerHTML = '';
    state.currentWord.letters.forEach((_, index) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.dataset.index = String(index);
      const selectedLetterIndex = state.selected[index];
      slot.textContent = selectedLetterIndex === null
        ? ''
        : state.currentWord.letters[selectedLetterIndex];
      if (selectedLetterIndex !== null) slot.classList.add('filled');
      slot.addEventListener('click', () => RoboGame.game.handleSlotClick(index));
      slot.addEventListener('dragover', event => event.preventDefault());
      slot.addEventListener('drop', event => {
        event.preventDefault();
        const letterIndex = Number(event.dataTransfer.getData('text/plain'));
        RoboGame.game.placeLetterInSlot(letterIndex, index);
      });
      els.slots.appendChild(slot);
    });
  };

  ui.renderLetterBank = function renderLetterBank() {
    els.letterBank.innerHTML = '';
    state.currentWord.letters.forEach((letter, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'letterTile';
      button.textContent = letter;
      button.dataset.index = String(index);
      button.draggable = true;
      button.disabled = state.locked || state.selected.includes(index);
      if (state.selected.includes(index)) button.classList.add('used');

      button.addEventListener('click', () => {
        if (!button.disabled) {
          RoboGame.game.placeLetterInNextOpenSlot(index);
        }
      });
      button.addEventListener('dragstart', event => {
        if (button.disabled) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData('text/plain', String(index));
      });

      els.letterBank.appendChild(button);
    });
  };

  RoboGame.ui = ui;
})();


