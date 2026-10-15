(function () {
  const STORAGE_KEYS = ['mini-game-hub.theme', 'robo-saves-cookies.theme'];

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
    button.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
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

  const api = {
    STORAGE_KEYS,
    getPreferredTheme,
    loadTheme,
    saveTheme,
    applyTheme,
    updateThemeButton,
    toggleTheme,
    initTheme
  };

  window.GameTheme = api;
  window.RoboTheme = api;
})();

