# ZZT Synchronet TypeScript Port

This directory is the new TypeScript-based Synchronet JavaScript port target for the Pascal sources in `reconstruction-of-zzt-master/SRC`.

## Layout

- `src/`: TypeScript source files for the port.
- `build.js`: Build runner that locates a local TypeScript compiler.
- `tsconfig.json`: Compiles all `src/*.ts` files into one SpiderMonkey-friendly script.
- `zzt.js`: Generated runtime script for Synchronet.
- `zzt_files/`: Preferred drop-in location for external `.ZZT` worlds (supports one subdirectory level for packs).

## Build

```bash
cd /sbbs/xtrn/zzt
nodejs build.js
```

The build emits:

- `/sbbs/xtrn/zzt/zzt.js` <--- This is the door game.

## External Worlds

The world picker (`W`) now prefers `zzt_files/`:

- `/sbbs/xtrn/zzt/zzt_files/*.ZZT`
- `/sbbs/xtrn/zzt/zzt_files/*/*.ZZT`
- `/sbbs/xtrn/zzt_files/*.ZZT`
- `/sbbs/xtrn/zzt_files/*/*.ZZT`

This allows keeping pack companion files (for example `.TXT` and `.HI`) with each world in a subdirectory.
If a world directory includes `.mp3` files, the web bridge can also use them for background music in browser clients.

World/save file discovery is now extension-case-insensitive (for example `.zzt`, `.ZZT`, `.sav`, `.SAV`).

### Where Sysops Can Get Worlds

No built-in downloader is included. Sysops manually place files from world archives.

Common sources:

- mega-archive off my bbs: https://futureland.today/api/files.ssjs?call=download-file&dir=games&file=ZZT_ARCHIVE.zip

- Museum of ZZT (archive + mass downloads): `https://museumofzzt.com/file/mass-downloads/`
- z2 (community portal; links to archives): `https://zzt.org/`
- Internet Archive DOS ZZT software library: `https://archive.org/details/softwarelibrary_msdos_zzt`

Placement examples:

- Single world file:
  - `/sbbs/xtrn/zzt_files/someworld.zzt`
- World pack directory (recommended when `.TXT`, `.HI`, `.MP3` companion files exist):
  - `/sbbs/xtrn/zzt/zzt_files/ana/ana.zzt`
  - `/sbbs/xtrn/zzt/zzt_files/ana/*.txt|*.hi|*.mp3`

The picker scans both:

- `/sbbs/xtrn/zzt/zzt_files/...`
- `/sbbs/xtrn/zzt_files/...`

Save files are now user-scoped by default to avoid collisions between BBS users:

- `/sbbs/xtrn/zzt/zzt_files/saves/<user-key>/*.SAV`

Legacy save locations are still scanned for compatibility.

## High Scores (InterBBS JSON)

High scores are now stored in a shared JSON service file keyed by world filename (`.zzt` id/path), with player and BBS identity:

- default: `/sbbs/xtrn/zzt/data/highscores.json`

Display lines now use `username @ bbs-name` instead of `-- You! --`.

Classic world `.HI` files are still read as fallback and written as compatibility mirrors.

### Optional `ZZT.INI` Overrides

Create `/sbbs/xtrn/zzt/ZZT.INI` (or `zzt.ini`) to override defaults:

```ini
HIGH_SCORE_JSON=/path/to/shared/highscores.json
HIGH_SCORE_BBS=My BBS Name
SAVE_ROOT=/path/to/save/root
```

`HIGH_SCORE_JSON` can point to a shared path for inter-BBS score syncing.

## Help Resource Data (`ZZT.DAT`)

Text-window help loading now supports the original packed resource table format used by DOS ZZT.

By default the port looks for:

- `/sbbs/xtrn/zzt/ZZT.DAT`
- fallback: `ZZT.DAT` in the current working path

If no packed resource file is present, help falls back to plain `.HLP` text files as before.

Help-file fallback now searches:

- `/sbbs/xtrn/zzt/<name>.hlp|.HLP`
- `/sbbs/xtrn/zzt/DOCS/<name>.hlp|.HLP`
- `/sbbs/xtrn/zzt/docs/<name>.hlp|.HLP`

The unregistered shutdown message (`END1.MSG` .. `END4.MSG`) is also read from packed `ZZT.DAT` entries when available.

## Current Port Status

- `ZZT.PAS` startup/bootstrap flow is translated into `src/zzt.ts`.
- Core game state from `GAMEVARS.PAS` is represented with typed structures in `src/gamevars.ts`.
- `GAME.PAS` core loops/state are ported in `src/game.ts`, including board/world serialization (`WorldLoad`/`WorldSave`), title/play loop control, board transitions, and sidebar/UI updates.
- `ELEMENTS.PAS` element behavior is ported in `src/elements.ts` for core gameplay tick/touch/draw flows.
- `OOP.PAS` is ported in `src/oop.ts` (including `#PLAY` command parsing/execution).
- `INPUT.PAS`/`KEYS.PAS` behavior is represented in `src/input.ts` with Synchronet key decoding and control-state handling.
- `VIDEO.PAS` and `TXTWIND.PAS` behavior is represented in `src/video.ts` and `src/txtwind.ts`.
- Title-screen debug prompt (`|`) is now functional (`HEALTH`, `AMMO`, `KEYS`, `TORCHES`, `TIME`, `GEMS`, `DARK`, `ZAP`, and flag toggles with `+/-`).
- Title-screen `E` opens a functional editor loop with non-blocking input handling, cursor blink/update timing, Space/Shift paint-or-erase behavior, `F1/F2/F3` category menus, `F4` text-entry mode, `X` flood fill, `!` help-file editing, `T` board transfer (import/export `.BRD`), and Enter-driven stat parameter/program editing (including slider/choice/direction/character widgets).
- Board switching (`B`) and board info (`I`) now use text-window driven selection/edit flows (max shots, darkness, neighbors, re-enter flag, time limit) closer to Pascal behavior.
- Editor sidebar visuals are now closer to Pascal layout (pattern/color bars, active pointers, color name, copied-tile preview).
- Sound runtime supports ZZT note/drum playback via the FLWEB bridge.
- Optional world-pack `.mp3` files are detected and staged for web playback from `mods/flweb/assets/zzt_worlds/...` when available.
- Remaining work is parity refinement (behavior/timing/UI edge cases), not first-pass unit bring-up.
