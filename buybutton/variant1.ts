function addButtonLabels() {
  document
    .querySelectorAll(
      '.ItemTeaser-button > button.Button, .ProductSearch-itemCta .ProductSearch-itemCell > button.Button, .ItemInfo-button > button.Button'
    )
    .forEach((element) => {
      let isItemTeaser = element.parentElement.classList.contains(
        'ItemTeaser-button'
      );

      let isItemInfo = element.parentElement.classList.contains(
        'ItemInfo-button'
      );

      if (element.parentElement.querySelector('input').value === '0') {
        element.classList.remove('u-hidden');
        element.parentElement
          .querySelector('.AddToCart')
          .classList.add('u-hidden');

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
        element.parentElement
          .querySelector('.AddToCart')
          .classList.remove('u-hidden');
      }
    });
}

addButtonLabels();

window.addEventListener('ga:productImpression', addButtonLabels);

let setLabelAfterTimeout;

window.addEventListener('ga:modifyCart', () => {
  clearTimeout(setLabelAfterTimeout);
  setLabelAfterTimeout = setTimeout(addButtonLabels, 1000);
});

window.addEventListener('resize', () => {
  clearTimeout(setLabelAfterTimeout);
  setLabelAfterTimeout = setTimeout(addButtonLabels, 200);
});
