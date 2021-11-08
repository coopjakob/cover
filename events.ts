declare const DY: any;
declare const __cmp: any;
declare const coopUserSettings: any;

interface Document {
  documentMode?: any;
}

interface coverType {
  checkDynamicYieldABtestConsent: () => boolean;
  isInternetExplorer: () => boolean;
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
  addIdentifierClasses: (element: Element, id: string) => void;
  run: () => void;
}

const cover: coverType = {
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
    const path = window.location.pathname;

    if (
      path.startsWith('/handla/varor/') &&
      isNaN(parseFloat(path.split('-').pop())) // not on a product detail page
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
      '.js-page',
      (element) => {
        if (
          window.location.pathname === '/handla/' &&
          coopUserSettings.isAuthenticated &&
          !coopUserSettings.isCompany
        ) {
          cover.waitFor(
            '.js-savedCarts',
            (savedCarts) => {
              const element = savedCarts.closest('.Grid-cell.u-sizeFull');
              cover.addIdentifierClasses(element, 'T63');
              cover.ready(element, 'T63');
            },
            {
              init: true,
              disconnect: true,
            }
          );
        }

        if (window.location.pathname === '/handla/aktuella-erbjudanden/') {
          cover.addIdentifierClasses(element, 'T69');
          cover.ready(element, 'T69');
        }

        if (window.location.pathname === '/handla/betala/') {
          if (window.innerWidth > 1024) {
            cover.waitFor(
              '.Grid-cell.u-size1of2.u-sm-size1of4.u-md-size1of5.u-lg-size1of6',
              (element) => {
                cover.addIdentifierClasses(element, 'T60');
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

        if (cover.onCategory()) {
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
      '.Button.Button--green.Button--medium.Button--full.Button--radius.u-hidden',
      (element) => {
        // search will include quantity on load
        if (element.parentElement.querySelector('input').value === '0') {
          cover.addIdentifierClasses(element, 'T68');
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

    cover.waitFor(
      '.Swiper.is-loaded',
      (loaded) => {
        if (window.location.pathname === '/handla/') {
          const parent = loaded.parentElement;
          if (parent.matches('[data-list="Offer Recommendation Handla"]')) {
            const element = parent.previousElementSibling;
            cover.addIdentifierClasses(element, 'T71');
            cover.ready(element, 'T71');
          }
        }
      },
      {
        init: true,
      }
    );

    if (window.innerWidth >= 480) {
      cover.waitFor(
        '.ItemTeaser',
        (target) => {
          if (target.clientWidth < 170) {
            const element = target.closest('.Grid--product');

            if (element) {
              cover.addIdentifierClasses(element, 'T73');
              cover.ready(element, 'T73');
            }
          }
        },
        {
          init: true,
        }
      );
    }

    cover.waitFor(
      '.Tooltip--loginReminder',
      (element) => {
        cover.addIdentifierClasses(element, 'T74');
        cover.ready(element, 'T74');
      },
      {
        init: true,
        disconnect: true,
      }
    );

    cover.waitFor(
      '.js-substitute',
      (element) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              cover.addIdentifierClasses(element, 'T75');
              cover.ready(element, 'T75');
            }
          });
        });
        observer.observe(element.closest('.Cart-item'));
      },
      {
        querySelectorAll: true,
      }
    );

    cover.waitFor('.FlyIn-scroll', (element) => {
      if (!element.parentElement.querySelector('.FlyIn-back')) {
        cover.addIdentifierClasses(element, 'T76');
        cover.ready(element, 'T76');
      }
    });
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
