(function () {
  const STORAGE_KEY = "kids-game-garden.dictionaries";
  const LEGACY_WORD_KEYS = [
    "kids-game-garden.words",
    "robo-saves-cookies.words",
    "robo-spelling-hero.words",
    "spell-match.words",
  ];
  const DEFAULT_WORDS = ["apple", "banana", "robot", "school", "friend"].join(
    "\n",
  );
  const DEFAULT_LIST_NAME = "Starter list";

  const api = (window.GameDictionaries = window.GameDictionaries || {});

  let cachedState = null;
  let boundElements = {};

  function createId() {
    return `dict-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeName(name) {
    return (
      String(name || "")
        .trim()
        .replace(/\s+/g, " ") || DEFAULT_LIST_NAME
    );
  }

  function normalizeWords(text) {
    return String(text ?? "").replace(/\r\n/g, "\n");
  }

  function createDictionary(name = DEFAULT_LIST_NAME, words = DEFAULT_WORDS) {
    const now = Date.now();
    return {
      id: createId(),
      name: normalizeName(name),
      words: normalizeWords(words),
      createdAt: now,
      updatedAt: now,
    };
  }

  function readLegacyWords() {
    for (const key of LEGACY_WORD_KEYS) {
      const value = localStorage.getItem(key);
      if (value !== null) return value;
    }
    return null;
  }

  function buildDefaultState() {
    const legacyWords = readLegacyWords();
    const dictionary = createDictionary(
      DEFAULT_LIST_NAME,
      legacyWords !== null ? legacyWords : DEFAULT_WORDS,
    );
    return {
      activeId: dictionary.id,
      dictionaries: [dictionary],
    };
  }

  function sanitizeDictionary(raw, index = 0) {
    const dictionary = raw && typeof raw === "object" ? raw : {};
    const now = Date.now();

    return {
      id: String(dictionary.id || `dict-${index + 1}-${now}`),
      name: normalizeName(dictionary.name),
      words: normalizeWords(dictionary.words),
      createdAt: Number.isFinite(dictionary.createdAt)
        ? dictionary.createdAt
        : now,
      updatedAt: Number.isFinite(dictionary.updatedAt)
        ? dictionary.updatedAt
        : now,
    };
  }

  function sanitizeState(rawState) {
    const state = rawState && typeof rawState === "object" ? rawState : {};
    const dictionaries = Array.isArray(state.dictionaries)
      ? state.dictionaries.map((dictionary, index) =>
          sanitizeDictionary(dictionary, index),
        )
      : [];

    if (!dictionaries.length) {
      return buildDefaultState();
    }

    const activeId = dictionaries.some(
      (dictionary) => dictionary.id === state.activeId,
    )
      ? state.activeId
      : dictionaries[0].id;

    return { activeId, dictionaries };
  }

  function persistState() {
    if (!cachedState) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState));
      localStorage.setItem(
        LEGACY_WORD_KEYS[0],
        getActiveDictionary(cachedState)?.words || "",
      );
    } catch {
      // If storage is unavailable, keep the in-memory state available for the session.
    }
  }

  function loadState() {
    if (cachedState) return cachedState;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        cachedState = sanitizeState(JSON.parse(raw));
        persistState();
        return cachedState;
      }
    } catch {
      // Fall through to the default state if the stored JSON is invalid.
    }

    cachedState = buildDefaultState();
    persistState();
    return cachedState;
  }

  function getState() {
    return loadState();
  }

  function getDictionaries() {
    return [...getState().dictionaries];
  }

  function getActiveDictionary(currentState = getState()) {
    return (
      currentState.dictionaries.find(
        (dictionary) => dictionary.id === currentState.activeId,
      ) ||
      currentState.dictionaries[0] ||
      null
    );
  }

  function getActiveDictionaryIndex(currentState = getState()) {
    return currentState.dictionaries.findIndex(
      (dictionary) => dictionary.id === currentState.activeId,
    );
  }

  function getActiveWords() {
    return getActiveDictionary()?.words || "";
  }

  function getWordPreviewText(words) {
    const list = String(words || "")
      .split(/\r?\n/)
      .map((word) => word.trim())
      .filter(Boolean);

    if (!list.length) return "No words in this list yet.";

    const preview = list.slice(0, 4).join(" · ");
    return list.length > 4 ? `${preview} · +${list.length - 4} more` : preview;
  }

  function renderSelectOptions() {
    const { select } = boundElements;
    if (!select) return;

    const state = getState();
    const activeDictionary = getActiveDictionary(state);
    select.replaceChildren(
      ...state.dictionaries.map((dictionary) => {
        const option = document.createElement("option");
        option.value = dictionary.id;
        option.textContent = dictionary.name;
        return option;
      }),
    );
    select.value = activeDictionary ? activeDictionary.id : "";
  }

  function syncInputsFromActive() {
    const state = getState();
    const activeDictionary = getActiveDictionary(state);
    if (!activeDictionary) return;

    if (
      boundElements.nameInput &&
      boundElements.nameInput.value !== activeDictionary.name
    ) {
      boundElements.nameInput.value = activeDictionary.name;
    }

    if (
      boundElements.wordsInput &&
      boundElements.wordsInput.value !== activeDictionary.words
    ) {
      boundElements.wordsInput.value = activeDictionary.words;
    }

    if (
      boundElements.select &&
      boundElements.select.value !== activeDictionary.id
    ) {
      boundElements.select.value = activeDictionary.id;
    }
  }

  function updateInfo() {
    const { info } = boundElements;
    if (!info) return;

    const state = getState();
    const activeDictionary = getActiveDictionary(state);
    const activeIndex = getActiveDictionaryIndex(state);
    const total = state.dictionaries.length;
    const wordCount = (activeDictionary?.words || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean).length;

    info.textContent = activeDictionary
      ? `${total} list${total === 1 ? "" : "s"} saved. Editing “${activeDictionary.name}” (${wordCount} word${wordCount === 1 ? "" : "s"}). Changes save automatically.`
      : "No word lists yet. Create one to get started.";

    if (boundElements.deleteBtn) {
      boundElements.deleteBtn.disabled = total <= 1 && !activeDictionary;
    }

    if (boundElements.select && activeIndex >= 0) {
      boundElements.select.title = `Selected list ${activeIndex + 1} of ${total}`;
    }
  }

  function updatePreview() {
    const { preview } = boundElements;
    if (!preview) return;

    const state = getState();
    const activeDictionary = getActiveDictionary(state);
    if (!activeDictionary) {
      preview.textContent = "No list selected.";
      return;
    }

    const wordCount = activeDictionary.words
      .split(/\r?\n/)
      .map((word) => word.trim())
      .filter(Boolean).length;

    preview.textContent = `${wordCount} word${wordCount === 1 ? "" : "s"}: ${getWordPreviewText(activeDictionary.words)}`;
  }

  function applyView() {
    renderSelectOptions();
    syncInputsFromActive();
    updateInfo();
    updatePreview();
  }

  function setActiveDictionary(id) {
    const state = getState();
    if (!state.dictionaries.some((dictionary) => dictionary.id === id))
      return null;
    state.activeId = id;
    persistState();
    applyView();
    return getActiveDictionary(state);
  }

  function updateActiveDictionary(patch = {}) {
    const state = getState();
    const activeDictionary = getActiveDictionary(state);
    if (!activeDictionary) return null;

    if (Object.prototype.hasOwnProperty.call(patch, "name")) {
      activeDictionary.name = normalizeName(patch.name);
    }

    if (Object.prototype.hasOwnProperty.call(patch, "words")) {
      activeDictionary.words = normalizeWords(patch.words);
    }

    activeDictionary.updatedAt = Date.now();
    persistState();
    renderSelectOptions();
    updateInfo();
    return activeDictionary;
  }

  function createNewDictionary(name = DEFAULT_LIST_NAME, words = "") {
    const state = getState();
    const dictionary = createDictionary(name, words);
    state.dictionaries.push(dictionary);
    state.activeId = dictionary.id;
    persistState();
    applyView();
    return dictionary;
  }

  function deleteDictionary(id = getState().activeId) {
    const state = getState();
    if (state.dictionaries.length <= 1) {
      const replacement = createDictionary(DEFAULT_LIST_NAME, "");
      state.dictionaries = [replacement];
      state.activeId = replacement.id;
      persistState();
      applyView();
      return replacement;
    }

    state.dictionaries = state.dictionaries.filter(
      (dictionary) => dictionary.id !== id,
    );
    if (
      !state.dictionaries.some((dictionary) => dictionary.id === state.activeId)
    ) {
      state.activeId = state.dictionaries[0].id;
    }

    persistState();
    applyView();
    return getActiveDictionary(state);
  }

  function setActiveWords(words) {
    return updateActiveDictionary({ words });
  }

  function setActiveName(name) {
    return updateActiveDictionary({ name });
  }

  function initDictionaryManager(elements = {}) {
    boundElements = {
      select:
        elements.dictionarySelect ||
        elements.select ||
        document.getElementById("dictionarySelect"),
      nameInput:
        elements.dictionaryNameInput ||
        elements.nameInput ||
        document.getElementById("dictionaryNameInput"),
      wordsInput:
        elements.wordInput ||
        elements.wordsInput ||
        document.getElementById("wordInput"),
      newBtn:
        elements.newListBtn ||
        elements.newBtn ||
        document.getElementById("newListBtn"),
      deleteBtn:
        elements.deleteListBtn ||
        elements.deleteBtn ||
        document.getElementById("deleteListBtn"),
      info:
        elements.dictionaryInfo ||
        elements.info ||
        document.getElementById("dictionaryInfo"),
      preview:
        elements.dictionaryPreview ||
        elements.preview ||
        document.getElementById("dictionaryPreview"),
    };

    applyView();

    if (boundElements.select) {
      boundElements.select.addEventListener("change", () =>
        setActiveDictionary(boundElements.select.value),
      );
    }

    if (boundElements.nameInput) {
      boundElements.nameInput.addEventListener("input", () =>
        setActiveName(boundElements.nameInput.value),
      );
    }

    if (boundElements.wordsInput) {
      boundElements.wordsInput.addEventListener("input", () =>
        setActiveWords(boundElements.wordsInput.value),
      );
    }

    if (boundElements.newBtn) {
      boundElements.newBtn.addEventListener("click", () =>
        createNewDictionary(),
      );
    }

    if (boundElements.deleteBtn) {
      boundElements.deleteBtn.addEventListener("click", () =>
        deleteDictionary(),
      );
    }

    return api;
  }

  api.STORAGE_KEY = STORAGE_KEY;
  api.getState = getState;
  api.getDictionaries = getDictionaries;
  api.getActiveDictionary = getActiveDictionary;
  api.getActiveWords = getActiveWords;
  api.setActiveDictionary = setActiveDictionary;
  api.setActiveWords = setActiveWords;
  api.setActiveName = setActiveName;
  api.createNewDictionary = createNewDictionary;
  api.deleteDictionary = deleteDictionary;
  api.initDictionaryManager = initDictionaryManager;
})();
