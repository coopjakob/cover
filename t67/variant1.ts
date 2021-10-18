let button = document.querySelector(
  '[data-test="cncheader-chagedeliverymethodbutton"]'
);

if (button) {
  button.classList.add('u-hidden');
}

document.addEventListener('cover.ready T67', (event) => {
  event.target.classList.add('u-hidden');
});
