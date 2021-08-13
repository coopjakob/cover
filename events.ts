(() => {
  const currentScript = document.currentScript;

  if (currentScript) {
    let scriptOrigin = new URL(currentScript.src).origin;
    console.debug('scriptOrigin', scriptOrigin);

    const preload = (path) => {
      let link = document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('href', `${scriptOrigin}/${path}`);
      link.setAttribute('as', 'script');

      document.head.appendChild(link);
    };

    preload('t60/variant1.js');
    preload('t66/variant1.js');
  }
})();

const cover = {
  waitFor: (selector, wrapper, callback, options = {}) => {
    let selectorElement;

    console.debug('<experiment> Wait for selector', selector);

    // If not an element
    if (!wrapper.tagName) {
      wrapper = document.querySelector(wrapper);
    }

    if (!wrapper) {
      callback(false);
    } else {
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
        attributeFilter: ['data-test'],
      });
    }
  },
  ready: (element, id) => {
    // element.identifier = id;
    const event = new Event(`cover.ready ${id}`, { bubbles: true });
    element.dispatchEvent(event);

    DY.API('event', {
      name: 'cover.ready',
      properties: {
        id: id,
      },
    });
  },
};

(() => {
  const addIdentifierClasses = (element, id) => {
    element.classList.add('Experiment', id);
  };

    try {
  cover.waitFor(
    '.Notice.Notice--info.Notice--animated.Notice--center',
    '.Main',
    (element) => {
      addIdentifierClasses(element, 'T66');
      cover.ready(element, 'T66');
    },
    {
      init: true,
      disconnect: false,
      content: 'Nu visas varor för: Hemleverans i StockholmÄndra',
    }
  );
    } catch (error) {
      console.debug(error);
    }

    try {
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
        cover.ready(element, 'T60');
    },
    {
      init: true,
      disconnect: true,
      content: 'Köp',
    }
  );
    } catch (error) {
      console.debug(error);
    }

    try {
  cover.waitFor(
    '[data-test="cncheader-chagedeliverymethodbutton"]',
    '#portal',
    (element) => {
      addIdentifierClasses(element, 'T67');
      cover.ready(element, 'T67');
    },
    {
      disconnect: false,
    }
  );
    } catch (error) {
      console.debug(error);
    }
})();
