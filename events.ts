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
        const link = element.firstElementChild;

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

          link.textContent = 'Handla online';
        });

        link.addEventListener('click', (event) => {
          event.preventDefault();
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'experiment',
            eventAction: 'click',
            eventLabel: 'handla-online',
          });
          DY.API('event', {
            name: 'T102-click',
          });
          setTimeout(() => {
            location.href = (<HTMLAnchorElement>event.target).href;
          }, 100);
        });
      },
      {
        disconnect: true,
      }
    );

    pageview();
    cover.waitFor('.js-page', () => {
      pageview();
    });

    function pageview() {
      if (window.location.pathname.startsWith('/handla/')) {
        cover.waitFor('.Bar--extendedHeader', (element) => {
          cover.ready(element, 'T91');

          cover.variant['T91'] = () => {
            const css = document.createElement('style');
            css.innerHTML = `
              .Bar--extendedHeader {
                background: #F5F5F5!important;
                display: flex;
                align-items: center;
                height: 88px!important;
              }
              .Bar-search .Search {
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
              .EditOrderTimeout-info--text,
              .TimeslotPreview-info--date {
                color: #005537;
              }
              .Bar--withDropdown button {
                color: #005537!important;
              }
            `;

            document.body.append(css);
          };
        });

        if (window.location.pathname === '/handla/sok/') {
          cover.waitFor(
            '.FilterView-filterToggler',
            () => {
              cover.variantReady('T103', () => {
                const css = document.createElement('style');
                css.innerHTML = `
                  .FilterView-filterToggler {
                    display: none;
                  }
                `;
                document.body.append(css);
              });
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
    } // pageview();

    if (window.location.pathname === '/') {
      let experimentListenOnSearchInputOnce = false;
      cover.waitFor(
        '.u-paddingVsm.u-paddingHsm.u-textSmall.u-bgGrayLight.u-colorBlack',
        (element) => {
          cover.variantReady('T97', () => {
            // const bar = document.querySelector(
            //   '.u-paddingVsm.u-paddingHsm.u-textSmall.u-bgGrayLight.u-colorBlack'
            // );

            const bar = element;

            // in .Bar-search ?

            const pillbar = document.createElement('span');
            pillbar.classList.add('pillbar');
            bar.append(pillbar);

            function addPills() {
              let pillbar = document.querySelector('.pillbar');

              const data = document.querySelectorAll(
                '.mixinScroll h2 + p.u-marginVz .Link2-text'
              );

              let labels = [];
              data.forEach((element) => {
                const label = element.closest('div').firstChild;
                labels.push(label.textContent);
              });

              let quantitys = [];
              let links = [];
              data.forEach((element) => {
                const link = element.closest('a').href;
                links.push(link);

                const quantity = element.textContent.replace(' träffar', '');
                quantitys.push(quantity);
              });

              pillbar.innerHTML = '';
              labels.forEach((label, index) => {
                const pill = document.createElement('a');
                pill.classList.add(
                  'Button',
                  'Button--white',
                  'Button--small',
                  'Button--radius',
                  'Button--invertedGreen',
                  'u-marginHxxsm',
                  'u-flexShrinkNone'
                );
                pill.href = links[index];
                pill.innerText = label + ' (' + quantitys[index] + ')';

                pillbar.append(pill);

                pill.addEventListener('click', (event) => {
                  event.preventDefault();
                  dataLayer.push({
                    event: 'interaction',
                    eventCategory: 'experiment',
                    eventAction: 'click',
                    eventLabel: 'section-pills',
                  });
                  setTimeout(() => {
                    location.href = event.target.href;
                  }, 100);
                });
              });
            }

            addPills();

            if (!experimentListenOnSearchInputOnce) {
              experimentListenOnSearchInputOnce = true;

              const input = document.querySelector('.Search-input');
              input.addEventListener('input', () => {
                setTimeout(() => {
                  addPills();
                }, 1000); //delay
              }); // input
            }
          });
        }
      ); // waitFor
    } // if

    if (window.location.pathname.startsWith('/recept/')) {
      cover.waitFor(
        '.js-buyRecipeItem',
        (element) => {
          element.addEventListener('click', () => {
            dataLayer.push({
              event: 'interaction',
              eventCategory: 'experiment',
              eventAction: 'click',
              eventLabel: 'recept-buy-cta',
            });
          });

          cover.variantReady('T109', () => {
            let buttons = document.querySelectorAll('.js-buyRecipeItem');
            buttons.forEach((button) => {
              button.innerHTML = 'Handla varor';
            });
          });
        },
        {
          querySelectorAll: true,
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
      cover.waitFor(
        '.Button',
        (element) => {
          if (location.hash === '#/varukorg') {
            element.addEventListener(
              'click',
              () => {
                dataLayer.push({
                  event: 'interaction',
                  eventCategory: 'experiment',
                  eventAction: 'click',
                  eventLabel: 'replacement-change',
                });

                let checkboxes;

                setTimeout(() => {
                  checkboxes = document.querySelectorAll('.Checkbox-input');

                  checkboxes.forEach((checkbox) => {
                    checkbox.addEventListener('click', pushStats);
                  });
                }, 100);

                function pushStats() {
                  dataLayer.push({
                    event: 'interaction',
                    eventCategory: 'experiment',
                    eventAction: 'click',
                    eventLabel: 'replacement-items',
                  });

                  checkboxes.forEach((checkbox) => {
                    checkbox.removeEventListener('click', pushStats);
                  });
                }
              },
              { once: true }
            );

            cover.variantReady('T100', () => {
              element.click();

              const container = element.closest(
                '.u-paddingAmd.u-borderBottom.u-flex'
              );
              element.remove();
              const wrapper = container.parentElement;
              const cart = document.querySelector('.Cart-group');

              wrapper.insertBefore(container, cart);

              // Will be added again if you go back and forth
              const css = document.createElement('style');
              css.innerHTML = `
                .Checkbox label:before {
                  border-radius: 0;
                  transition: none;
                }
                div.Grid-cell.u-md-size3of4.u-lg-size2of3 p.u-marginVz.u-lineHeightLarge {
                  display: none;
                }
                .Checkbox-label {
                  font-weight: normal;
                }
              `;
              document.body.append(css);

              const checkbox = wrapper.querySelector('div.Checkbox');

              const header = document.createElement('div');
              header.innerHTML = 'Om en vara är tillfälligt slut';
              header.style.fontWeight = 'bold';
              header.style.paddingBottom = '8px';

              checkbox.parentElement.insertBefore(header, checkbox);

              const label = checkbox.querySelector('.Checkbox-label');
              label.innerHTML = 'Tillåt ersättningsvaror för alla varor';

              cover.waitFor(
                '.Checkbox-label',
                (element) => {
                  element.innerText = 'Ersätt vara';
                },
                {
                  querySelectorAll: true,
                  content: 'Ersätt varan om den tar slut',
                }
              );
            });
          }
        },
        {
          querySelectorAll: true,
          content: 'Ändra',
        }
      );
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

    if (cover.isProductPage()) {
      cover.waitFor(
        '[data-list="Varor som ingår i erbjudandet"]',
        (element) => {
          const header = element.previousSibling;
          header.remove();

          element.remove();
        }
      );
    }

    if (window.location.pathname === '/mitt-coop/mina-poang/') {
      cover.waitFor(
        '.TransactionTable-footer',
        (loaded) => {
          cover.variantReady('T98', () => {
            const component = loaded.closest(
              '[data-react-component="MyPointsTransactions"]'
            );

            const section = component.querySelector('.Section');
            section.style.height = '400px';
            section.style.overflow = 'hidden';
            section.style.marginBottom = 'unset';

            const container = document.createElement('div');
            container.classList.add('Section', 'Section--margin', 'u-bgWhite');

            const wrapper = document.createElement('div');
            wrapper.classList.add('u-textCenter', 'u-paddingA', 'u-borderTop');

            const link = document.createElement('a');
            link.classList.add('Link', 'Link--green');
            link.style.cursor = 'pointer';
            link.innerText = 'Visa mer';
            let toggle = 'show';

            wrapper.append(link);
            container.append(wrapper);
            component.append(container);

            const mainContainer = component.closest('.Main-container');
            mainContainer.prepend(component);

            link.addEventListener('click', () => {
              if (toggle == 'show') {
                section.style.height = 'unset';

                dataLayer.push({
                  event: 'interaction',
                  eventCategory: 'experiment',
                  eventAction: 'click',
                  eventLabel: 'show',
                });

                DY.API('event', {
                  name: 'T98-click',
                });

                link.innerText = 'Visa mindre';
                toggle = 'hide';
              } else {
                section.style.height = '400px';

                link.innerText = 'Visa mer';
                toggle = 'show';
              }
            });
          });
        },
        {
          disconnect: true,
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
