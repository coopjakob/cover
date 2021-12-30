'use strict';

const cover = {
  checkDynamicYieldABtestConsent: () => {
    var _cmp, _cmp$vendorConsents;

    return (_cmp = __cmp('getCMPData')) === null || _cmp === void 0
      ? void 0
      : (_cmp$vendorConsents = _cmp.vendorConsents) === null ||
        _cmp$vendorConsents === void 0
      ? void 0
      : _cmp$vendorConsents.c18593;
  },
  isInternetExplorer: !!window.document.documentMode,
  dynamicYieldId: localStorage.getItem('_dyid'),
  waitFor: (selector, callback, options = {}) => {
    let wrapperElement = document.body;
    let observer;
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

    function matchElementSelector(wrapper) {
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
    init: () => {},
    async experiment(id) {
      let pending;

      // (async () => {
      //   return await cover.choose.promises[id];
      // })();

      // let payload;

      // if ((payload = cover.choose.history[id])) {
      //   console.debug('Data exist');
      //   console.debug('return true');
      //   // return payload;
      //   return true;
      // }

      console.debug('prom exist?', cover.choose.promises['T1337']);
      console.debug('true', !!cover.choose.promises['T1337']);
      console.debug('false', !cover.choose.promises['T1337']);

      if (!!cover.choose.promises['T1337']) {
        console.debug('data pending... wait', pending);
        return cover.choose.promises['T1337'];
      } else {
        // if (cover.choose.pending.includes(id)) {
        //   let answer = await cover.choose.promises[id];
        //   console.debug('data pending... wait', answer);

        //   if (answer) {
        //     console.debug('return true', answer);
        //     return true;
        //   }
        // } else {

        // const urlParams = new URLSearchParams(window.location.search);
        // const abtestFlag = urlParams.get('abtest');

        // if (abtestFlag == 'true' || abtestFlag == 'dev') {
        //   setTimeout(() => {
        //     console.debug('return true');
        //     return true;
        //   }, 200);
        // }

        // if (abtestFlag == 'false') {
        //   console.debug('return false');
        //   return false;
        // }

        // if (!abtestFlag) {
        // cover.choose.pending.push(id);

        // cover.choose.promises[id] = await fetch(

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
                dyid: '123456',
                // dyid: cover.dynamicYieldId,
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
        )
          .then((response) => response.json())
          .then((data) => {
            const payload = data.choices[0].variations[0].payload.data;

            console.debug('payload', payload);

            if (!!payload) {
              return true;
            } else {
              console.debug('ORIGINAL return false');
              return false;
            }
          });

        return response;
      }

      // const data = await response.json();
      // const payload = data.choices[0].variations[0].payload.data;

      // console.debug('payload', payload);

      // if (!!payload) {
      //   return true;
      // } else {
      //   console.debug('ORIGINAL return false');
      //   return false;
      // }

      // console.log('payload', payload);
      // return payload;

      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log('data', data);

      //     if (data.choices.length > 0) {
      //       // cover.choose.pending = cover.choose.pending.filter(
      //       //   (key) => key != id
      //       // );
      //       payload = data.choices[0].variations[0].payload.data;
      //       console.debug('return', payload);
      //       return payload;
      //       // cover.choose.history[id] = payload;
      //       // console.debug('return true');
      //       // return true;
      //       // return payload;
      //     }

      //     // console.debug('return false');
      //     // return false;
      //   });
      // // }
      // }
    },
    history: {},
    pending: [],
    promises: {},
  },
  run() {
    cover.waitFor('.js-page', () => {
      document.dispatchEvent(
        new Event(`virtualpageview`, {
          bubbles: false,
        })
      );
    });
    document.addEventListener('virtualpageview', function () {
      cover.waitFor(
        '.ItemTeaser',
        async (element) => {
          console.log('loading - opacity 0');
          element.style.opacity = '0.5';

          // Promise.all([
          //   cover.choose.experiment('T1337'),
          //   cover.choose.promises['T1337'],
          // ]).then((values) => {
          //   console.log('values', values);
          // });

          // console.debug('func', cover.choose.experiment('T1337'));
          // console.debug('prom', cover.choose.promises['T1337']);

          cover.choose.promises['T1337'] = cover.choose.experiment('T1337');

          await cover.choose.promises['T1337'];
          console.debug('prom after await', cover.choose.promises['T1337']);

          if (await cover.choose.promises['T1337']) {
            console.log('variant1 - remove');
            element.style.opacity = '0.1';
            //element.remove();
          } else {
            console.log('original - opacity 1');
            element.style.opacity = '0.8';
          }

          // if (
          //   (await cover.choose.experiment('T1337')) &&
          //   (await cover.choose.promises['T1337'])
          // ) {
          //   console.log('await promise true');

          //   if (cover.choose.history.T1337) {
          //     console.log('variant1 - remove');
          //     element.style.opacity = '0.2';
          //     //element.remove();
          //   } else {
          //     console.log('original - opacity 1');
          //     element.style.opacity = '0.8';
          //   }
          // }
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
              if (cover.choose.experiment('T84')) {
                console.log('variant1');
              } else {
                console.log('original');
              }
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
              if (cover.choose.experiment('T84')) {
                console.log('variant1');
              } else {
                console.log('original');
              }
            }
          },
          {
            init: true,
          }
        );
      }
    });
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

cover.run();
document.dispatchEvent(
  new Event(`virtualpageview`, {
    bubbles: false,
  })
);
