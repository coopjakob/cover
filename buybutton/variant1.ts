function addButtonLabels() {
  // startsidan, sökresultat, kategorier
  document.querySelectorAll('.ItemTeaser-button .Button').forEach((element) => {
    if (element.parentElement.querySelector('input').value == 0) {
      element.classList.remove('u-hidden');
      element.parentElement
        .querySelector('.AddToCart')
        .classList.add('u-hidden');

      element.style.textOverflow = 'unset';
      element.style.paddingLeft = 0;
      element.style.paddingRight = 0;
      element.textContent = 'Lägg till';
    } else {
      element.classList.add('u-hidden');
      element.parentElement
        .querySelector('.AddToCart')
        .classList.remove('u-hidden');
    }
  });

  // dropdown på handla
  document
    .querySelectorAll('.ProductSearch-itemCta .Button')
    .forEach((element) => {
      if (element.parentElement.querySelector('input').value == 0) {
        element.classList.remove('u-hidden');

        element.parentElement
          .querySelector('.AddToCart')
          .classList.add('u-hidden');

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

let setLabelAfterTimeout;

window.addEventListener('resize', () => {
  clearTimeout(setLabelAfterTimeout);
  setLabelAfterTimeout = setTimeout(addButtonLabels, 200);
});
