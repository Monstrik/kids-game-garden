(function () {
  function init() {
    const themeBtn = document.getElementById('themeBtn');
    if (window.GameTheme?.initTheme) {
      GameTheme.initTheme(themeBtn);
    }

    if (window.GameDictionaries?.initDictionaryManager) {
      GameDictionaries.initDictionaryManager({
        dictionarySelect: document.getElementById('dictionarySelect'),
        dictionaryNameInput: document.getElementById('dictionaryNameInput'),
        wordInput: document.getElementById('wordInput'),
        newListBtn: document.getElementById('newListBtn'),
        deleteListBtn: document.getElementById('deleteListBtn'),
        dictionaryInfo: document.getElementById('dictionaryInfo')
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

