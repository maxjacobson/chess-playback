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

## Roadmap

- Material imbalance indicator (e.g. "+5" next to a player's clock when up a rook)
- Load PGN from a query string parameter
- Bookmarklet for launching playback from chess sites
- Sound effects for move, capture, castle, check, and checkmate
- Update the homepage to explain what this is for and why one might be interested in using it

## Acknowledgments

Inspired by [chess-replay](https://chess-replay.joren.co/).
