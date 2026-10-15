# Kids Game Garden

A tiny game hub for kids built with plain HTML, CSS, and JavaScript.

## Project docs

- `DEVELOPMENT.md` — AI-friendly rules for editing and extending the codebase
- `README.md` — quick project overview and local run instructions

## Files

- `index.html` — root game hub
- `client/shared/css/shared.css` — small shared styles used by the hub and games
- `client/shared/css/game-shell.css` — shared page layout styles used by the hub and Robo game
- `client/shared/js/theme.js` — shared theme toggle and persistence
- `client/games/robo/index.html` — Robo's Spelling Adventure game
- `client/games/robo/js/` — Robo-specific logic split into small files
- `client/games/robo-hero/index.html` — Robo Spelling Hero typing game
- `client/games/robo-hero/js/` — Robo Spelling Hero-specific logic split into small files
- `client/css/style.css` — hub-specific CSS variables that import the shared game shell
- `client/js/hub.js` — hub bootstrap that initializes theme toggling
- `server.js` — local static server that opens the hub in your browser

## Run locally

```bash
cd /Users/ayakovis/dev/playground/kids-game-garden
npm start
```

Open `http://127.0.0.1:3000/` in your browser for the hub, `http://127.0.0.1:3000/games/robo/` for Robo's Spelling Adventure, or `http://127.0.0.1:3000/games/robo-hero/` for Robo Spelling Hero.

## Easy to improve

- Edit the word list behavior in `client/games/robo/js/game.js`
- Tweak colors, layout, and animations in `client/games/robo/index.html` or `index.html`
- Add or remove UI sections in `client/games/robo/index.html`
- Follow the editing rules in `DEVELOPMENT.md` before making larger changes

## Folder pattern for new games

Create each new game in its own subfolder under `client/games/`, for example:

- `client/games/space-runner/index.html`
- `client/games/space-runner/js/...`

Shared utilities and styles should live under `client/shared/`.
