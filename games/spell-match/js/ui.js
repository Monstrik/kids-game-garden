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
      state.locked = false;
      els.nextBtn.style.display = 'none';
      els.choiceGrid.innerHTML = '';
    }
  });

  ui.renderSlots = function renderSlots() {};
  ui.renderLetterBank = function renderLetterBank() {};

  ui.renderChoices = function renderChoices() {
    els.choiceGrid.innerHTML = '';
    state.currentChoices.forEach(choice => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choiceButton';
      button.dataset.choice = choice;
      button.textContent = choice;
      button.disabled = state.locked;
      els.choiceGrid.appendChild(button);
    });
  };

  RoboGame.ui = ui;
})();


