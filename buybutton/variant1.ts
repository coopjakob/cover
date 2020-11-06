function labelButtons() {
  console.debug('<experiment> Label buttons');
  document
    .querySelectorAll('.js-buttonView:not(.ProductSearch-itemCta)')
    .forEach((element) => {
      if (!element.querySelector('.js-input').classList.contains('has-value')) {
        element.querySelectorAll('.js-kop').forEach((element) => {
          element.classList.remove('u-hidden');
        });
        element.querySelectorAll('.js-buttonContainer').forEach((element) => {
          element.classList.add('u-hidden');
        });
      }
    });
}

labelButtons();

document.querySelectorAll('.js-subtract').forEach((element) => {
  element.addEventListener('click', () => {
    window.setTimeout(labelButtons, 1000);
  });
});

window.addEventListener('resize', () => {
  window.setTimeout(labelButtons, 1000);
});
