(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { getAccessoryForCookies } = RoboGame.utils;

  const ui = {};

  ui.updateSoundButton = function updateSoundButton() {
    els.soundBtn.textContent = state.soundOn ? "Sound On" : "Sound Off";
    localStorage.setItem(RoboGame.constants.STORAGE_KEYS.sound, String(state.soundOn));
  };

  ui.updateThemeButton = function updateThemeButton(theme) {
    const isDark = theme === "dark";
    els.themeBtn.textContent = isDark ? "☀️" : "🌙";
    els.themeBtn.setAttribute("aria-pressed", String(isDark));
  };

  ui.updateRoboAccessory = function updateRoboAccessory() {
    els.accessory.textContent = getAccessoryForCookies(state.cookies);
    els.roboEmoji.classList.remove("wiggle");
    void els.roboEmoji.offsetWidth;
    els.roboEmoji.classList.add("wiggle");
  };

  ui.updateHeaderStats = function updateHeaderStats() {
    els.cookieCount.textContent = state.cookies;
    els.progressFill.style.width = state.gameWords.length ? `${(state.solved / state.gameWords.length) * 100}%` : "0";
    els.progressText.textContent = `${state.solved} of ${state.gameWords.length} words`;
    els.wordPosition.textContent = state.currentWord
      ? `Word ${state.currentIndex + 1} / ${state.gameWords.length}`
      : `Word 0 / ${state.gameWords.length}`;
    ui.updateRoboAccessory();
  };

  ui.showMessage = function showMessage(text, tone = "neutral") {
    els.messageBox.textContent = text;
    els.messageBox.classList.remove("good", "bad", "slideIn");
    if (tone === "good") els.messageBox.classList.add("good");
    if (tone === "bad") els.messageBox.classList.add("bad");
    els.messageBox.classList.add("slideIn");
  };

  ui.setHint = function setHint(text) {
    els.hintText.textContent = text || "";
  };

  ui.clearBoard = function clearBoard() {
    state.selected = Array(state.currentWord.letters.length).fill(null);
    state.locked = false;
    state.hinted = false;
    els.hintText.textContent = "";
    els.nextBtn.style.display = "none";
    els.checkBtn.style.display = "inline-flex";
    ui.renderSlots();
    ui.renderLetterBank();
  };

  ui.renderSlots = function renderSlots() {
    els.slots.innerHTML = "";
    state.currentWord.letters.forEach((_, index) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.index = String(index);
      const selectedLetterIndex = state.selected[index];
      slot.textContent = selectedLetterIndex === null ? "" : state.currentWord.letters[selectedLetterIndex];
      if (selectedLetterIndex !== null) slot.classList.add("filled");
      slot.addEventListener("click", () => RoboGame.game.handleSlotClick(index));
      slot.addEventListener("dragover", (event) => event.preventDefault());
      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        const letterIndex = Number(event.dataTransfer.getData("text/plain"));
        RoboGame.game.placeLetterInSlot(letterIndex, index);
      });
      els.slots.appendChild(slot);
    });
  };

  ui.renderLetterBank = function renderLetterBank() {
    els.letterBank.innerHTML = "";
    state.currentWord.letters.forEach((letter, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letterTile";
      button.textContent = letter;
      button.dataset.index = String(index);
      button.draggable = true;
      button.disabled = state.locked || state.selected.includes(index);
      if (state.selected.includes(index)) button.classList.add("used");

      button.addEventListener("click", () => {
        if (!button.disabled) {
          RoboGame.game.placeLetterInNextOpenSlot(index);
        }
      });
      button.addEventListener("dragstart", (event) => {
        if (button.disabled) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.setData("text/plain", String(index));
      });

      els.letterBank.appendChild(button);
    });
  };

  RoboGame.ui = ui;
})();
