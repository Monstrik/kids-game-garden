module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
  },
  globals: {
    GameTheme: "readonly",
    GameDictionaries: "readonly",
  },
  ignorePatterns: ["node_modules/"],
  rules: {
    "no-console": "off",
  },
};

