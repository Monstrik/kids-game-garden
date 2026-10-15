# Robo Saves the Cookies

A tiny spelling game for kids built with plain HTML, CSS, and JavaScript.

## Files

- `index.html` — game structure and page layout
- `client/css/style.css` — all styling and animations
- `client/js/constants.js` — shared game text and configuration
- `client/js/state.js` — DOM references and mutable game state
- `client/js/utils.js` — helper functions, storage, audio, and screen switching
- `client/js/ui.js` — rendering and visual updates
- `client/js/game.js` — game flow and word/answer logic
- `client/js/main.js` — bootstrap file that wires events and starts the game
- `server.js` — local static server that opens the game in your browser

## Run locally

```bash
cd /Users/ayakovis/dev/games/spell
npm start
```

Or open `index.html` directly in your browser.

## Easy to improve

- Edit the word list behavior in `client/js/game.js`
- Tweak colors, layout, and animations in `client/css/style.css`
- Add or remove UI sections in `index.html`

