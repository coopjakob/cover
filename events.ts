declare const DY: any;
declare const __cmp: any;
declare const dataLayer: any;

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
    promises: object;
    // history: object;
    // pending: Array<string>;
  };
  run: () => void;
}

const cover: CoverType = {
  checkDynamicYieldABtestConsent: () => {
    return __cmp('getCMPData')?.vendorConsents?.c18593;
  },
  isInternetExplorer: !!(document as any).documentMode,
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
    async experiment(experimentId) {
      if (typeof this.promises[experimentId] !== 'undefined') {
        return this.promises[experimentId];
      } else {
        // Behövs else?

        const urlParams = new URLSearchParams(window.location.search);
        const abtestFlag: string = urlParams.get('abtest');

        if (abtestFlag == 'true' || abtestFlag == 'dev') {
          setTimeout(() => {
            console.log('Experiments activated');
            this.promises[experimentId] = true;
            return true;
          }, 200);
        }

        if (abtestFlag == 'false') {
          console.log('Experiments disabled');
          this.promises[experimentId] = false;
          return false;
        }

        // This will also run on abtest=true to notice errors
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
                dyid: '123456', // return variant
                // dyid: '1234', // return original
                // dyid: cover.dynamicYieldId,
              },
              selector: {
                names: [experimentId],
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
        )
          .then((response) => response.json())
          .then((data) => {
            const payload = data.choices[0].variations[0].payload.data;

            if (!!payload) {
              dataLayer.push({
                event: 'DY Event',
                eventCategory: 'DY Smart Action',
                eventAction: experimentId,
                eventLabel: 'Variation 1',
              });
              return true;
            } else {
              dataLayer.push({
                event: 'DY Event',
                eventCategory: 'DY Smart Action',
                eventAction: experimentId,
                eventLabel: 'Control Group',
              });
              return false;
            }
          });

        return response;
      }
    },
    promises: {},
  },
  run: () => {
    pageview();
    cover.waitFor('.js-page', () => {
      pageview();
    });

    function pageview() {
      cover.waitFor(
        '.ItemTeaser',
        async (element) => {
          console.log('loading - opacity 0');
          element.style.opacity = '0.5';

          cover.choose.promises['T1337'] = cover.choose.experiment('T1337');

          // await cover.choose.promises['T1337'];
          // console.debug('prom after await', cover.choose.promises['T1337']);

          if (await cover.choose.promises['T1337']) {
            console.log('variant1 - remove');
            element.style.opacity = '0.1';
            //element.remove();
          } else {
            console.log('original - opacity 1');
            element.style.opacity = '0.8';
          }
        },
        {
          querySelectorAll: true,
          init: true,
        }
      );

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
              // TODO: Add actions
            }
          },
          {
            querySelectorAll: true,
            init: true,
          }
        );
      }

      if (cover.isProductPage()) {
        cover.waitFor(
          '[data-list="Complementary Product Recommendation PDP"]',
          (target) => {
            const element = target.closest('.Grid-cell');

            if (element) {
              // TODO: Add actions
            }
          },
          {
            init: true,
          }
        );
      }
    }
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

// Debug:
cover.run();
