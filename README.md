# Chess Playback

Static site deployed to GitHub Pages that replays chess games using PGN files with clock data.

- Production: https://maxjacobson.github.io/chess-playback/
- Development: http://127.0.0.1:4000/chess-playback/

## Development

- `bin/dev` — starts Jekyll and esbuild in watch mode via run-pty
- `npm run build` — bundle JS with esbuild

## Stack

- **SSG**: Jekyll (Ruby)
- **JS bundling**: esbuild
- **JS entry point**: `src/application.js` → `assets/application.js`

## Changelog

- Load PGN from a file input instead of hardcoding it
- Load PGN from a query string parameter, with a share button to copy the URL
- Clicking the header navigates back to the start, discarding query state
- Material imbalance display (captured pieces + value differential) shown between each clock and the board
- Favicon and OG preview image

## Roadmap

- Bookmarklet for launching playback from chess sites
- Sound effects for move, capture, castle, check, and checkmate
- Update the homepage to explain what this is for and why one might be interested in using it
- buttons for "pause/resume", "next/previous" (when paused), "first/last" to jump to beginning or end of game (when
  paused)

## Acknowledgments

Inspired by [chess-replay](https://chess-replay.joren.co/).
