(() => {
  const currentScript = document.currentScript;

  if (currentScript) {
    let scriptOrigin = new URL(currentScript.src).origin;

    const preload = (path) => {
      let link = document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('href', `${scriptOrigin}/${path}`);
      link.setAttribute('as', 'script');

      document.head.appendChild(link);
    };

    preload('t63/variant1.js');
    preload('t60/variant1.js');
    preload('t66/variant1.js');
    preload('t68/variant1.js');
    preload('t67/variant1.js');
  }
})();

interface coverType {
  waitFor: (
    selector: string,
    wrapper: string | Element,
    callback: (element: Element) => void,
    options?: {
      init?: Boolean;
      querySelectorAll?: Boolean;
      content?: String;
      disconnect?: Boolean;
    }
  ) => void;
  onCategory: () => boolean;
  ready: (element: Element, id: string) => void;
}

let readyHistory = [];
const cover: coverType = {
  waitFor: (selector, wrapper, callback, options) => {
    let selectorElement;
    let isCallbackSent = false;

    // If not an element
    if (!wrapper.tagName) {
      wrapper = document.querySelector(wrapper);
    }

    if (wrapper) {
      if (options.init) {
        if ((selectorElement = wrapper.querySelector(selector))) {
          if (options.querySelectorAll) {
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

        // observer might not exist
        if (typeof observer !== 'undefined' && options.disconnect) {
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
        const observer = new MutationObserver((mutations) => {
          for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
              if (!node.tagName) {
                continue;
              }

              if (node.matches(selector)) {
                observerMatch(node);
              } else if ((selectorElement = node.querySelector(selector))) {
                if (options.querySelectorAll) {
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

        observer.observe(wrapper, {
          childList: true,
          subtree: true,
          attributeFilter: ['data-test'],
        });
      }
    }
  },
  onCategory: () => {
    return window.location.pathname.startsWith('/handla/varor/');
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

    //document.querySelectorAll(".Button.Button--green.Button--medium.Button--full.Button--radius.u-hidden").forEach((element) => { element.classList.add("T68") });
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

    if (cover.onCategory()) {
      startObserver();
    }

    // back button and other browser buttons
    window.addEventListener('popstate', () => {
      if (cover.onCategory()) {
        startObserver();
      }
    });

    // popstate doesn't work if you move forward
    window.addEventListener('ga:virtualPageView', () => {
      if (cover.onCategory()) {
        startObserver();
      }
    });

    function startObserver() {
      cover.waitFor(
        '.ItemTeaser',
        '.Main-container .Section .Grid',
        (element) => {
          // TODO: only on category pages not working!?
          // https://www.coop.se/handla/inspiration on Edge
          // on ga:virtualPageView and popstate
          const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                cover.ready(element, 'T61');
              }
            });
          });
          intersectionObserver.observe(element);

          window.addEventListener('popstate', () => {
            intersectionObserver.unobserve(element);
          });

          window.addEventListener('ga:virtualPageView', () => {
            intersectionObserver.unobserve(element);
          });
        },
        {
          init: false,
          disconnect: true,
        }
      );
    }

    cover.waitFor(
      '.js-savedCarts',
      '.Main',
      (savedCarts) => {
        if (window.location.pathname == '/handla/') {
          const element = savedCarts.closest('.Grid-cell.u-sizeFull');
          addIdentifierClasses(element, 'T63');
          cover.ready(element, 'T63');
        }
      },
      {
        init: true,
        disconnect: true,
      }
    );

    cover.waitFor(
      '.Swiper-button',
      '.Main',
      (element) => {
        addIdentifierClasses(element, 'T70');
        cover.ready(element, 'T70');
      },
      {
        init: false,
        querySelectorAll: true,
      }
    );

    cover.waitFor(
      '.Swiper.is-loaded',
      '.Main',
      (loaded) => {
        if (window.location.pathname == '/handla/') {
          const parent = loaded.parentElement;
          if (parent.matches('[data-list="Offer Recommendation Handla"]')) {
            const element = parent.previousElementSibling;
            addIdentifierClasses(element, 'T71');
            cover.ready(element, 'T71');
          }
        }
      },
      {
        init: true,
      }
    );
  }
})();
