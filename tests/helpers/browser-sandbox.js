const vm = require("node:vm");
const fs = require("node:fs");

function createElement(id = "") {
  return {
    id,
    textContent: "",
    innerHTML: "",
    hidden: false,
    disabled: false,
    value: "",
    dataset: {},
    style: {
      width: "",
      setProperty() {},
    },
    classList: {
      add() {},
      remove() {},
      toggle() {},
    },
    setAttribute() {},
    addEventListener() {},
    appendChild() {},
    remove() {},
    focus() {},
  };
}

function createSandbox({ elementIds = [] } = {}) {
  const elements = new Map();
  for (const id of elementIds) {
    elements.set(id, createElement(id));
  }

  const localStore = new Map();
  const localStorage = {
    getItem(key) {
      return localStore.has(key) ? localStore.get(key) : null;
    },
    setItem(key, value) {
      localStore.set(key, String(value));
    },
  };

  const document = {
    getElementById(id) {
      return elements.get(id) || null;
    },
    createElement(tag) {
      return createElement(tag);
    },
    documentElement: { dataset: {} },
    body: {
      appendChild() {},
    },
  };

  const window = {
    document,
    localStorage,
    location: { href: "http://localhost/games/robo/" },
    matchMedia() {
      return { matches: false };
    },
    speechSynthesis: {
      cancel() {},
      speak() {},
    },
    GameTheme: {
      initTheme() {},
      getPreferredTheme() {
        return "light";
      },
      saveTheme() {},
      applyTheme() {},
    },
  };

  window.window = window;

  const context = vm.createContext({
    window,
    document,
    localStorage,
    URL,
    console,
    Math,
    setTimeout,
    clearTimeout,
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(text) {
      this.text = text;
    },
  });

  return { context, window, document, localStorage, elements, localStore };
}

function loadScriptIntoContext(context, filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  vm.runInContext(source, context, { filename: filePath });
}

module.exports = {
  createSandbox,
  loadScriptIntoContext,
};
