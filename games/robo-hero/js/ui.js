(function () {
  const RoboGame = (window.RoboGame = window.RoboGame || {});
  const { state, els } = RoboGame;

  const ui = {};
  window.GameEngine.attachCommonUi(RoboGame, ui);

  ui.clearBoard = function clearBoard() {
    state.locked = false;
    state.typedAnswer = "";
    els.nextBtn.style.display = "none";
    els.checkBtn.style.display = "inline-flex";
    if (els.answerInput) {
      els.answerInput.disabled = false;
      els.answerInput.value = "";
      els.answerInput.focus();
    }
  };

  ui.renderSlots = function renderSlots() {};
  ui.renderLetterBank = function renderLetterBank() {};

  RoboGame.ui = ui;
})();
