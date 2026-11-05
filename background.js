// Manifest V3 background service worker.
// Runs only when the browser needs it; do not rely on global state persisting.

chrome.runtime.onInstalled.addListener(() => {
  console.info("Extension Template installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // TODO: Handle messages from popup, options, or content scripts.
  if (message?.type === "PING") {
    sendResponse({ ok: true });
  }
});
