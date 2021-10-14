let button = document.querySelector(
  '[data-test="cncheader-chagedeliverymethodbutton"]'
);

if (button) {
  button.classList.add('u-hidden');
} else {
  console.debug('<experiment> No button available');
}

document.addEventListener('cover.ready T67', (event) => {
  console.debug('<experiment> Using event listener', event);
  event.target.classList.add('u-hidden');
});
