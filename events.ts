const cover = {
  waitFor: (selector, wrapper, callback, options = {}) => {
    let selectorElement;

    console.debug('<experiment> Wait for selector', selector);

    // If not an element
    if (!wrapper.tagName) {
      wrapper = document.querySelector(wrapper);
    }

    function prepareCallback(element) {
      if (options.disconnect) {
        observer.disconnect();
      }

      console.debug('<experiment> callback', element);
      callback(element);
    }

    function foundSelector(element) {
      if (options.content) {
        if (element.textContent == options.content) {
          prepareCallback(element);
        }
      } else {
        prepareCallback(element);
      }
    }

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
  const addIdentifierClasses = (element, id) => {
    element.classList.add('Experiment', id);
  };

  const eventToDynamicYield = () => {
    DY.API('event', {
      name: 'test',
    });
  };

  cover.waitFor(
    '.Notice.Notice--info.Notice--animated.Notice--center',
    '.Main',
    (element) => {
      addIdentifierClasses(element, 'T66');
      eventToDynamicYield();
    },
    {
      init: true,
      disconnect: false,
      content: 'Nu visas varor för: Hemleverans i StockholmÄndra',
    }
  );

  cover.waitFor(
    '[data-test="cncheader-chagedeliverymethodbutton"]',
    '#portal',
    (element) => {
      addIdentifierClasses(element, 'T67');
      eventToDynamicYield();
    },
    {
      disconnect: false,
    }
  );

  cover.waitFor(
    '.ItemTeaser-button',
    '[data-react-component="CheckoutPage"]',
    (element) => {
      addIdentifierClasses(
        element.closest(
          '.Grid.Grid--equalHeight.Grid--gutterHsm.Grid--gutterVsm'
        ),
        'T60'
      );
      eventToDynamicYield();
    },
    {
      init: true,
      disconnect: true,
      content: 'Köp',
    }
  );
})();
