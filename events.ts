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
  };
  run: () => void;
}

const cover: CoverType = {
  checkDynamicYieldABtestConsent: () => {
    return __cmp('getCMPData')?.vendorConsents?.c18593;
  },
  // @ts-ignore
  isInternetExplorer: !!document.documentMode,
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
        // TODO: Try if `return await` works, and remove else
      } else {
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
                'edd0e8031ae4fa2ef95fcc77b93aabe708f8af388e520408eaa2d1a866e9345f',
            },
            body: JSON.stringify({
              user: {
                dyid: cover.dynamicYieldId,
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
      if (window.location.pathname.startsWith('/handla/')) {
        cover.waitFor(
          '.SidebarNav--online',
          (element) => {
            const selectedItems = element.querySelectorAll(
              '[data-id="91162"], [data-id="90738"], [data-id="162750"]'
            );

            const observer = new IntersectionObserver((entries, observer) => {
              entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                  observer.disconnect();

                  const firstList: HTMLStyleElement =
                    element.querySelector('.SidebarNav-list');

                  firstList.style.opacity = '0';

                  const timeout = setTimeout(() => {
                    firstList.style.opacity = 'unset';
                  }, 1000);

                  cover.choose.promises['T86'] = cover.choose.experiment('T86');

                  if (await cover.choose.promises['T86']) {
                    selectedItems.forEach((element) => {
                      element.remove();
                    });
                  }
                  firstList.style.opacity = 'unset';
                  clearTimeout(timeout);
                }
              });
            });
            observer.observe(element);
          },
          {
            init: true,
            disconnect: true,
          }
        );
      }

      if (window.location.pathname === '/handla/') {
        cover.waitFor(
          '[data-react-component="DynamicYieldRecommendationsBlock"]',
          async (element) => {
            const props = JSON.parse(element.dataset.reactProps);
            const id = props.recommendationId;

            if (
              id === 'P04.favourite-products.handla-startpage' ||
              id === 'P03.popular-products.handla-startpage' ||
              id === 'Home_page.horizontal_recs1_b2b' ||
              id === 'home_page.horizontal_recs4_b2b'
            ) {
              element.style.opacity = '0';

              const timeout = setTimeout(() => {
                element.style.opacity = 'unset';
              }, 1000);

              cover.choose.promises['T84'] = cover.choose.experiment('T84');

              if (await cover.choose.promises['T84']) {
                element.remove();
              } else {
                element.style.opacity = 'unset';
              }
              clearTimeout(timeout);
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
          async (target) => {
            const element: HTMLStyleElement = target.closest('.Grid-cell');

            if (element) {
              element.style.opacity = '0';

              const timeout = setTimeout(() => {
                element.style.opacity = 'unset';
              }, 1000);

              cover.choose.promises['T84'] = cover.choose.experiment('T84');

              if (await cover.choose.promises['T84']) {
                element.remove();
              } else {
                element.style.opacity = 'unset';
              }
              clearTimeout(timeout);
            }
          },
          {
            init: true,
          }
        );
      }
    }

    cover.waitFor(
      '.Swiper-button',
      async (element) => {
        cover.choose.promises['T83'] = cover.choose.experiment('T70');

        if (await cover.choose.promises['T70']) {
          element.style.opacity = '1';
        }
      },
      {
        init: false,
        querySelectorAll: true,
      }
    );

    cover.waitFor(
      '.Button.Button--green.Button--medium.Button--full.Button--radius.u-hidden',
      async (button) => {
        const container: HTMLStyleElement = button.closest(
          '.ItemTeaser-button, .ItemInfo-button, .ProductSearch-itemCell'
        );

        if (!container) {
          return;
        }

        const fieldset: HTMLStyleElement =
          container.querySelector('fieldset.AddToCart');
        const input: HTMLFormElement =
          container.querySelector('.AddToCart-input');

        // Search will include quantity on load
        if (input.value !== '0') {
          return;
        }

        container.style.opacity = '0';

        const timeout = setTimeout(() => {
          container.style.opacity = 'unset';
        }, 1000);

        cover.choose.promises['T83'] = cover.choose.experiment('T83');

        if (await cover.choose.promises['T83']) {
          button.classList.remove('u-hidden');
          fieldset.classList.add('u-hidden');

          button.style.minWidth = '120px';
          button.style.textOverflow = 'unset';
          button.style.paddingLeft = '0';
          button.style.paddingRight = '0';

          if (container.classList.contains('ItemInfo-button')) {
            button.style.width = '120px';
          }
        }
        container.style.opacity = 'unset';
        clearTimeout(timeout);
      },
      {
        init: true,
        querySelectorAll: true,
        content: 'Köp',
      }
    );

    function T83(button) {
      if (button.parentElement.querySelector('input').value != '0') {
        return;
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
