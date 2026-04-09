# ZZT Web Sound Bridge Pack

This folder contains a drop-in web bridge for ZZT sound on Synchronet web terminals.

The ZZT door works without this pack.  
Without this bridge, sound calls are ignored (silent/no-op).

## What "fTelnet iframe flow" Means

In this context, it means:

1. `root/js/terminal.js` controls terminal UI in the parent page.
2. `root/terminal-iframe.html` hosts the fTelnet client.
3. The iframe captures FLWEB APC packets (`ESC _ FLWEB/1 ... ESC \`) from terminal output.
4. Packets are sent to parent as `postMessage(type: "terminal-ui")`.
5. Parent calls `FLWeb.handleTerminalUi(...)` in `root/js/flweb.js`.
6. `root/api/flweb-assets.ssjs` resolves shared/xtrn audio assets for browser playback.

## Included Files

- `files/root/terminal-iframe.html`
- `files/root/js/terminal.js`
- `files/root/js/flweb.js`
- `files/root/api/flweb-assets.ssjs`
- `install-web-bridge.sh`

## Install Into Stock `webv4` (Swap-In)

This is the intended path for a typical sysop install.

```bash
cd /sbbs/xtrn/zzt/web
./install-web-bridge.sh /sbbs/webv4
```

- If no path is passed, installer defaults to `/sbbs/webv4`.
- Backups are written to: `<target>/.zzt-web-backup/<timestamp>/...`

### What Gets Replaced

- `<target>/root/terminal-iframe.html`
- `<target>/root/js/terminal.js`
- `<target>/root/js/flweb.js`
- `<target>/root/api/flweb-assets.ssjs`

The packaged `terminal-iframe.html` includes additional behavior (touch handlers, responsive row/column sizing, render-speed patches, audio-unlock hooks). These are bundled with the bridge swap by design.

## Do I Need To Build An Iframe By Hand?

For stock `webv4`: no.

After swap-in, `root/js/terminal.js` creates the iframe automatically and sets:

- `iframe.src = './terminal-iframe.html'`

Sysops do not need to write iframe code for the normal install path.

## If You Use A Custom Web Shell

If your shell is not stock `webv4`, keep these required IDs so `terminal.js` can wire itself:

```html
<div id="terminal-panel" class="is-hidden">
  <div id="terminal-iframe-container"></div>
</div>
<button id="btn-terminal" type="button">Terminal</button>
```

And ensure these scripts are loaded by your page:

```html
<script src="./js/flweb.js"></script>
<script src="./js/terminal.js"></script>
```

## Manual Install

Copy from this pack:

- `files/root/terminal-iframe.html` -> `<target>/root/terminal-iframe.html`
- `files/root/js/terminal.js` -> `<target>/root/js/terminal.js`
- `files/root/js/flweb.js` -> `<target>/root/js/flweb.js`
- `files/root/api/flweb-assets.ssjs` -> `<target>/root/api/flweb-assets.ssjs`

## Config Checklist

- `modopts.ini` (`[web]`) points to the patched root (example: `web_directory=../webv4`).
- Web shell loads `root/js/terminal.js` and `root/js/flweb.js`.
- Terminal iframe source resolves to `root/terminal-iframe.html`.
- `root/api/flweb-assets.ssjs` is present/executable.
- Browser audio requires at least one user interaction (normal autoplay policy).

## Verification

1. Open web terminal and run `EXPERIMENT3` from `experiment3.js` (if installed as xtrn).
2. Press `B` in Experiment3 and confirm bridge detect success.
3. Run `ZZT`.
4. Trigger sound effects (fire, pickups, doors, bombs).
5. Load a world pack with MP3s and confirm background music playback.

## Rollback

Restore files from `<target>/.zzt-web-backup/<timestamp>/...` if you want to revert to the previous terminal stack.

## Notes

- Stock `/sbbs/webv4` does not include this FLWEB bridge path by default.
- Non-web clients (telnet/ssh) continue to function; they just remain silent.
