declare const DY: any;
declare const DYO: any;
declare const __cmp: any;
declare const dataLayer: any;
declare const coopUserSettings: any;

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
    return DYO.getUserObjectsAndVariations();
  },
  run: () => {
    pageview();
    cover.waitFor('.js-page', () => {
      pageview();
    });

    function pageview() {
      if (window.location.pathname === '/handla/') {
        cover.waitFor('.banner_wrapper, .banner_div', (element) => {
          cover.ready(element, 'T81');

          cover.variant['T81'] = () => {
            element.style.display = 'none';
          };
        });
      }

      if (window.location.pathname.startsWith('/handla/')) {
        cover.waitFor('.Bar--extendedHeader', (element) => {
          cover.ready(element, 'T91');

          cover.variant['T91'] = () => {
            const css = document.createElement('style');
            css.innerHTML = `
              .Bar--extendedHeader {
                background: #f5f3eb!important;
                display: flex;
                align-items: center;
                height: 88px!important;
              }
              @media (min-width: 1025px) {
                .Bar--extendedHeader {
                  height: 140px!important;
                }
              }
              .Bar-search {
                filter: drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.05));
              }
              .Search-content {
                border: 0;
                max-width: 600px;
                margin: 0 auto;
              }
              .Bar-button--visibleOnlyWhenFixed .CartButton-icon {
                background: #005537;
                margin-left: 10px;
              }
              .js-sidebarTrigger {
                background: #e0efdd;
              }
              .TimeslotPreview-button {
                background: white;
              }
              .TimeslotPreview-info--text,
              .TimeslotPreview-info--date {
                color: #005537;
              }
            `;

            document.body.append(css);
          };
        });

        if (
          window.innerWidth >= 1025 &&
          (cover.isCategoryPage() ||
            window.location.pathname.startsWith('/handla/sok/'))
        ) {
          cover.waitFor(
            '.ItemTeaser',
            (element) => {
              // clientWidth = card width
              if (element.clientWidth < 198) {
                cover.ready(element, 'T87');

                cover.variant['T87'] = () => {
                  const css = document.createElement('style');
                  css.innerHTML = `
                    .Grid--product>.Grid-cell {
                      flex-basis: 198px;
                      flex-grow: 1;
                    }`;

                  document.body.append(css);
                };
              }
            },
            {
              // only one element is needed, change is added as css
              disconnect: true,
            }
          );
        }

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

        if (cover.isProductPage()) {
          cover.waitFor(
            '[data-list="P05_B2C_Complementary_Products_PDP"]',
            (element) => {
              cover.ready(element, 'P05.3');
              cover.variant['P05.3'] = () => {
                const title = element.previousElementSibling;

                element.style.display = 'none';
                title.style.display = 'none';
              };
            }
          );
        }
      }

      if (window.location.pathname === '/handla/betala/') {
        cover.waitFor(
          'h1',
          (element) => {
            cover.ready(element, 'T80');

            cover.variant['T80'] = () => {
              element.textContent = 'Behöver du fylla på?';
              element.parentElement.lastChild.remove();
            };
          },
          {
            content: 'Psst! Du har väl inte glömt någonting?',
          }
        );
      }
    } // pageview();

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

    cover.waitFor('[data-test=mobileCategoryTrigger]', (element) => {
      cover.ready(element, 'T90');

      cover.variant['T90'] = () => {
        element.style.display = 'none';
        const wrapper = element.closest(
          '[data-react-component="EcommerceExtendedHeader"]'
        );
        const html = document.createElement('div');
        html.innerHTML = `
          <div
            class="Bar Bar--global Bar--green"
            style="height: unset; padding-top: 0; padding-left: 1.25rem"
          >
            <button class="Button Button--greenLight2 Button--small Button--radius">
              Kategorier
              <svg
                style="vertical-align: middle"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.6665 6L7.99984 10.6667L3.33317 6"
                  stroke="#005537"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>`;
        wrapper.append(html);
        html.addEventListener('click', () => {
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'Experiment',
            eventAction: 'T90-click',
            eventLabel: '',
          });
          DY.API('event', {
            name: `T90-click`,
          });
          element.click();
        });
      };
    });
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

// Run without specific A/B-test consent (c18593)
const css = document.createElement('style');
css.innerHTML = `
  ._hj-1uQd9__MinimizedWidgetMiddle__text {
    visibility: hidden;
  }
  ._hj-1uQd9__MinimizedWidgetMiddle__text::after {
    content: 'Tyck till';
    visibility: visible;
    display: block;
  }`;
document.body.append(css);
