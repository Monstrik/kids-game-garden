# Robo Saves the Cookies

A tiny spelling game for kids built with plain HTML, CSS, and JavaScript.

## Files

- `index.html` — root game hub
- `client/robo/index.html` — Robo Saves the Cookies game
- `client/css/style.css` — shared global styles for the hub and games
- `client/js/constants.js` — shared game text and configuration
- `client/js/state.js` — DOM references and mutable game state
- `client/js/theme.js` — shared global dark mode toggle and persistence
- `client/js/hub.js` — root hub bootstrap
- `client/js/utils.js` — helper functions, storage, audio, and screen switching
- `client/js/ui.js` — rendering and visual updates
- `client/js/game.js` — game flow and word/answer logic
- `client/js/main.js` — bootstrap file that wires events and starts the game
- `server.js` — local static server that opens the hub in your browser

## Run locally

```bash
cd /Users/ayakovis/dev/games/spell
npm start
```

Open `http://127.0.0.1:3000/` in your browser for the hub, or `http://127.0.0.1:3000/robo/` for the game.

## Easy to improve

- Edit the word list behavior in `client/js/game.js`
- Tweak colors, layout, and animations in `client/robo/index.html` or `index.html`
- Add or remove UI sections in `client/robo/index.html`

## Folder pattern for new games

Create each new game in its own subfolder under `client/`, for example:

- `client/space-runner/index.html`
- `client/space-runner/js/...`

