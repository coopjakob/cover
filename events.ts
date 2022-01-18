declare const DY: any;
declare const DYO: any;
declare const __cmp: any;

interface CoverType {
  checkDynamicYieldABtestConsent: () => boolean;
  isInternetExplorer: boolean;
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
  groups: () => any;
  run: () => void;
  variant: [];
}

const cover: CoverType = {
  checkDynamicYieldABtestConsent: () => {
    return __cmp('getCMPData')?.vendorConsents?.c18593 || false;
  },
  // @ts-ignore
  isInternetExplorer: !!document.documentMode,
  waitFor: (selector, callback, options = {}) => {
    let wrapperElement = document.body;
    let observer: MutationObserver;
    let isCallbackSent = false;

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

    // default true
    if (options.init != false) {
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
  groups: () => {
    DYO.getUserObjectsAndVariations();
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
        querySelectorAll: true,
        content: 'Köp',
        disconnect: false,
      }
    );

    cover.waitFor('.js-page', (element) => {
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
          }
        );
      }
    });

    cover.waitFor(
      '.Swiper-button',
      (element) => {
        cover.ready(element, 'T70');

        cover.variant['T70'] = () => {
          const css = document.createElement('style');
          css.innerHTML = `
            .Swiper-button {
              opacity: 1;
            }`;
          document.body.append(css);
        };
      },
      {
        querySelectorAll: true,
      }
    );

    pageview();
    cover.waitFor('.js-page', () => {
      pageview();
    });

    function pageview() {
      cover.waitFor(
        '._hj-1uQd9__MinimizedWidgetMiddle__text',
        (element) => {
          element.textContent = 'Tyck till';
        },
        {
          init: false,
          content: 'Feedback',
          disconnect: true,
        }
      );

      if (window.location.pathname === '/handla/') {
        cover.waitFor('.banner_wrapper, .banner_div', (element) => {
          cover.ready(element, 'T81');

          cover.variant['T81'] = () => {
            element.style.display = 'none';
          };
        });
      }

      if (window.location.pathname === '/handla/betala/') {
        cover.waitFor(
          'h1',
          (element) => {
            cover.ready(element, 'T80');

            cover.variant['T80'] = () => {
              element.textContent = 'Passa på att fylla på...';
              element.parentElement.lastChild.remove();
            };
          },
          {
            content: 'Psst! Du har väl inte glömt någonting?',
          }
        );
      }

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

                  selectedItems.forEach((element) => {
                    cover.addIdentifierClasses(element, 'T86');
                    cover.ready(element, 'T86');
                  });
                }
              });
            });
            observer.observe(element);
          },
          {
            disconnect: true,
          }
        );
      }
    }
  },
  variant: [],
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
