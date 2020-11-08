function labelButtons() {
  console.debug('<experiment> Label buttons');
  document.querySelectorAll('.js-buttonView:not(.ProductSearch-itemCta)').forEach(function (element) {
    if (!element.querySelector('.js-input').classList.contains('has-value')) {
      element.querySelectorAll('.js-kop').forEach(function (element) {
        element.classList.remove('u-hidden');
        element.style.textOverflow = 'unset';
        element.style.paddingLeft = 0;
        element.style.paddingRight = 0;
        element.textContent = 'Lägg till';
      });
      element.querySelectorAll('.js-buttonContainer').forEach(function (element) {
        element.classList.add('u-hidden');
      });
    }
  });
}

labelButtons();
window.addEventListener('ga:modifyCart', labelButtons);
window.addEventListener('resize', labelButtons);
window.addEventListener('ga:productImpression', labelButtons);