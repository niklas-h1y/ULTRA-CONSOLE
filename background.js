// ULTRA-CONSOLE Manifest V3 service worker.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") console.info("ULTRA-CONSOLE installed.");
  if (details.reason === "update") console.info("ULTRA-CONSOLE updated.");
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "ULTRA_PING") sendResponse({ok:true,name:"ULTRA-CONSOLE"});
});