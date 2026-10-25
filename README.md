# Para'r Pagla — Desi Chaos (Prototype 0.1)

A free, original browser-game prototype combining:
- Para'r Pagla neighbourhood chaos
- Rickshaw Rush
- Last Bench Legends
- Biye Bari Gone Wrong
- Chagol Simulator

## Run locally
Because this uses JavaScript ES modules, run it from a local web server (not by double-clicking `index.html`).

### Easiest
Use VS Code and install the free **Live Server** extension, then right-click `index.html` → **Open with Live Server**.

### Python alternative
If Python is installed:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Controls
- PC: WASD / arrow keys to move, Shift to run, E to interact.
- Camera: drag the mouse across the game.
- Phone: use on-screen direction buttons and DO IT!.

## GitHub Pages deployment
1. Create a new, separate repository, e.g. `parar-pagla-game` (do not use the Minecraft repo).
2. Upload `index.html`, `css/`, and `js/` to the repository root.
3. Repository Settings → Pages → Deploy from a branch → `main` / root.
4. Wait for GitHub Pages to publish the site.

## Notes
- The game uses Three.js from jsDelivr and Google Fonts, so internet is required when loading the prototype.
- This is an early prototype: missions are interaction-based, NPCs are simple placeholders, and multiplayer, vehicle driving physics, school/wedding minigames, save data, and full mobile optimization are not implemented yet.
- Built with original generic characters and dialogue; add only audio/assets you have permission to use.
