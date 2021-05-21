function addButtonLabels() {
  document.querySelectorAll('.ItemTeaser-button > button.Button, .ProductSearch-itemCta .ProductSearch-itemCell > button.Button, .ItemInfo-button > button.Button').forEach(function (element) {
    var isItemTeaser = element.parentElement.classList.contains('ItemTeaser-button');
    var isItemInfo = element.parentElement.classList.contains('ItemInfo-button');

    if (element.parentElement.querySelector('input').value === '0') {
      element.classList.remove('u-hidden');
      element.parentElement.querySelector('.AddToCart').classList.add('u-hidden');
      element.style.minWidth = '120px';
      element.style.textOverflow = 'unset';
      element.style.paddingLeft = 0;
      element.style.paddingRight = 0;

      if (isItemInfo) {
        element.style.width = '120px';
      }

      element.textContent = 'Lägg till';
    } else if (isItemTeaser) {
      element.classList.add('u-hidden');
      element.parentElement.querySelector('.AddToCart').classList.remove('u-hidden');
    }
  });
}

addButtonLabels();
window.addEventListener('ga:productImpression', addButtonLabels);
var setLabelAfterTimeout;
window.addEventListener('ga:modifyCart', function () {
  clearTimeout(setLabelAfterTimeout);
  setLabelAfterTimeout = setTimeout(addButtonLabels, 1000);
});
window.addEventListener('resize', function () {
  clearTimeout(setLabelAfterTimeout);
  setLabelAfterTimeout = setTimeout(addButtonLabels, 200);
});