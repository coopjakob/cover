declare const DY: any;
declare const __cmp: any;
declare const coopUserSettings: any;
declare const dataLayer: any;

interface Document {
  documentMode?: any;
}

interface CoverType {
  checkDynamicYieldABtestConsent: () => boolean;
  isInternetExplorer: boolean;
  dynamicYieldId: string;
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
  choose: {
    experiment: (id: string) => object;
    history: object;
    pending: Array<string>;
  };
  ready: (element: Element, id: string) => void;
  readyHistory: Array<string>;
  addIdentifierClasses: (element: Element, id: string) => void;
  run: () => void;
}

const cover: CoverType = {
  checkDynamicYieldABtestConsent: () => {
    return __cmp('getCMPData')?.vendorConsents?.c18593;
  },
  isInternetExplorer: !!window.document.documentMode,
  dynamicYieldId: localStorage.getItem('_dyid'),
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
  choose: {
    async experiment(id) {
      let payload: object;

      if ((payload = cover.choose.history[id])) {
        return payload;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const abtestFlag: string = urlParams.get('abtest');

      if (abtestFlag == 'true' || abtestFlag == 'dev') {
        setTimeout(() => {
          return {};
        }, 200);
      }

      if (abtestFlag == 'false') {
        return false;
      }

      if ((payload = cover.choose.pending[id])) {
        // TODO: Wait for it to finish
        return payload;
      }

      if (!abtestFlag && !cover.choose.pending.includes(id)) {
        cover.choose.pending.push(id);

        const response = await fetch(
          'https://direct.dy-api.eu/v2/serve/user/choose',
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'dy-api-key':
                '6152c2da8b4b298832dd025a5ae5644ad819dd203482f4add37e3ad3ed848362',
            },
            body: JSON.stringify({
              user: {
                dyid: cover.dynamicYieldId,
              },
              selector: {
                names: [id],
              },
              context: {
                page: {
                  type: 'OTHER',
                  data: [],
                  location: window.location.href,
                },
              },
              options: {
                isImplicitPageview: false,
              },
            }),
          }
        );

        const choose = await response.json();

        if (choose.choices.length > 0) {
          payload = choose.choices[0].variations[0].payload.data;

          cover.choose.history[id] = payload;
          cover.choose.pending.filter((item) => item != id);

          return payload;
        }

        return false;
      }
    },
    history: {},
    pending: [],
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
                // cover.addIdentifierClasses(element, 'T84');
                // cover.ready(element, 'T84');

                // element.loading();

                if (cover.choose.experiment('T84')) {
                  console.log('variant1');
                  // element.remove();
                } else {
                  console.log('original');
                  // element.show();
                }
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
                  .addEventListener('click', (event) => {
                    event.preventDefault;
                    dataLayer.push({
                      event: 'interaction',
                      eventCategory: 'Experiment',
                      eventAction: 'T82-click',
                      eventLabel: '',
                    });
                    DY.API('event', {
                      name: 'T82-click',
                    });
                    location.href = (
                      event.currentTarget as HTMLAnchorElement
                    ).getAttribute('href');
                  });
              }
            },
            {
              init: true,
              content: 'Är du medlem – anslut ditt medlemskap!',
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
  if (cover.isInternetExplorer) {
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
