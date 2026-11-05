# Extension Template

A minimal, cross-browser WebExtension starter using Manifest V3 and plain HTML, CSS, and JavaScript. Optional entry points are included as small examples; remove the parts your extension does not use.

## Quick start

1. Edit `manifest.json` and set your extension name, version, and Firefox add-on ID.
2. Open `chrome://extensions` (Chrome/Edge/Brave) or `about:debugging#/runtime/this-firefox` (Firefox).
3. Enable developer mode and load this folder as an unpacked/temporary extension.
4. Add only the permissions and host permissions your extension actually needs.

## Structure

- `background.js` — service worker for events and background tasks.
- `content/` — scripts and styles injected into matching web pages.
- `popup/` — toolbar popup UI.
- `options/` — settings page.
- `newtab/` — optional custom new-tab page.
- `sidepanel/` — optional Chromium side panel.
- `devtools/` — optional DevTools panel.
- `assets/icons/` — extension icons (replace the placeholders with real PNGs).
- `lib/` — place shared or third-party libraries here.
- `locales/` — reserved for `_locales/<locale>/messages.json` translations.

## Browser notes

The manifest uses Manifest V3. Chrome/Chromium generates the extension ID from the signing key; there is no standard top-level manifest `id` field. Firefox uses `browser_specific_settings.gecko.id`, which is provided as a placeholder and should be changed to a unique ID before publishing. APIs and optional features can differ by browser; check compatibility before enabling them.

## Permissions

The starter requests no broad host access. Add permissions such as `storage`, `tabs`, `scripting`, or `contextMenus` only when needed. Add site access under `host_permissions` (or `optional_host_permissions`) and explain why it is needed.

## Packaging

Load this directory directly for development. For distribution, package the extension files with `manifest.json` at the archive root. Do not include development-only files such as `.git/` or `node_modules/`.
