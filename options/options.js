const setting = document.querySelector("#example-setting");
const status = document.querySelector("#save-status");

chrome.storage.local.get({ exampleSetting: false }, (values) => {
  setting.checked = values.exampleSetting;
});

setting.addEventListener("change", () => {
  chrome.storage.local.set({ exampleSetting: setting.checked }, () => {
    status.textContent = "Settings saved.";
  });
});
