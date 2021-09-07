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
    preload('t68/variant1.js');
  }
})();

let readyHistory = [];
const cover = {
  // TODO: add options and types
  // init: Boolean, querySelectorAll: Boolean, content: String, disconnect: Boolean
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
          if (options.querySelectorAll) {
            console.debug('<experiment> querySelectorAll init', wrapper);
            wrapper.querySelectorAll(selector).forEach((element) => {
              if (okContent(element)) {
                //TODO: options.disconnect is not checked
                callback(element);
                isCallbackSent = true;
              }
            });
          } else {
            if (okContent(selectorElement)) {
              callback(selectorElement);
              isCallbackSent = true;
            }
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
                if (options.querySelectorAll) {
                  console.debug('<experiment> querySelectorAll', node);
                  node.querySelectorAll(selector).forEach((element) => {
                    observerMatch(element);
                  });
                } else {
                  observerMatch(selectorElement);
                }
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

    if (!readyHistory.includes(id)) {
      DY.API('event', {
        name: `cover.ready ${id}`,
      });

      readyHistory.push(id);
    }
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

    if (window.innerWidth > 1024) {
      cover.waitFor(
        '.Grid-cell.u-size1of2.u-sm-size1of4.u-md-size1of5.u-lg-size1of6',
        '[data-react-component="CheckoutPage"]',
        (element) => {
          addIdentifierClasses(element, 'T60');
          cover.ready(element, 'T60');
        },
        {
          init: true,
          querySelectorAll: true,
          disconnect: false,
        }
      );
    }

    cover.waitFor(
      '[data-test="cncheader-chagedeliverymethodbutton"]:not(u-hidden)',
      '#portal',
      (element) => {
        addIdentifierClasses(element, 'T67');
        cover.ready(element, 'T67');
      },
      {
        init: false,
        disconnect: false,
      }
    );

    cover.waitFor(
      '.Button.Button--green.Button--medium.Button--full.Button--radius.u-hidden',
      '.Main',
      (element) => {
        // search will include quantity on load
        if (element.parentElement.querySelector('input').value === '0') {
          addIdentifierClasses(element, 'T68');
          cover.ready(element, 'T68');
        }
      },
      {
        init: true,
        querySelectorAll: true,
        content: 'Köp',
        disconnect: false,
      }
    );
  }
})();
