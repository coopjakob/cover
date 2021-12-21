declare const DY: any;
declare const __cmp: any;
declare const coopUserSettings: any;
declare const dataLayer: any;

interface Document {
  documentMode?: any;
}

interface CoverType {
  checkDynamicYieldABtestConsent: () => boolean;
  isInternetExplorer: () => boolean;
  waitFor: (
    selector: string,
    callback: (element: HTMLElement) => void,
    options?: {
      init?: boolean;
      querySelectorAll?: boolean;
      content?: string;
      disconnect?: boolean;
    }
  ) => void;
  isCategoryPage: () => boolean;
  isProductPage: (path?: string) => boolean;
  ready: (element: Element, id: string) => void;
  readyHistory: Array<string>;
  addIdentifierClasses: (element: Element, id: string) => void;
  run: () => void;
}

const cover: CoverType = {
  checkDynamicYieldABtestConsent: () => {
    return __cmp('getCMPData')?.vendorConsents?.c18593;
  },
  isInternetExplorer: () => {
    return !!window.document.documentMode;
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
        elements = [...wrapper.querySelectorAll(selector)];
      } else {
        const selectorElement = wrapper.querySelector(selector);
        if (selectorElement) {
          elements.push(selectorElement);
        }
      }

      for (let element of elements) {
        if (!okContent(element)) {
          continue;
        }

        callback(element);
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
  isCategoryPage: () => {
    const path = window.location.pathname;

    if (path.startsWith('/handla/varor/') && !cover.isProductPage(path)) {
      return true;
    }
  },
  isProductPage: (path = window.location.pathname) => {
    if (
      path.startsWith('/handla/varor/') &&
      Number.isInteger(parseFloat(path.split('-').pop()))
    ) {
      return true;
    }
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
  addIdentifierClasses: (element, id) => {
    element.classList.add('Experiment', id);
  },
  run: () => {
    cover.waitFor(
      '.Button.Button--green.Button--medium.Button--full.Button--radius.u-hidden',
      (element) => {
        // search will include quantity on load
        if (element.parentElement.querySelector('input').value === '0') {
          cover.addIdentifierClasses(element, 'T83');
          cover.ready(element, 'T83');
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
      '.js-page',
      (element) => {
        if (window.location.pathname === '/handla/') {
          cover.waitFor(
            '[data-react-component="DynamicYieldRecommendationsBlock"]',
            (element) => {
              const props = JSON.parse(element.dataset.reactProps);
              const id = props.recommendationId;

              if (
                id === 'P04.favourite-products.handla-startpage' ||
                id === 'P03.popular-products.handla-startpage' ||
                id === 'Home_page.horizontal_recs1_b2b' ||
                id === 'home_page.horizontal_recs4_b2b'
              ) {
                cover.addIdentifierClasses(element, 'T84');
                cover.ready(element, 'T84');
              }
            },
            {
              querySelectorAll: true,
              init: true,
            }
          );
          cover.waitFor(
            '.banner_wrapper, .banner_div',
            (element) => {
              cover.addIdentifierClasses(element, 'T81');
              cover.ready(element, 'T81');
            },
            {
              init: true,
            }
          );
        }

        if (window.location.pathname === '/mitt-coop/') {
          cover.waitFor(
            '.Card-text',
            (target) => {
              const element = target.closest('.Card--myCoopBanner');

              if (element) {
                cover.addIdentifierClasses(element, 'T82');
                cover.ready(element, 'T82');

                element
                  .querySelector('.Button')
                  .addEventListener('click', () => {
                    dataLayer.push({
                      event: 'interaction',
                      eventCategory: 'Experiment',
                      eventAction: 'T82-click',
                      eventLabel: '',
                    });
                    DY.API('event', {
                      name: 'T82-click',
                    });
                  });
              }
            },
            {
              init: true,
              content: 'Är du medlem – anslut ditt medlemskap!',
            }
          );
        }

        if (
          window.location.href ===
          'https://www.coop.se/handla/betala/#/varukorg'
        ) {
          cover.waitFor(
            '.Heading--h4',
            (heading) => {
              element = heading.closest('.Grid-cell');
              if (element) {
                cover.addIdentifierClasses(element, 'T84');
                cover.ready(element, 'T84');
              }
            },
            {
              init: true,
            }
          );
        }

        if (cover.isProductPage()) {
          cover.waitFor(
            '[data-list="Complementary Product Recommendation PDP"]',
            (target) => {
              element = target.closest('.Grid-cell');
              if (element) {
                cover.addIdentifierClasses(element, 'T84');
                cover.ready(element, 'T84');
              }
            },
            {
              init: true,
            }
          );
        }

        if (cover.isCategoryPage()) {
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
        cover.addIdentifierClasses(element, 'T66');
        cover.ready(element, 'T66');
      },
      {
        init: true,
        disconnect: false,
        content: 'Nu visas varor för: Hemleverans i StockholmÄndra',
      }
    );

    cover.waitFor(
      '.Swiper-button',
      (element) => {
        cover.addIdentifierClasses(element, 'T70');
        cover.ready(element, 'T70');
      },
      {
        init: false,
        querySelectorAll: true,
      }
    );
  },
};

(() => {
  if (cover.isInternetExplorer()) {
    return;
  }

  if (cover.checkDynamicYieldABtestConsent()) {
    cover.run();
  } else {
    __cmp(
      'addEventListener',
      [
        'consent',
        () => {
          if (cover.checkDynamicYieldABtestConsent()) {
            cover.run();
          }
        },
        false,
      ],
      null
    );
  }
})();
