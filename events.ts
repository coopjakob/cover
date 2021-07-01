const cover = {
  waitFor: (selector, wrapper, callback, options = {}) => {
    let selectorElement;

    console.debug('<experiment> Wait for selector', selector);

    // If not an element
    if (!wrapper.tagName) {
      wrapper = document.querySelector(wrapper);
    }

    const prepareCallback = (element) => {
      if (options.disconnect) {
        observer.disconnect();
      }

      console.debug('<experiment> callback', element);
      callback(element);
    };

    const foundSelector = (element) => {
      if (options.content) {
        if (element.textContent == options.content) {
          prepareCallback(element);
        }
      } else {
        prepareCallback(element);
      }
    };

    if (options.init && (selectorElement = wrapper.querySelector(selector))) {
      foundSelector(selectorElement);
    }

    let observer = new MutationObserver((mutations) => {
      console.debug('<experiment> Change detected in element', wrapper);
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) {
          console.debug('<experiment> Node added', node);
          if (!node.tagName) {
            console.debug('<experiment> Node is not an element');
            continue;
          }

          if (node.matches(selector)) {
            console.debug('<experiment> Selector matches', selector);
            foundSelector(node);
          } else if ((selectorElement = node.querySelector(selector))) {
            console.debug('<experiment> Selector exist in node', selector);
            foundSelector(selectorElement);
          }
        }
      }
    });

    console.debug('<experiment> observing', wrapper);
    observer.observe(wrapper, {
      childList: true,
      subtree: true,
    });
  },
};

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

  const eventToDynamicYield = () => {
    DY.API('event', {
      name: 'test',
    });
  };

  cover.waitFor(
    selector,
    '.Main',
    (element) => {
      addIdentifierClasses(element);
      eventToDynamicYield();
    },
    { init: true, disconnect: false, content: content }
  );
})();
