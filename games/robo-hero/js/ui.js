(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;
  const { getAccessoryForCookies } = RoboGame.utils;

  const ui = {};

  ui.updateSoundButton = function updateSoundButton() {
    els.soundBtn.textContent = state.soundOn ? 'Sound On' : 'Sound Off';
    localStorage.setItem(RoboGame.constants.STORAGE_KEYS.sound, String(state.soundOn));
  };

  ui.updateThemeButton = function updateThemeButton(theme) {
    const isDark = theme === 'dark';
    els.themeBtn.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
    els.themeBtn.setAttribute('aria-pressed', String(isDark));
  };

  ui.updateRoboAccessory = function updateRoboAccessory() {
    els.accessory.textContent = getAccessoryForCookies(state.cookies);
    els.roboEmoji.classList.remove('wiggle');
    void els.roboEmoji.offsetWidth;
    els.roboEmoji.classList.add('wiggle');
  };

  ui.updateHeaderStats = function updateHeaderStats() {
    els.cookieCount.textContent = state.cookies;
    els.progressFill.style.width = state.gameWords.length
      ? `${(state.solved / state.gameWords.length) * 100}%`
      : '0';
    els.progressText.textContent = `${state.solved} of ${state.gameWords.length} words`;
    els.wordPosition.textContent = state.currentWord
      ? `Word ${state.currentIndex + 1} / ${state.gameWords.length}`
      : `Word 0 / ${state.gameWords.length}`;
    ui.updateRoboAccessory();
  };

  ui.showMessage = function showMessage(text, tone = 'neutral') {
    els.messageBox.textContent = text;
    els.messageBox.classList.remove('good', 'bad', 'slideIn');
    if (tone === 'good') els.messageBox.classList.add('good');
    if (tone === 'bad') els.messageBox.classList.add('bad');
    els.messageBox.classList.add('slideIn');
  };

  ui.clearBoard = function clearBoard() {
    state.locked = false;
    state.typedAnswer = '';
    els.nextBtn.style.display = 'none';
    els.checkBtn.style.display = 'inline-flex';
    if (els.answerInput) {
      els.answerInput.disabled = false;
      els.answerInput.value = '';
      els.answerInput.focus();
    }
  };

  ui.renderSlots = function renderSlots() {};
  ui.renderLetterBank = function renderLetterBank() {};

  RoboGame.ui = ui;
})();


