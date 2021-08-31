document.addEventListener('cover.ready T68', (event) => {
  let element = event.target;

  console.debug('fix styling', element);

  element.classList.remove('u-hidden');
  element.parentElement.querySelector('.AddToCart').classList.add('u-hidden');

  element.style.minWidth = '120px';
  element.style.textOverflow = 'unset';
  element.style.paddingLeft = 0;
  element.style.paddingRight = 0;

  if (element.parentElement.classList.contains('ItemInfo-button')) {
    element.style.width = '120px';
  }

  // Reset button after click, needed on ItemInfo and ItemTeaser
  element.addEventListener('click', (event) => {
    let element = event.target;
    console.debug('reset', element);

    element.classList.add('u-hidden');
    element.parentElement
      .querySelector('.AddToCart')
      .classList.remove('u-hidden');
  });
});
