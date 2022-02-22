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
  variantReady: (id: string, callback: () => void) => void;
  ready: (element: Element, id: string) => void;
  readyHistory: Array<string>;
  addIdentifierClasses: (element: Element, id: string) => void;
  groups: () => any;
  run: () => void;
  variant: [];
  variantHistory: Array<string>;
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
  variantReady: (id, callback) => {
    // Always reset with current element
    cover.variant[id] = () => {
      callback();

      cover.variantHistory.push(id);
    };

    if (!cover.readyHistory.includes(id)) {
      DY.API('event', {
        name: `cover.ready ${id}`,
      });

      cover.readyHistory.push(id);
    }

    if (cover.variantHistory.includes(id)) {
      cover.variant[id]();
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
    cover.waitFor(
      '[data-test="mainnav-handla"]',
      (element) => {
        cover.variantReady('T102', () => {
          const css = document.createElement('style');
          css.innerHTML = `
              @media only screen and (min-width: 1025px) and (max-width: 1078px) {
                .Navigation--primaryGreen .Navigation-item a {
                  padding: 0 1rem;
                }
              }
            `;
          document.body.append(css);

          element.firstElementChild.textContent = 'Handla online';
        });
      },
      {
        disconnect: true,
      }
    );

    if (window.location.pathname.startsWith('/handla/')) {
      cover.waitFor(
        '.SidebarNav--online',
        (element) => {
          const selectedItems = element.querySelectorAll(
            '[data-id="91162"], [data-id="90738"], [data-id="162750"], [data-id="195873"], [data-id="199770"], [data-id="203149"]'
          );

          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async (entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();

                cover.variantReady('T89', () => {
                  selectedItems.forEach((item) => {
                    item.remove();
                  });
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
                      max-width: 264px;
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

        if (cover.isProductPage()) {
          cover.waitFor(
            '[data-list="P05_B2C_Complementary_Products_PDP"]',
            (element) => {
              cover.variantReady('P05.3', () => {
                element.classList.add('u-hidden');

                const title = element.previousElementSibling;
                title.classList.remove('u-flex');
                title.classList.add('u-hidden');
              });
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

    if (window.location.pathname == '/') {
      cover.waitFor(
        '[data-react-component="DynamicYieldRecommendationsBlock"]',
        (element) => {
          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async (entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();

                cover.variantReady('T88', () => {
                  const html = document.createElement('div');
                  html.innerHTML = `
                    <form action="https://www.coop.se/handla/sok/" method="get">
                      <div
                        class="Search-content"
                        style="border-radius: 25px; max-width: 600px; margin: 15px auto 0 auto"
                      >
                        <button
                          type="submit"
                          class="Search-icon u-outlineSolidBase2 u-outlineInside"
                          aria-label="Sök"
                        >
                          <svg role="img" title="Sök">
                            <use
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              xlink:href="/assets/build/sprite.svg?v=220203.1347#search-rounded"
                            ></use>
                          </svg>
                        </button>
                        <input
                          name="q"
                          class="Search-input"
                          type="search"
                          placeholder="Sök bland tusentals varor"
                        />
                      </div>
                    </form>
                  `;

                  const wrapper = element.closest('.Section');
                  wrapper.append(html);
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

    if (window.location.pathname === '/handla/betala/') {
      cover.waitFor(
        '[data-component-id="EditOrderModeNotice"]',
        () => {
          cover.waitFor(
            '[data-component-id="Step2RecommendationsGrid"]',
            () => {
              cover.variantReady('P09', () => {
                const css = document.createElement('style');
                css.innerHTML = `
                  [data-component-id="Step2RecommendationsGrid"] {
                    display: none;
                  }
                `;
                document.body.append(css);
              });
            },
            {
              disconnect: true,
            }
          );
        },
        {
          disconnect: true,
        }
      );
      cover.waitFor('.SubscriptionWidget-text', (element) => {
        cover.variantReady('T101', () => {
          element.innerText =
            'Effektivisera vardagen! Prenumerera på din varukorg och få tid över till annat.';
        });
      });
    }

    if (window.location.pathname === '/mitt-coop/') {
      cover.waitFor(
        '.Card-text',
        (target) => {
          const element: HTMLElement = target.closest('.Card--myCoopBanner');

          if (element) {
            cover.variantReady('T82', () => {
              const title = element.querySelector('h2');
              const body = element.querySelector('p');
              const button = element.querySelector('.Button');

              element.style.minHeight = 'unset';
              element.style.textAlign = 'center';

              title.innerText = 'Medlemmar tjänar mer!';
              title.classList.add('u-sizeFull', 'u-sm-textLeft');

              body.innerText =
                'Samla poäng och handla till medlemspriser även på Coop.se – anslut ditt medlemskap.';
              body.classList.add('u-marginBxsm', 'u-sm-textLeft');

              const logo = document.createElement('span');
              logo.innerHTML = `
                <svg class="Icon Icon--bankid u-alignTextTop u-marginLxsm" role="img">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=210223.1040#bankid">
                    <title>BankID</title>
                  </use>
                </svg>
              `;

              button.append(logo);
            });

            element
              .querySelector('a.Button')
              .addEventListener('click', (event) => {
                event.preventDefault();
                dataLayer.push({
                  event: 'interaction',
                  eventCategory: 'Experiment',
                  eventAction: 'T82-click',
                  eventLabel: '',
                });
                DY.API('event', {
                  name: 'T82-click',
                });
                setTimeout(() => {
                  location.href = (<HTMLAnchorElement>event.target).href;
                }, 100);
              });
          }
        },
        {
          content: 'Är du medlem – anslut ditt medlemskap!',
        }
      );
    }
  },
  variant: [],
  variantHistory: [],
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

(() => {
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
})();
