// On click on search bar event

function waitFor(selector, callback) {
  let wrapper = document.querySelector('.Search--dropdown');

  console.debug('<experiment> Wait for selector', selector);

  let observer = new MutationObserver((mutations) => {
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        // console.debug('<experiment> Node added', node);

        if (!node.tagName) {
          console.debug('<experiment> Node is not a wrapper');
          continue;
        }

        let elements = node.querySelectorAll(selector);
        if (elements.length > 0) {
          console.debug('<experiment> Selector exist in node', selector);
          console.debug('<experiment> callback elements', elements);
          callback(elements);
        }
      }
    }
  });

  console.debug('<experiment> observing', wrapper);
  observer.observe(wrapper, {
    childList: true,
    subtree: true,
  });
}

waitFor('.AddToCart-button--add', (elements) => {
  elements.forEach((element) => {
    if (document.querySelector('.CartButton .Badge').innerText === '') {
      element.addEventListener('click', (event) => {
        console.debug('optimize.activate.storefocus click');
        dataLayer.push({
          event: 'optimize.activate.storefocus',
        });
      });
    }
  });
});

waitFor('.AddToCart-input', (elements) => {
  elements.forEach((element) => {
    if (document.querySelector('.CartButton .Badge').innerText === '') {
      element.addEventListener('keydown', (event) => {
        console.debug('key', event.key);
        if (event.key === 'Enter') {
          console.debug('optimize.activate.storefocus enter');
          console.debug(document.querySelector('.CartButton .Badge').innerText);
          dataLayer.push({
            event: 'optimize.activate.storefocus',
          });
        }
      });
      element.addEventListener('blur', (event) => {
        if (event.target.value > 0) {
          console.debug('Value', event.target.value);
          console.debug('optimize.activate.storefocus blur');
          console.debug(document.querySelector('.CartButton .Badge').innerText);
          dataLayer.push({
            event: 'optimize.activate.storefocus',
          });
        }
      });
    }
  });
});
