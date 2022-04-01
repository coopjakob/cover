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

      if (options.querySelectorAll) {
        elements = [...wrapper.querySelectorAll(selector)];
      } else {
        const selectorElement = wrapper.querySelector(selector);
        if (selectorElement) {
          elements.push(selectorElement);
        }
      }

      if (wrapper.matches(selector)) {
        elements.push(wrapper);
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

    // init == undefined or true (default true)
    if (options.init != false) {
      matchElementSelector(wrapperElement);
    }

    if (!(options.disconnect && isCallbackSent)) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            // Alternative to `node.nodeType === 1`
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
  readyHistory: [],
  addIdentifierClasses: (element, id) => {
    element.classList.add('Experiment', id);
  },
  groups: () => {
    return DYO.getUserObjectsAndVariations();
  },
  run: () => {
    if (window.location.pathname.startsWith('/handla/')) {
      cover.waitFor('.Bar--extendedHeader', (element) => {
        const searchInput = document.querySelector('.Search-input');
        searchInput.addEventListener('click', () => {
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'experiment',
            eventAction: 'click',
            eventLabel: 'prominent-search',
          });
          DY.API('event', {
            name: 'T91-click',
          });
        });

        cover.variantReady('T91', () => {
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
        });
      });

      cover.waitFor(
        '.SidebarNav--online',
        (element) => {
          const item = element.querySelector('[data-id="81293"]');

          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async (entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();

                cover.variantReady('T108', () => {
                  item.remove();
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
          '[data-list="Varor som ingår i erbjudandet"]',
          (element) => {
            element.classList.add('u-hidden');

            const title = element.previousElementSibling;
            title.classList.remove('u-flex');
            title.classList.add('u-hidden');
          }
        );
      }
    } // pageview();

    if (window.location.pathname === '/') {
      let experimentListenOnSearchInputOnce = false;
      cover.waitFor(
        '.u-paddingVsm.u-paddingHsm.u-textSmall.u-bgGrayLight.u-colorBlack',
        (element) => {
          cover.variantReady('T97', () => {
            const bar = element;

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
                    location.href = (<HTMLAnchorElement>event.target).href;
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

    if (
      window.location.pathname.startsWith('/butiker-erbjudanden/') &&
      !coopUserSettings.isAuthenticated
    ) {
      cover.variantReady('T96', () => {
        const container = document.createElement('div');
        container.classList.add('Main-container', 'Main-container--padding');
        container.innerHTML = `
        
          <div class="Section Section--margin">
            <div class="Grid Grid--gutterA2xsm Grid--gutterH2xsm js-drOffersBlock">
              <div
                class="Grid-cell u-sizeFull u-paddingTmd u-lg-paddingBxsm u-lg-paddingTxlg u-bgWhite"
              >
                <h2
                  class="u-textXLarge u-md-text2XLarge u-marginHsm u-lg-marginHxlg u-marginBz"
                >
                  Veckans medlemserbjudanden
                </h2>
                <p class="u-marginHsm u-lg-marginHxlg u-marginVxxxsm">
                Gäller samtliga Coop-butiker t.o.m. 2022-04-03
                </p>
              </div>
        
              <div
                class="Grid-cell u-size1of2 u-xsm-size1of2 u-md-size1of4 u-lg-size1of6"
              >
              <article class="ItemTeaser" itemscope="" itemtype="http://schema.org/Product">
              <div class="ItemTeaser-content">
                  <div class="ItemTeaser-media">
                      <div class="ItemTeaser-image">
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1625092168/cloud/230148.png" alt="Mjukt bröd">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220328.1144#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre">2 för</span>
                                                  <span class="Splash-priceLarge">32:-</span>
                                                  <span class="Splash-pricePre"></span>
      
      
                                          </span>
                                      </p>
                                  </div>
      
                          </div>
                  </div>
                  <div class="ItemTeaser-info">
                      <h3 class="ItemTeaser-heading" data-id="7311070330328">Mjukt bröd</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">Pågen.</span>
                          500 g. Välj mellan lingongrova, lingongrova special och guldkorn. Jfr-pris 32:-/kg.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                                                          <p class="ItemTeaser-priceRules">Max 1 köp/medlem</p>
                                                          
                      <p style="display: none">
                          ItemID: 7311070330328<br>
                          EAGID: 2379<br>
                          Vecka: 13
                      </p>
                  </div>
              </div>
          </article>
              </div>
        
              <div
                class="Grid-cell u-size1of2 u-xsm-size1of2 u-md-size1of4 u-lg-size1of6"
              >
              <article class="ItemTeaser" itemscope="" itemtype="http://schema.org/Product">
              <div class="ItemTeaser-content">
                  <div class="ItemTeaser-media">
                      <div class="ItemTeaser-image">
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1624273240/220048.png" alt="Juice">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220328.1144#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre"></span>
                                                  <span class="Splash-priceLarge">12</span>
                                                      <span class="Splash-priceSupSub">
      
                                                              <span class="Splash-priceSup">90</span>
                                                              <span class="Splash-priceSub Splash-priceUnit ">/st</span>
                                                      </span>
                                                  <span class="Splash-pricePre"></span>
      
      
                                          </span>
                                      </p>
                                  </div>
      
                          </div>
                  </div>
                  <div class="ItemTeaser-info">
                      <h3 class="ItemTeaser-heading" data-id="7310860007372">Juice</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">God Morgon.</span>
                          1 liter. Välj mellan apelsin och apelsin/röd grapefrukt. Jfr-pris 12:90/lit.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                                                          <p class="ItemTeaser-priceRules">Max 2 köp/medlem</p>
                      <p style="display: none">
                          ItemID: 7310860007372<br>
                          EAGID: 7842<br>
                          Vecka: 13
                      </p>
                  </div>
              </div>
          </article>
              </div>
        
              <div
                class="Grid-cell u-size1of2 u-xsm-size1of2 u-md-size1of4 u-lg-size1of6"
              >
              <article class="ItemTeaser" itemscope="" itemtype="http://schema.org/Product">
              <div class="ItemTeaser-content">
                  <div class="ItemTeaser-media">
                      <div class="ItemTeaser-image">
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1605887215/412682.png" alt="Läsk">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220328.1144#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre"></span>
                                                  <span class="Splash-priceLarge">10:-</span>
                                                      <span class="Splash-priceSupSub">
      
                                                              <span class="Splash-priceSup Splash-priceNoDecimal">&nbsp;</span>
                                                              <span class="Splash-priceSub Splash-priceUnitNoDecimal ">/st</span>
                                                      </span>
                                                  <span class="Splash-pricePre"></span>
      
      
                                          </span>
                                      </p>
                                  </div>
      
                          </div>
                  </div>
                  <div class="ItemTeaser-info">
                      <h3 class="ItemTeaser-heading" data-id="7310070004505">Läsk</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">Pepsi/Zingo/7Up/Pommac.</span>
                          140-150 cl. Välj mellan olika sorter. Jfr-pris 6:67/lit.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                                                          <p class="ItemTeaser-priceRules">Max 3 köp/medlem</p>
                                          <p class="ItemTeaser-priceRules">Pant tillkommer.</p>
                      <p style="display: none">
                          ItemID: 7310070004505<br>
                          EAGID: 2189<br>
                          Vecka: 13
                      </p>
                  </div>
              </div>
          </article>
              </div>
        
              <div
                class="Grid-cell u-size1of2 u-xsm-size1of2 u-md-size1of4 u-lg-size1of6"
              >
              <article class="ItemTeaser" itemscope="" itemtype="http://schema.org/Product">
              <div class="ItemTeaser-content">
                  <div class="ItemTeaser-media">
                      <div class="ItemTeaser-image">
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1628670846/cloud/231887.png" alt="Tvättmedel">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220328.1144#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre">3 för</span>
                                                  <span class="Splash-priceLarge">89:-</span>
                                                  <span class="Splash-pricePre"></span>
      
      
                                          </span>
                                      </p>
                                  </div>
      
                          </div>
                  </div>
                  <div class="ItemTeaser-info">
                      <h3 class="ItemTeaser-heading" data-id="8435495810667">Tvättmedel</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">A+.</span>
                          Välj mellan flytande tvättmedel och refill. 880–920 ml. Jfr-pris 1:35/tvätt/disk.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                      <p style="display: none">
                          ItemID: 8435495810667<br>
                          EAGID: 29603<br>
                          Vecka: 13
                      </p>
                  </div>
              </div>
          </article>
              </div>
        
              <div class="Grid-cell u-lg-size2of6 Banner-cell u-bgGreen">
                  <a
                    class="Banner-link"
                    href="https://www.coop.se/logga-in/?returnUrl=%2Fbutiker-erbjudanden%2F"
                  ></a>
                  <div
                    class="Banner-content u-textCenter Banner-content--VerticalCenter"
                  >
                    <div class="Banner-text">
                      <h2 class="Banner-heading u-textFamilySecondary u-colorWhite">
                        Ännu fler erbjudanden och lättare att hitta
                      </h2>
        
                      <div class="Editorial-no-top-margin u-colorWhite">
                        <p></p>
                        <p class="p1">
                          När du är inloggad kan du spara dina favoritbutiker och får
                          dessutom personliga erbjudanden.
                        </p>
                        <p></p>
                      </div>
                    </div>
                    <div class="Banner-button">
                      <a
                        class="u-zIndex4 Button Button--greenDark Button--radius"
                        href="https://www.coop.se/logga-in/?returnUrl=%2Fbutiker-erbjudanden%2F"
                        >Logga in</a
                      >
                    </div>
                  </div>
              </div>
            </div>
          </div>
        `;

        container.querySelectorAll('a').forEach((element) => {
          element.addEventListener('click', (event) => {
            event.preventDefault();
            dataLayer.push({
              event: 'interaction',
              eventCategory: 'experiment',
              eventAction: 'click',
              eventLabel: 'login',
            });
            setTimeout(() => {
              location.href = (<HTMLAnchorElement>event.target).href;
            }, 100);
          });
        });

        const header = document.querySelector('h1');
        const element = header.closest('.Section').parentNode;

        element.parentNode.insertBefore(container, element.nextSibling);
      });
    }

    if (window.location.pathname.startsWith('/recept/')) {
      cover.waitFor(
        '.Button.Button--green.Button--medium.Button--radius',
        (element) => {
          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(async (entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();

                cover.variantReady('T109', () => {
                  element.innerHTML = 'Handla varor';

                  element.addEventListener('click', () => {
                    dataLayer.push({
                      event: 'interaction',
                      eventCategory: 'experiment',
                      eventAction: 'click',
                      eventLabel: 'recept-buy-cta',
                    });
                  });
                });
              }
            });
          });
          observer.observe(element);
        },
        {
          content: 'Köp varor',
          querySelectorAll: true,
        }
      );
    }

    if (window.location.pathname === '/handla/betala/') {
      if (!coopUserSettings.isCompany) {
        cover.waitFor('.CheckoutCartSummary', (element) => {
          cover.variantReady('T113', () => {
            (function run() {
              const items = element.querySelectorAll('li');

              let content = false;

              const block = document.createElement('li');
              block.classList.add(
                'T113',
                'u-paddingVxxsm',
                'u-textMedium',
                'u-paddingHmd'
              );
              block.innerHTML = `
                <section
                  class="InformationBox"
                  style="background-color: #F5F3EB"
                  aria-label=""
                >
                  <svg
                    role="img"
                    class="InformationBox-icon u-fillGreen"
                    style="height: 1rem; width: 1rem; margin-left: 5px"
                  >
                    <use
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xlink:href="/assets/build/sprite.svg?v=220329.1219#info2"
                    ></use>
                  </svg>
                  <p class="InformationBox-text u-textSmall">
                    <strong>Fri frakt</strong> vid köp över 2000 kr
                  </p>
                </section>
              `;

              for (const item of items) {
                const text = item.textContent;

                if (text.startsWith('Plockavgift')) {
                  break;
                }

                if (text.startsWith('Frakt')) {
                  content = true;
                }

                if (text === 'Fri frakt vid köp över 2000kr') {
                  block.querySelector<HTMLElement>(
                    '.InformationBox'
                  ).style.backgroundColor = '#e0efdd';
                  block.querySelector('.InformationBox-icon').innerHTML =
                    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220329.1219#check2"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220329.1219#check"></use></use>';

                  item.classList.remove('u-flex');
                  item.style.display = 'none';
                }
              }

              if (content) {
                element.querySelector('.T113')?.remove();
                element.firstElementChild.append(block);
              }

              let observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  observer.disconnect();
                  run();
                });
              });

              observer.observe(element.querySelector('div.u-paddingLsm'), {
                childList: true,
              });
            })();
          });
        });
      }
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
                  element.innerText = 'Ersätt med likvärdig vara om slut';
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

    if (window.location.pathname === '/mitt-coop/mina-poang/') {
      cover.waitFor(
        '.TransactionTable-footer',
        (loaded) => {
          cover.variantReady('T98', () => {
            const component = loaded.closest(
              '[data-react-component="MyPointsTransactions"]'
            );

            const section = component.querySelector<HTMLElement>('.Section');
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
