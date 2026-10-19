# Development Guide

This project is intentionally small and easy to edit. Keep changes simple, local, and easy to review.

## Basic rules

- Prefer plain HTML, CSS, and JavaScript.
- Keep the code split into small, focused files.
- Reuse the shared modules in `shared/js/` instead of duplicating logic.
- Keep shared styles in `shared/css/` and page-specific styles next to each game.
- Keep paths relative and verify them after moving files.
- Avoid introducing build tools unless they are clearly needed.
- Preserve the kid-friendly tone, layout, and accessibility.

## Editing guidelines

- Make the smallest change that solves the task.
- Avoid large rewrites unless the user asks for a refactor.
- Keep file names and folder structure consistent.
- Prefer readable code over clever code.
- Add comments only where they help future edits.
- Do not remove working behavior unless replacing it with an equivalent or better version.

## AI-friendly workflow

When updating the project, follow this order:

1. Read the relevant files first.
2. Trace shared logic before editing it.
3. Update one file at a time when possible.
4. Verify the change in the browser or with local checks.
5. Update the README if the project structure or workflow changes.

## Good places to extend

- Add new games under `games/<game-name>/`
- Add shared helpers in `shared/js/`
- Add shared styles in `shared/css/`
- Add docs here if the project grows

## Suggested standards for future changes

- Keep functions short and single-purpose.
- Use clear names for variables, functions, and files.
- Keep UI updates separate from game logic when practical.
- Make sure new features work well on mobile.
- Test the hub and the game page after layout or route changes.
