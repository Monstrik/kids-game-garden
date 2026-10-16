# Kids Game Garden

A tiny game hub for kids built with plain HTML, CSS, and JavaScript.

## Project docs

- `DEVELOPMENT.md` — AI-friendly rules for editing and extending the codebase
- `README.md` — quick project overview and local run instructions

## Files

- `index.html` — root game hub
- `shared/css/shared.css` — small shared styles used by the hub and games
- `shared/css/game-shell.css` — shared page layout styles used by the hub and games
- `shared/js/theme.js` — shared theme toggle and persistence
- `shared/js/game-common.js` — shared helpers used by every game
- `shared/js/dictionaries.js` — shared dictionary manager used by the games and manager page
- `games/robo/index.html` — Robo's Spelling Adventure game
- `games/robo/js/` — Robo-specific logic split into small files
- `games/robo-hero/index.html` — Robo Spelling Hero typing game
- `games/robo-hero/js/` — Robo Spelling Hero-specific logic split into small files
- `games/spell-match/index.html` — Robo Spell Match multiple-choice spelling game
- `games/spell-match/js/` — Robo Spell Match-specific logic split into small files
- `css/style.css` — hub-specific CSS variables that import the shared game shell
- `js/hub.js` — hub bootstrap that initializes theme toggling
- `games/dictionary-manager/index.html` — standalone dictionary manager page
- `server.js` — local static server that opens the hub in your browser

## Run locally

```bash
cd /Users/ayakovis/dev/playground/kids-game-garden
npm start
```

Open `http://127.0.0.1:3000/` in your browser for the hub, `http://127.0.0.1:3000/games/robo/` for Robo's Spelling Adventure, `http://127.0.0.1:3000/games/robo-hero/` for Robo Spelling Hero, or `http://127.0.0.1:3000/games/spell-match/` for Robo Spell Match.

For GitHub Pages, publish the repository root and use the same `games/.../` routes from the hub.

## Easy to improve

- Edit the word list behavior in `games/robo/js/game.js`
- Tweak colors, layout, and animations in `games/robo/index.html` or `index.html`
- Add or remove UI sections in `games/robo/index.html`
- Follow the editing rules in `DEVELOPMENT.md` before making larger changes

## Folder pattern for new games

Create each new game in its own subfolder under `games/`, for example:

- `games/space-runner/index.html`
- `games/space-runner/js/...`

Shared utilities and styles should live under `shared/`.
