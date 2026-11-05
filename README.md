# ULTRA-CONSOLE

A lightweight, powerful in-page developer console for Chromium and Firefox. Built as a Manifest V3 WebExtension with plain JavaScript and no runtime dependencies.

## Features

- **Console:** captures log/info/warn/error/debug/table/dir/trace, uncaught errors and unhandled promise rejections; execute JavaScript in the page context; filter, clear and export logs.
- **Network:** observes Fetch and XMLHttpRequest traffic, status, duration, request metadata, text response previews and manual Fetch request replay (with confirmation for non-GET/HEAD methods).
- **Elements:** live DOM tree (up to 350 nodes), element details, computed-style summary, and in-page editing for text, class, ID and inline CSS; selected elements can also be removed.
- **Storage:** inspect LocalStorage, SessionStorage, document cookies and read-only IndexedDB database/object-store previews (first 25 records per store).
- **Performance:** navigation timing, resource count and JS heap usage where supported.
- **Sources:** list page script URLs and inline scripts.
- Floating launcher, isolated Shadow DOM UI, dark theme, responsive layout and Alt+Shift+D shortcut.

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` (Chrome/Edge/Brave) or `about:debugging#/runtime/this-firefox` (Firefox).
3. Enable Developer mode / Load Temporary Add-on.
4. Select this folder (or its `manifest.json` in Firefox).
5. Visit a page and click **✳ ULTRA** in the lower-right corner. Shortcut: **Alt+Shift+D**.

## Security and limitations

JavaScript evaluation runs in the inspected page's main world and has the page's privileges. Treat commands like DevTools. Network instrumentation observes requests initiated after injection; it cannot recover earlier traffic. Text response previews are capped at 20 KB. Replaying a request sends a new real request with the current page's credentials where permitted; replaying state-changing requests can repeat actions or submit data. Cross-origin response visibility remains subject to browser CORS rules. Storage inspection is limited to the current origin and browser cookie visibility.

The MAIN-world instrumentation is registered as a content script rather than injected through a page script tag, avoiding common page-CSP injection blocks. Chromium 111+ and Firefox 128+ are required for MAIN-world content scripts. The extension uses broad site access because inspecting arbitrary pages is its core purpose. Review permissions before installing. Do not use it on pages you do not trust.

## Development

No bundler is required. Run `npm run check` with Node.js to syntax-check JavaScript files. Reload the unpacked extension after edits.

## Roadmap

Request replay/blocking, IndexedDB inspection, plugin API, command autocomplete, persistent workspaces, richer source inspection and a deeper computed-style editor.

## License

MIT