(() => {
  const selector = '.Notice.Notice--info.Notice--animated.Notice--center';
  const content = 'Nu visas varor för: Hemleverans i StockholmÄndra';
  const element = document.querySelector(selector);

  const existWithContent = (element) => {
    if (element?.textContent == content) {
      return true;
    }
    return false;
  };

  const addIdentifierClasses = (element) => {
    element.classList.add('Experiment', 'T35');
  };

  const reportToDynamicYield = () => {
    DY.API('event', {
      name: 'test',
    });
  };

  if (existWithContent(element)) {
    addIdentifierClasses(element);
    reportToDynamicYield();
  }

  cover.waitFor(selector, '.Main', (element) => {
    if (existWithContent(element)) {
      addIdentifierClasses(element);
      reportToDynamicYield();
    }
  });
})();

const cover = {
  waitFor: (selector, element, callback) => {
    console.debug('<experiment> Wait for selector', selector);

    // If not an element
    if (!element.tagName) {
      element = document.querySelector(element);
    }

    let observer = new MutationObserver((mutations) => {
      console.debug('<experiment> Change detected in element', element);
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) {
          console.debug('<experiment> Node added', node);
          if (!node.tagName) {
            console.debug('<experiment> Node is not an element');
            continue;
          }

          let selectorElement;
          if (node.matches(selector)) {
            console.debug('<experiment> Selector matches', selector);
            observer.disconnect();

            console.debug('<experiment> callback', node);
            callback(node);
          } else if ((selectorElement = node.querySelector(selector))) {
            console.debug('<experiment> Selector exist in node', selector);
            observer.disconnect();

            console.debug('<experiment> callback', selectorElement);
            callback(selectorElement);
          }
        }
      }
    });

    console.debug('<experiment> observing', element);
    observer.observe(element, {
      childList: true,
      subtree: true,
    });
  },
};
