document.querySelectorAll('.T68').forEach((button) => {
  show(button);
});

document.addEventListener('cover.ready T68', (event) => {
  show(event.target);
});

function show(button) {
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
}

function hide(button) {
  button.classList.add('u-hidden');
  button.parentElement.querySelector('.AddToCart').classList.remove('u-hidden');
}

function quantityObserver(targetNode) {
  const config = { attributes: true, childList: false, subtree: false };

  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.target.value > 0) {
        hide(
          mutation.target
            .closest('.ItemTeaser-button, .ItemInfo-button')
            .querySelector('.T68')
        );
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}
