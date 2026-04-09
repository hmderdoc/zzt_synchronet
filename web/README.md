# ZZT Web Sound Bridge Pack

This folder packages the web-side bridge required for ZZT sound in a browser/fTelnet terminal.

The ZZT door itself already runs without this pack.  
Without web bridge support, sound is safely silent/no-op.

## What This Adds

- FLWEB APC bridge parsing in the terminal iframe (`FLWEB/1 ...`).
- Terminal UI message routing to `FLWeb.handleTerminalUi(...)`.
- Browser-side `audio.zzt.note`, `audio.zzt.drum`, `audio.zzt.stop` playback handlers.
- Browser-side `audio.play` support through `flweb-assets.ssjs` for bundled world MP3 files.

## Included Files

- `files/root/terminal-iframe.html`
- `files/root/js/terminal.js`
- `files/root/js/flweb.js`
- `files/root/api/flweb-assets.ssjs`
- `install-web-bridge.sh`

## Quick Install

```bash
cd /sbbs/xtrn/zzt/web
./install-web-bridge.sh /sbbs/webv4
```

If no path is provided, the installer defaults to `/sbbs/webv4`.
You can pass any compatible web root path (for example a custom deployment directory).

The installer creates timestamped backups under:

- `<target>/.zzt-web-backup/<timestamp>/...`

## Manual Install

Copy these files from this pack into your web root:

- `files/root/terminal-iframe.html` -> `<target>/root/terminal-iframe.html`
- `files/root/js/terminal.js` -> `<target>/root/js/terminal.js`
- `files/root/js/flweb.js` -> `<target>/root/js/flweb.js`
- `files/root/api/flweb-assets.ssjs` -> `<target>/root/api/flweb-assets.ssjs`

## Required Environment

- A Synchronet web terminal using fTelnet iframe flow.
- Terminal page must load/use the above `terminal.js` and `terminal-iframe.html`.
- Browser must allow audio after user interaction (normal autoplay policy behavior).

## Config Values

Set/verify these values in your web deployment:

- `modopts.ini` (`[web]`): `web_directory` points at the web root you are patching.
  Example: `web_directory=../webv4`
- Your web shell loads `root/js/terminal.js` and `root/js/flweb.js`.
- The terminal iframe source resolves to `root/terminal-iframe.html`.
- `root/api/flweb-assets.ssjs` is present and executable.

## Verification

1. Open web terminal and run `EXPERIMENT3` (if installed).
2. Press `B` in Experiment3 for bridge detect and confirm detected.
3. Run `ZZT`.
4. Trigger sound events (fire, pickups, doors, bombs, etc.) and verify audible output.
5. Load a world pack that includes MP3 files in its folder and verify background music playback.

## Notes

- This pack is layout-generic and not tied to a specific internal naming scheme.
- Stock `/sbbs/webv4` does not include this bridge path by default.
- Non-web clients (telnet/ssh) continue to work; sound remains silent there.
