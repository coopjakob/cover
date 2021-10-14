// TODO: If wrapper is the same, use the same observer
// Implement URL checker and triggers etc.
// Flatten ifs,
// Add all tests as a setting/options
// way too many nested if. Better use the following rule: worst case scenario first .
// Firstly put all the exit scenarios (negate the condition inside ifs), then you can continue with your TODO code,
// This will make your code more readable for debugging and you will avoid any unknown bugs.

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
    callback: (element: Element) => void,
    options?: {
      wrapper?: string;
      init?: boolean;
      querySelectorAll?: boolean;
      content?: string;
      disconnect?: boolean;
    }
  ) => void;
  onCategory: () => boolean;
  ready: (element: Element, id: string) => void;
}

let readyHistory = [];
const cover: coverType = {
  waitFor: (selector, callback, options) => {
    if (!options.wrapper) {
      options.wrapper = '.Main';
    }

    let wrapperElement = document.querySelector(options.wrapper);
    let observer: MutationObserver;
    let isCallbackSent = false;

    function okContent(element) {
      if (!options.content) {
        return true;
      }

      return element.textContent == options.content;
    }

    function matchElementSelector(wrapper: Element) {
      let elements = [];

      if (wrapper.matches(selector)) {
        elements.push(wrapper);
      }

      if (options.querySelectorAll) {
        elements = elements.concat(
          Array.from(wrapper.querySelectorAll(selector))
        );
      } else {
        if (wrapper.querySelector(selector)) {
          elements.push(wrapper.querySelector(selector)); //duplicated code
        }
      }

      // const elements = options.querySelectorAll
      //   ? Array.from(wrapper.querySelectorAll(selector))
      //   : [wrapper.querySelector(selector)];

      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          if (okContent(elements[i])) {
            callback(elements[i]);
            isCallbackSent = true;
            if (options.disconnect) {
              if (observer) {
                observer.disconnect();
              }
              break;
            }
          }
        }
      }
    }

    if (options.init) {
      matchElementSelector(wrapperElement);
    }

    if (options.disconnect && isCallbackSent) {
      //
    } else {
      observer = new MutationObserver((mutations) => {
        for (const { addedNodes } of mutations) {
          for (const node of addedNodes) {
            if (node instanceof Element) {
              matchElementSelector(node);
            }
          }
        }
      });

      observer.observe(wrapperElement, {
        childList: true,
        subtree: true,
        attributeFilter: ['data-test'],
      });
    }
  },
  onCategory: () => {
    return window.location.pathname.startsWith('/handla/varor/');
  },
  ready: (element, id) => {
    element.dispatchEvent(new Event(`cover.ready ${id}`, { bubbles: true }));

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
        (element) => {
          addIdentifierClasses(element, 'T60');
          cover.ready(element, 'T60');
        },
        {
          wrapper: '[data-react-component="CheckoutPage"]',
          init: true,
          querySelectorAll: true,
          disconnect: false,
        }
      );
    }

    cover.waitFor(
      '[data-test="cncheader-chagedeliverymethodbutton"]:not(u-hidden)',
      (element) => {
        addIdentifierClasses(element, 'T67');
        cover.ready(element, 'T67');
      },
      {
        wrapper: '#portal',
        init: false,
        disconnect: false,
      }
    );

    cover.waitFor(
      '.Button.Button--green.Button--medium.Button--full.Button--radius.u-hidden',
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
          wrapper: '.Main-container .Section .Grid',
          init: false,
          disconnect: true,
        }
      );
    }

    cover.waitFor(
      '.js-savedCarts',
      (savedCarts) => {
        if (window.location.pathname === '/handla/') {
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
      (loaded) => {
        if (window.location.pathname === '/handla/') {
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
