function addButtonLabels() {
  document.querySelectorAll('.ItemTeaser-button .Button').forEach(function (element) {
    if (element.parentElement.querySelector('input').value == 0) {
      element.classList.remove('u-hidden');
      element.parentElement.querySelector('.AddToCart').classList.add('u-hidden');
      element.style.textOverflow = 'unset';
      element.style.paddingLeft = 0;
      element.style.paddingRight = 0;
      element.textContent = 'Lägg till';
    } else {
      element.classList.add('u-hidden');
      element.parentElement.querySelector('.AddToCart').classList.remove('u-hidden');
    }
  });
  document.querySelectorAll('.ProductSearch-itemCta .Button').forEach(function (element) {
    if (element.parentElement.querySelector('input').value == 0) {
      element.classList.remove('u-hidden');
      element.parentElement.querySelector('.AddToCart').classList.add('u-hidden');
      element.style.textOverflow = 'unset';
      element.style.paddingLeft = 0;
      element.style.paddingRight = 0;
      element.style.width = '120px';
      element.textContent = 'Lägg till';
    }
  });
}

addButtonLabels();
window.addEventListener('ga:productImpression', addButtonLabels);
window.addEventListener('ga:modifyCart', addButtonLabels);
var setLabelAfterTimeout;
window.addEventListener('resize', function () {
  clearTimeout(setLabelAfterTimeout);
  setLabelAfterTimeout = setTimeout(addButtonLabels, 200);
});