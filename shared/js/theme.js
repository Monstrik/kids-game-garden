(function () {
  const STORAGE_KEYS = ['kids-game-garden.theme', 'mini-game-hub.theme', 'robo-saves-cookies.theme'];

  function getPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function loadTheme() {
    for (const key of STORAGE_KEYS) {
      const saved = localStorage.getItem(key);
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return getPreferredTheme();
  }

  function saveTheme(theme) {
    for (const key of STORAGE_KEYS) {
      localStorage.setItem(key, theme);
    }
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function updateThemeButton(button, theme) {
    if (!button) return;
    const isDark = theme === 'dark';
    button.textContent = isDark ? '☀️' : '🌙';
    button.setAttribute('aria-pressed', String(isDark));
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme || loadTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
    return next;
  }

  function initTheme(button) {
    const theme = loadTheme();
    applyTheme(theme);
    updateThemeButton(button, theme);
    if (button) {
      button.addEventListener('click', () => {
        const next = toggleTheme();
        updateThemeButton(button, next);
      });
    }
    return theme;
  }

  const api = (window.GameTheme = window.GameTheme || {});
  api.STORAGE_KEYS = STORAGE_KEYS;
  api.getPreferredTheme = getPreferredTheme;
  api.loadTheme = loadTheme;
  api.saveTheme = saveTheme;
  api.applyTheme = applyTheme;
  api.updateThemeButton = updateThemeButton;
  api.toggleTheme = toggleTheme;
  api.initTheme = initTheme;

  window.RoboTheme = api;
})();

