declare const DY: any;
declare const __cmp: any;
declare const coopUserSettings: any;

interface coverType {
  checkDynamicYieldABtestConsent: () => boolean;
  waitFor: (
    selector: string,
    callback: (element: Element) => void,
    options?: {
      init?: boolean;
      querySelectorAll?: boolean;
      content?: string;
      disconnect?: boolean;
    }
  ) => void;
  onCategory: () => boolean;
  ready: (element: Element, id: string) => void;
  readyHistory: Array<string>;
}

const cover: coverType = {
  checkDynamicYieldABtestConsent: () => {
    return __cmp('getCMPData').vendorConsents.c18593;
  },
  waitFor: (selector, callback, options = {}) => {
    let wrapperElement = document.body;
    let observer: MutationObserver;
    let isCallbackSent = false;

    if (!wrapperElement) {
      return;
    }

    function okContent(element) {
      if (!options.content) {
        return true;
      }

      return element.textContent === options.content;
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
        const selectorElement = wrapper.querySelector(selector);
        if (selectorElement) {
          elements.push(selectorElement);
        }
      }

      for (let i = 0; i < elements.length; i++) {
        if (!okContent(elements[i])) {
          continue;
        }

        callback(elements[i]);
        isCallbackSent = true;

        if (options.disconnect) {
          try {
            observer.disconnect();
          } catch {}

          break;
        }
      }
    }

    if (options.init) {
      matchElementSelector(wrapperElement);
    }

    if (!(options.disconnect && isCallbackSent)) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              matchElementSelector(node);
            }
          });
        });
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

    if (!cover.readyHistory.includes(id)) {
      DY.API('event', {
        name: `cover.ready ${id}`,
      });

      cover.readyHistory.push(id);
    }
  },
  readyHistory: [],
};

if (cover.checkDynamicYieldABtestConsent()) {
  run();
} else {
  function consentIsAvailable() {
    if (cover.checkDynamicYieldABtestConsent()) {
      run();
    }
  }
  __cmp('addEventListener', ['consent', consentIsAvailable, false], null);
}

function run() {
  const addIdentifierClasses = (element, id) => {
    element.classList.add('Experiment', id);
  };

  cover.waitFor(
    '.js-page',
    (element) => {
      if (window.location.pathname === '/handla/aktuella-erbjudanden/') {
        addIdentifierClasses(element, 'T69');
        cover.ready(element, 'T69');
      }

      if (window.location.pathname === '/handla/betala/') {
        if (window.innerWidth > 1024) {
          cover.waitFor(
            '.Grid-cell.u-size1of2.u-sm-size1of4.u-md-size1of5.u-lg-size1of6',
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
      }

      if (cover.onCategory) {
        cover.waitFor(
          '.ItemTeaser',
          (element) => {
            const scrollAway = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  cover.ready(element, 'T61');
                }
              });
            });
            scrollAway.observe(element);
          },
          {
            init: false,
          }
        );
      }
    },
    {
      init: true,
    }
  );

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

  cover.waitFor(
    '[data-test="cncheader-chagedeliverymethodbutton"]:not(u-hidden)',
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
      if (
        window.location.pathname === '/handla/' &&
        !coopUserSettings.isCompany
      ) {
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
