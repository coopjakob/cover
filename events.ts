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
  // TODO: add options and types
  // init: Boolean, disconnect: Boolean, content: String
  waitFor: (selector, wrapper, callback, options = {}) => {
    let selectorElement;
    let isCallbackSent = false;

    console.debug('<experiment> Wait for selector', selector);

    // If not an element
    if (!wrapper.tagName) {
      wrapper = document.querySelector(wrapper);
    }

    if (wrapper) {
      if (options.init) {
        if ((selectorElement = wrapper.querySelector(selector))) {
          if (okContent(selectorElement)) {
            callback(selectorElement);
            isCallbackSent = true;
          }
        }
      }

      if (isCallbackSent && options.disconnect) {
        // Don't start observer
      } else {
        // Start if disconnect is both false or true
        initObserver();
      }

      function observerMatch(element) {
        if (okContent) {
          callback(element);
        }

        if (options.disconnect) {
          observer.disconnect();
        }
      }

      function okContent(element) {
        if (!options.content) return true;

        if (element.textContent == options.content) {
          return true;
        } else {
          return false;
        }
      }

      function initObserver() {
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
                observerMatch(node);
              } else if ((selectorElement = node.querySelector(selector))) {
                console.debug('<experiment> Selector exist in node', selector);
                observerMatch(selectorElement);
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
    }
  },
  ready: (element, id) => {
    // TODO: Remove duplicated id if possible
    // (element.identifier === id);
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

  if (/complete|interactive|loaded/.test(document.readyState)) {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }

  function run() {
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
  }
})();
