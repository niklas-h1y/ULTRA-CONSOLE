const button = document.querySelector("#example-button");
const status = document.querySelector("#status");

button?.addEventListener("click", () => {
  status.textContent = "Button clicked.";
});
