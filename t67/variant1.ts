let button = document.querySelector(
  '[data-test="cncheader-chagedeliverymethodbutton"]'
);

if (button) {
  button.classList.add('u-hidden');
}

document.addEventListener('cover.ready T67', (event) => {
  const element = event.target as HTMLElement;
  element.classList.add('u-hidden');
});
