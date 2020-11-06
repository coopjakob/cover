function labelButtons() {
  console.debug('<experiment> Label buttons');
  document.querySelectorAll('.js-buttonView:not(.ProductSearch-itemCta)').forEach(function (element) {
    if (!element.querySelector('.js-input').classList.contains('has-value')) {
      element.querySelectorAll('.js-kop').forEach(function (element) {
        element.classList.remove('u-hidden');
        element.style.textOverflow = 'unset';
        element.textContent = 'Lägg till';
      });
      element.querySelectorAll('.js-buttonContainer').forEach(function (element) {
        element.classList.add('u-hidden');
      });
    }
  });
}

labelButtons();
document.querySelectorAll('.js-subtract').forEach(function (element) {
  element.addEventListener('click', function () {
    window.setTimeout(labelButtons, 1000);
  });
});
window.addEventListener('resize', function () {
  window.setTimeout(labelButtons, 1000);
});