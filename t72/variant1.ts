document.querySelectorAll('.T72').forEach((button) => {
  T72(button);
});

document.addEventListener('cover.ready T72', (event) => {
  T72(event.target);
});

function T72(button) {
  button.classList.remove('u-hidden');
  button.parentElement.querySelector('.AddToCart').classList.add('u-hidden');

  button.innerText = '';
  button.setAttribute('aria-label', 'Köp');

  button.style.textOverflow = 'unset';
  button.style.paddingLeft = 0;
  button.style.paddingRight = 0;
  button.style.width = '40px';
  button.style.background = '#00aa46';

  button.style.backgroundImage =
    'url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxMSAxMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlPi5zdDB7ZmlsbDpub25lO3N0cm9rZTojZmZmO3N0cm9rZS1taXRlcmxpbWl0OjEwfTwvc3R5bGU+PGcgaWQ9IktvbXBvbmVudGJpYmxpb3RlayI+PGcgaWQ9Il94NUJfS8OWUEtOQVBQX3g1RF8tX3gyRl8tU8O2ay1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTUgLTE0KSI+PGcgaWQ9Il94NUJfSUtPTl94NURfLV94MkJfIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNSAxNCkiPjxwYXRoIGlkPSJMaW5lLTYiIGNsYXNzPSJzdDAiIGQ9Ik01LjUuNXYxMCIvPjxwYXRoIGlkPSJMaW5lLTZfMV8iIGNsYXNzPSJzdDAiIGQ9Ik0xMC41IDUuNUguNSIvPjwvZz48L2c+PC9nPjwvc3ZnPg==)';
  button.style.backgroundPosition = 'center center';
  button.style.backgroundRepeat = 'no-repeat';
  button.style.backgroundSize = '16px auto';

  button.parentElement.style.textAlign = 'right';

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
              .querySelector('.T72')
          );
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
}
