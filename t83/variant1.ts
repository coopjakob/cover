document.querySelectorAll('.T83').forEach((button) => {
  T83(button);
});

document.addEventListener('cover.ready T83', (event) => {
  T83(event.target);
});

function T83(button) {
  if (button.parentElement.querySelector('input').value != '0') {
    return;
  }

  button.classList.remove('u-hidden');
  button.parentElement.querySelector('.AddToCart').classList.add('u-hidden');

  button.style.minWidth = '120px';
  button.style.textOverflow = 'unset';
  button.style.paddingLeft = 0;
  button.style.paddingRight = 0;

  if (button.parentElement.classList.contains('ItemInfo-button')) {
    button.style.width = '120px';
  }

  // Reset button after quantity change, for ItemInfo and ItemTeaser
  quantityObserver(button.parentElement.querySelector('.AddToCart-input'));

  function hide(button) {
    button.classList.add('u-hidden');
    button.parentElement
      .querySelector('.AddToCart')
      .classList.remove('u-hidden');
  }

  function quantityObserver(targetNode) {
    const config = { attributes: true, childList: false, subtree: false };

    const callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.target.value > 0) {
          hide(
            mutation.target
              .closest('.ItemTeaser-button, .ItemInfo-button')
              .querySelector('.T83')
          );
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
}
