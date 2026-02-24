# Chess Playback

Static site deployed to GitHub Pages that replays chess games using PGN files with clock data.

## Development

- `bin/dev` — starts Jekyll and esbuild in watch mode via run-pty
- `npm run build` — bundle JS with esbuild

## Stack

- **SSG**: Jekyll (Ruby)
- **JS bundling**: esbuild
- **JS entry point**: `src/application.js` → `assets/application.js`
