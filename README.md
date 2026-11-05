# ULTRA-CONSOLE

Advanced browser developer tools with a dedicated DevTools panel and a floating in-page console.

## Features
- Console: evaluate JavaScript in the inspected page, filter by level, command history, preserve logs and export.
- Elements: browse a DOM outline, query with CSS selectors, inspect node metadata and use the Elements sidebar.
- Network: inspect browser HAR requests, filter, view headers, query parameters, timing and response bodies, export HAR.
- Storage: inspect and edit Local and Session Storage; list IndexedDB databases and Cache Storage.
- Performance: navigation timing, resource breakdown and largest resources.
- Sources: browse external and inline scripts and stylesheets.
- Cookies: inspect cookies exposed to document.cookie.
- Audits: accessibility checks, SEO metadata, viewport diagnostics and link export.
- In-page console: floating Shadow DOM console with runtime logging and Fetch/XHR observation.

## Install
1. Open chrome://extensions (Chromium) or about:debugging#/runtime/this-firefox (Firefox).
2. Enable Developer mode or Load Temporary Add-on.
3. Load this repository folder or select manifest.json.
4. Open a website, open browser DevTools and choose the ULTRA panel.
5. Or use the floating ULTRA button; toggle with Alt+Shift+D.

## Development
No build step or runtime dependency is required. Run npm run check with Node.js, then reload the unpacked extension.

## Permissions and limitations
Broad site access is required to inspect arbitrary pages. JavaScript evaluation has the inspected page's privileges; only run code you trust. Network data comes from the browser HAR API and may omit requests made before DevTools opened; reload to capture a complete session. Response bodies are retrieved on demand. Cookies are limited to those exposed to document.cookie; HttpOnly cookies are not readable. IndexedDB and Cache Storage enumeration depends on browser support. Browser security boundaries remain in force.

## License
MIT