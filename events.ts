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
                Gäller samtliga Coop-butiker t.o.m. 2022-04-10
                </p>
              </div>
        
              <div
                class="Grid-cell u-size1of2 u-xsm-size1of2 u-md-size1of4 u-lg-size1of6"
              >
              <article class="ItemTeaser" itemscope="" itemtype="http://schema.org/Product">
        <div class="ItemTeaser-content">
            <div class="ItemTeaser-media">
                <div class="ItemTeaser-image">
                    

                        <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1553696556/368856.png" alt="Påsklilja/Vårlilja">
                </div>
                    <div class="ItemTeaser-promos">

                            <div class="ItemTeaser-splash">
                                <p class="Splash">
                                    
                                    <svg role="presentation" class="Splash-bg">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220401.0833#splash"></use>
                                    </svg>
                                    <span class="Splash-content ">
                                            <span class="Splash-pricePre"></span>
                                            <span class="Splash-priceLarge">25:-</span>
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
                <h3 class="ItemTeaser-heading" data-id="7315800822336">Påsklilja/Vårlilja</h3>
                <p class="ItemTeaser-description">
                        <span class="ItemTeaser-brand">Sverige/Spira.</span>
                    Odlade i Sverige. 13 cm kruka. Välj mellan stor- och småblommig påsklilja Carlton/Tête-à-tête. Jfr-pris 25:-/st. Latin: Narcissus Tetate.
                </p>
                    <div class="ItemTeaser-cta">
                            <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                    </div>
                                                                                <p style="display: none">
                    ItemID: 7315800822336<br>
                    EAGID: 13886<br>
                    Vecka: 14
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
                    

                        <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1529974034/302744.png" alt="Juice">
                </div>
                    <div class="ItemTeaser-promos">

                            <div class="ItemTeaser-splash">
                                <p class="Splash">
                                    
                                    <svg role="presentation" class="Splash-bg">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220401.0833#splash"></use>
                                    </svg>
                                    <span class="Splash-content ">
                                            <span class="Splash-pricePre"></span>
                                            <span class="Splash-priceLarge">19</span>
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
                <h3 class="ItemTeaser-heading" data-id="7310867561006">Juice</h3>
                <p class="ItemTeaser-description">
                        <span class="ItemTeaser-brand">Bravo.</span>
                    2 liter. Välj mellan olika sorter. Jfr-pris 9:95/lit.
                </p>
                    <div class="ItemTeaser-cta">
                            <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                    </div>
                                                    <p class="ItemTeaser-priceRules">Max 2 köp/medlem</p>
                <p style="display: none">
                    ItemID: 7310867561006<br>
                    EAGID: 167<br>
                    Vecka: 14
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
                    

                        <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1631118057/cloud/233879.png" alt="Cheddarost i bit 32%">
                </div>
                    <div class="ItemTeaser-promos">

                            <div class="ItemTeaser-splash">
                                <p class="Splash">
                                    
                                    <svg role="presentation" class="Splash-bg">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220401.0833#splash"></use>
                                    </svg>
                                    <span class="Splash-content ">
                                            <span class="Splash-pricePre"></span>
                                            <span class="Splash-priceLarge">79:-</span>
                                                <span class="Splash-priceSupSub">

                                                        <span class="Splash-priceSup Splash-priceNoDecimal">&nbsp;</span>
                                                        <span class="Splash-priceSub Splash-priceUnitNoDecimal ">/kg</span>
                                                </span>
                                            <span class="Splash-pricePre"></span>


                                    </span>
                                </p>
                            </div>

                    </div>
            </div>
            <div class="ItemTeaser-info">
                <h3 class="ItemTeaser-heading" data-id="2340302100007">Cheddarost i bit 32%</h3>
                <p class="ItemTeaser-description">
                        <span class="ItemTeaser-brand">Kvibille.</span>
                    Ca 500-1400 g. I bit. Lagrad 6 månader. Välj mellan olika sorter. Jfr-pris 79:-/kg.
                </p>
                    <div class="ItemTeaser-cta">
                            <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                    </div>
                                                    <p class="ItemTeaser-priceRules">Max 2 köp/medlem</p>
                <p style="display: none">
                    ItemID: 2340302100007<br>
                    EAGID: 5208<br>
                    Vecka: 14
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
                    

                        <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1633367161/cloud/235418.png" alt="Vetemjöl 2 kg">
                </div>
                    <div class="ItemTeaser-promos">

                            <div class="ItemTeaser-splash">
                                <p class="Splash">
                                    
                                    <svg role="presentation" class="Splash-bg">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220401.0833#splash"></use>
                                    </svg>
                                    <span class="Splash-content ">
                                            <span class="Splash-pricePre"></span>
                                            <span class="Splash-priceLarge">14</span>
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
                <h3 class="ItemTeaser-heading" data-id="7310130006029">Vetemjöl 2 kg</h3>
                <p class="ItemTeaser-description">
                        <span class="ItemTeaser-brand">Kungsörnen.</span>
                    2 kg. Jfr-pris 7:45/kg.
                </p>
                    <div class="ItemTeaser-cta">
                            <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                    </div>
                                                    <p class="ItemTeaser-priceRules">Max 2 köp/medlem</p>
                <p style="display: none">
                    ItemID: 7310130006029<br>
                    EAGID: 5152<br>
                    Vecka: 14
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

    cover.waitFor(
      '.ProfileMenu',
      (element) => {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              observer.disconnect();

              cover.variantReady('T115', () => {
                const style = document.createElement('style');
                style.innerHTML = `
                  .ProfileMenu--dropdown .ProfileMenu-header {
                    display: none!important;
                  }
                  .ProfileMenu--dropdown {
                    width: 375px!important;
                    padding: 20px;
                    background: white;
                  }
                  .ProfileMenu--dropdown .icons {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin: 12px;
                    gap: 5px;
                    color: #333333;
                    font-size: 12px;
                    font-weight: bold;
                  }
                  .ProfileMenu--dropdown .icons a {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    align-items: center;
                    text-align: center;
                  }
                `;
                document.head.appendChild(style);

                const icons = document.createElement('div');
                icons.classList.add('icons');
                icons.innerHTML = `
                    
                  <a href="/mitt-coop/mina-bestallningar/">
                    <svg
                      width="73"
                      height="73"
                      viewBox="0 0 73 73"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.797607"
                        y="0.23439"
                        width="72"
                        height="72"
                        rx="36"
                        fill="#E0EFDD"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.4793 48.9077C18.4508 49.3682 16.5092 50.1519 14.7285 51.2287C14.3307 51.4158 14.0157 51.7433 13.844 52.1486C13.5992 52.9458 14.3704 53.6479 15.0468 54.068C17.6116 55.6623 20.2988 57.0237 22.9798 58.3789C24.5499 59.1761 26.1567 59.9825 27.8767 60.1818C29.5968 60.3811 31.3168 59.9763 32.9971 59.544C38.7658 58.0593 44.4503 56.264 50.0261 54.1661C51.4156 53.6969 52.7449 53.065 53.9865 52.2835C54.7822 51.7469 56.3033 51.3177 55.8779 50.4254C55.6269 49.9042 51.1585 48.0369 50.7514 47.6659C48.0918 45.213 50.5433 45.3939 47.5195 45.0567"
                        fill="url(#paint0_linear_2077_20991)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M55.3421 43.5606C55.6359 42.4752 55.942 41.3919 56.2603 40.3106L50.8523 41.1261L34.0559 45.5229L29.1375 46.964L18.1195 41.2795C18.3368 41.3929 18.5388 41.9785 18.7163 42.7113C19.0223 44.0022 19.2611 45.7468 19.3682 46.1638C19.7946 47.8358 20.2211 49.5048 20.6475 51.1707C20.9536 52.3972 20.9811 54.0253 22.2604 54.6201C23.7234 55.31 25.1098 56.1961 26.5054 57.0086C28.0969 57.9284 30.0924 59.7221 32.0145 59.3787C33.9365 59.0353 35.9932 58.0327 37.903 57.4256C40.0556 56.7367 42.2082 56.055 44.3608 55.3805C46.8735 54.5894 49.371 53.78 51.8745 52.992C54.277 52.2316 54.1087 48.4603 54.629 46.3355C54.8586 45.4156 55.1003 44.4958 55.3452 43.576L55.3421 43.5606Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M29.1898 40.8038C31.0262 41.0705 32.8625 40.6535 34.6315 40.0648C38.4389 38.7985 42.2309 36.7166 46.1882 37.2777C48.412 37.6113 50.442 38.7343 51.9084 40.442L56.686 39.099L43.0022 32.6602C43.0022 32.6602 32.685 35.7937 24.9968 38.1792C25.9385 39.6319 27.4736 40.5928 29.1898 40.8038Z"
                        fill="#005537"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M28.036 46.4093L51.9575 39.995C50.4765 38.3737 48.4773 37.3208 46.3046 37.0178C42.3962 36.4905 38.6532 38.4528 34.8856 39.6485C33.1502 40.2035 31.317 40.599 29.5112 40.3476C27.8677 40.1177 26.2487 39.2622 25.3672 37.8733C21.211 39.0997 17.8352 40.1299 17.3332 40.3446L28.036 46.4093Z"
                        fill="url(#paint1_linear_2077_20991)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.6409 42.8122C24.9545 43.5088 30.3558 43.0444 35.4732 41.4508C38.4573 40.5003 41.5637 39.8442 44.4743 41.4508C44.6454 41.5331 44.7967 41.6512 44.9181 41.7973C45.4935 42.6037 43.5715 43.1188 43.1705 43.5388C42.283 44.4587 41.0587 45.0719 39.8253 45.5625C38.0441 46.2707 26.7047 48.9352 24.7979 49.2418"
                        fill="#003D23"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M50.8523 41.1261L34.0559 45.5229L29.1375 46.964L18.1195 41.2795C18.3368 41.3929 18.5388 41.9785 18.7163 42.7113L20.3812 42.9229C21.5351 42.8125 22.4838 43.8764 22.9888 44.9557C23.4938 46.035 23.7907 47.2706 24.5956 48.1322C25.4006 48.9938 26.6309 49.3587 27.4359 50.2478C28.5836 51.508 28.7703 53.6911 30.2852 54.4239C31.6992 55.1076 33.3183 54.0406 34.3772 52.8509C36.385 50.5912 37.952 47.519 40.8044 46.7187C43.3631 46.0135 46.0686 47.4423 48.6885 47.0437C51.1583 46.6697 53.1293 44.7534 55.3421 43.5606C55.6359 42.4752 55.942 41.3919 56.2603 40.3106L50.8523 41.1261Z"
                        fill="url(#paint2_linear_2077_20991)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M28.953 43.9467C28.953 43.9467 29.4396 44.0694 29.3998 44.8052L21.9207 42.6314L23.3101 40.8867L28.953 43.9467Z"
                        fill="#C6C5C4"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M43.9812 34.6695L54.231 38.6033L56.049 38.1035C57.0437 37.8276 58.6107 37.6436 57.9037 36.9967C56.2663 35.669 53.98 35.0252 52.0305 34.277C49.8881 33.4492 47.7457 32.6183 45.6033 31.7536C44.379 31.2508 43.1548 30.9871 41.9643 31.2784L31.3716 33.9551L23.5763 35.6966C22.0461 36.037 20.5158 36.1749 19.0069 36.5735C18.2571 36.7698 17.4215 36.9016 16.8155 37.4045C16.3473 37.7938 16.3901 38.1097 16.8155 38.542C17.2991 39.0295 19.5884 40.5166 20.323 40.3234L42.0683 34.5622C42.6974 34.3607 43.3785 34.3989 43.9812 34.6695Z"
                        fill="#007548"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.574 38.2107C16.574 38.2107 17.4126 41.2768 17.5625 41.3289C17.7125 41.3811 28.7612 47.5439 28.9111 47.5439C29.8849 47.8106 30.9122 47.8106 31.886 47.5439C33.551 47.0902 56.2481 40.3202 56.2481 40.3202L57.0041 40.0657L58.0447 37.4043C55.2014 38.1923 52.0246 39.2164 49.169 40.0044C44.9455 41.1756 40.578 42.1506 36.4371 43.558C34.536 44.232 32.5593 44.6686 30.5516 44.858C28.8254 44.9991 27.185 43.8769 25.6853 43.1471L22.7961 41.7337L16.574 38.2107Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M43.865 23.2507C43.2131 22.9808 42.4999 22.8122 41.845 22.573C41.0645 22.291 40.2872 21.9966 39.5098 21.6992C38.0183 21.1248 36.5308 20.5371 35.0475 19.9362C34.4353 19.694 33.8232 19.4487 33.2264 19.1942C30.8759 18.1885 30.3066 20.114 30.3464 20.5647C30.3311 20.7105 30.3311 20.8574 30.3464 21.0032C30.3464 21.0032 30.2332 35.1594 30.3036 35.7205C30.3036 35.7205 30.3036 36.8488 30.9157 36.7845C31.7849 36.6986 31.6533 35.3066 31.6533 35.3066C31.7023 33.4669 31.7482 31.6181 31.791 29.76C31.8257 28.2964 31.8553 26.8339 31.8798 25.3724C31.892 24.7387 31.9012 24.103 31.9073 23.4653C31.8645 22.7963 31.8706 22.1251 31.9257 21.457C31.9505 21.195 32.0783 20.9536 32.281 20.7862C32.4837 20.6188 32.7446 20.5391 33.0061 20.5647C33.0724 20.5708 33.138 20.5831 33.2019 20.6015C34.1477 20.8468 35.0046 21.3374 35.9014 21.7145C36.7981 22.0917 37.7102 22.4719 38.6161 22.8459C39.8219 23.3488 41.0278 23.8945 42.2673 24.3146C43.2804 24.6611 44.0394 25.3755 44.1618 26.4609C44.196 26.9825 44.1796 27.5062 44.1129 28.0246C43.8527 31.06 43.5405 41.8221 43.5405 41.8221C43.5405 41.8221 43.4089 43.1221 44.1527 43.0884C45.0372 43.0485 44.979 41.4449 44.979 41.4449L45.9523 27.9173C46.0686 26.3106 45.9951 24.4035 44.422 23.5113C44.2414 23.4254 44.0547 23.3334 43.865 23.2507Z"
                        fill="#333333"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M30.974 35.4902C30.8937 35.5023 30.8241 35.5526 30.7874 35.6252C30.7535 35.6982 30.7358 35.7777 30.7354 35.8582C30.7287 35.9248 30.7415 35.9919 30.7721 36.0513C30.8069 36.1041 30.8571 36.1448 30.9159 36.1679C30.9515 36.1842 30.99 36.1936 31.0291 36.1955C31.0652 36.195 31.1007 36.1866 31.1332 36.1709C31.2849 36.1035 31.3697 35.9398 31.3375 35.7766C31.3052 35.6135 31.1644 35.4946 30.9985 35.4902"
                        fill="#007548"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M44.2601 41.8963C44.0945 41.8625 43.9329 41.9696 43.8991 42.1355C43.8653 42.3014 43.9722 42.4633 44.1377 42.4972C44.3033 42.5311 44.465 42.424 44.4988 42.2581C44.5154 42.1774 44.4988 42.0935 44.4529 42.0251C44.4041 41.9598 44.3385 41.9089 44.2632 41.8779"
                        fill="#00AA46"
                      />
                      <path
                        opacity="0.31"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.816 51.9838C22.7013 53.1918 24.4397 54.5931 24.4428 54.5961C24.5254 54.6483 26.2271 52.6583 26.3648 52.4039C26.9053 51.3995 27.2609 50.3059 27.4146 49.1752C27.5431 48.2064 27.3779 47.2068 27.7421 46.2778C28.0298 45.548 28.4307 44.9103 29.3428 44.7692C29.0818 44.7062 28.8244 44.6294 28.5715 44.5393L22.7166 42.1385C22.7166 42.1385 20.2896 40.9427 19.4724 44.6251"
                        fill="#7A7B7B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M22.1016 40.1359C22.1016 40.1359 19.1267 38.0264 17.5352 41.7456C16.2651 44.7106 15.0867 46.7465 14.1502 46.8292L22.8636 53.1025C22.8636 53.1025 25.6671 50.3614 26.0772 47.3382C26.5853 43.6098 28.9542 43.9502 28.9542 43.9502L22.1016 40.1359Z"
                        fill="#EDEDED"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.8096 46.3627C17.9878 47.2457 19.1445 48.0491 20.3227 48.9321C20.4974 49.0755 20.6803 49.2086 20.8705 49.3307C20.9837 49.4012 21.1765 49.5116 21.1489 49.6373C21.0816 49.6894 20.9562 49.5944 20.8705 49.5423C19.9065 48.9781 19.1262 48.2545 18.1989 47.629C17.945 47.4573 17.6818 47.3009 17.437 47.12C17.3064 47.0255 17.1818 46.9231 17.0636 46.8134C16.9437 46.7163 16.8404 46.6003 16.7576 46.47C16.7178 46.4056 16.7209 46.3106 16.8096 46.3627Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.5471 45.2076C17.5104 45.2812 17.59 45.3548 17.6573 45.4007L22.5046 48.5128C22.7188 48.6508 22.9055 48.8195 23.1166 48.9452C23.1717 48.982 23.2941 49.0341 23.3186 48.9912C23.2819 48.7459 23.0493 48.6202 22.8412 48.4853L18.0918 45.3486C17.9296 45.2505 17.6451 45.0849 17.5471 45.2076Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M18.2573 43.846C18.6826 44.0974 19.0529 44.4592 19.4813 44.7045C19.7078 44.8456 19.9159 44.9713 20.1515 45.1C20.3421 45.2041 20.5215 45.3274 20.6871 45.468C20.7911 45.5538 20.9227 45.6397 20.8584 45.7746C20.7942 45.9095 19.5242 44.9069 18.8081 44.5052C18.5915 44.3759 18.3963 44.2135 18.2297 44.0238C18.2169 44.0109 18.2056 43.9965 18.1961 43.9809C18.1685 43.9288 18.193 43.8153 18.2573 43.846Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.0499 43.0606C19.7813 43.4714 20.4515 43.9804 21.1522 44.4434C21.2461 44.5086 21.3493 44.5592 21.4583 44.5936C21.6908 44.658 21.4246 44.3545 21.3511 44.3054C20.9431 44.0377 20.5422 43.774 20.1485 43.5144L19.5365 43.1158C19.4263 43.0453 19.3314 42.9502 19.2305 42.8828C19.1782 42.8428 19.1175 42.8155 19.053 42.803C18.8602 42.7938 18.9734 43.0115 19.0499 43.0606Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.5397 41.4449L19.5764 41.4695C19.7468 41.5921 19.9236 41.7057 20.1059 41.8098L20.7026 42.1808L21.8838 42.9136C22.9182 43.5575 23.9504 44.2065 24.9807 44.8606C25.0939 44.9311 25.2867 45.0629 25.2561 45.1427C25.1643 45.2806 22.3031 43.3521 20.7699 42.5518C20.4501 42.3954 20.1431 42.214 19.8519 42.0091C19.689 41.9108 19.5424 41.7877 19.4173 41.6442C19.3837 41.586 19.3684 41.4296 19.5061 41.4357L19.5397 41.4449Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.7914 40.933C20.8526 40.9882 20.9352 41.0312 20.9903 41.0741C21.098 41.16 21.2104 41.2398 21.3269 41.3132C21.4582 41.3892 21.5941 41.4568 21.7339 41.5156C21.8563 41.5739 21.9726 41.6413 22.0919 41.7026C22.1428 41.7325 22.196 41.7581 22.2511 41.7793C22.4745 41.8651 22.2296 41.5923 22.1593 41.5493L20.8801 40.7491C20.8097 40.7061 20.6904 40.6878 20.7149 40.8135C20.7273 40.8603 20.7541 40.9021 20.7914 40.933Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M26.6736 47.6662C26.6215 47.6508 26.594 47.7275 26.594 47.7827C26.6004 50.4519 26.7465 53.119 27.0316 55.773C27.0347 55.9133 27.0737 56.0506 27.1448 56.1716C27.157 55.3183 27.1141 54.4652 27.0163 53.6175C26.9765 53.2771 26.9276 52.9368 26.9061 52.5965C26.8786 52.155 26.9061 51.7104 26.9061 51.2688C26.8908 50.1744 26.8204 49.0815 26.695 47.9942C26.6867 47.8832 26.6724 47.7726 26.6521 47.6631"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M29.3797 48.1475L29.6154 53.9332C29.6235 54.5769 29.6838 55.2188 29.7959 55.8526C29.9214 55.8312 29.9428 55.6656 29.9397 55.546L29.6154 48.2425C29.6154 48.1414 29.5327 48.0003 29.4501 48.0586"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.2478 47.4022V51.848C33.2478 53.6141 33.2478 55.3925 33.5967 57.1248C33.563 55.5212 33.2906 53.9238 33.3825 52.3263C33.4008 52.0197 33.4314 51.6886 33.4437 51.3697C33.4773 50.2261 33.2294 49.0763 33.3794 47.9418C33.4069 47.7364 33.4284 47.4819 33.26 47.3623"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M38.3281 46.029C37.8782 47.5805 37.8905 49.2209 37.7007 50.8275C37.6181 51.5204 37.4987 52.2103 37.4253 52.9063C37.3304 53.8262 37.3243 54.7859 37.3213 55.7241C37.3114 55.8795 37.3248 56.0356 37.361 56.1871C37.4712 54.5099 37.7925 52.8511 37.918 51.174C37.9455 50.8306 37.9639 50.4841 37.9853 50.1376C38.0766 48.8575 38.2556 47.5851 38.5208 46.3295C38.5636 46.1914 38.5699 46.0446 38.5392 45.9033"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M42.2 44.8764C41.5524 47.8593 41.1309 50.887 40.9392 53.9336C40.9086 54.349 40.9086 54.7661 40.9392 55.1815C40.9312 55.2606 40.9663 55.3379 41.031 55.3839C41.2167 53.2642 41.4441 51.1496 41.7134 49.0401C41.851 47.7454 42.0873 46.463 42.4203 45.2044C42.4601 45.0695 42.4815 44.8978 42.3561 44.8242"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M46.0476 43.7505C45.8915 44.3637 45.6743 44.9432 45.5182 45.5503C45.0653 47.3011 45.1296 49.1407 44.8419 50.9252C44.7002 51.6127 44.598 52.3078 44.5359 53.0071C44.5359 53.1114 44.5359 53.234 44.6338 53.2831C44.796 52.4215 44.9123 51.5538 45.0316 50.6861C45.3103 48.3832 45.7107 46.0967 46.2312 43.8364C46.2312 43.7842 46.2312 43.7076 46.1914 43.6953"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M50.1209 42.5586C49.8511 43.3886 49.6324 44.2344 49.466 45.0912C48.9948 47.3601 48.6306 49.6475 48.2664 51.9348C48.2389 52.1034 48.2267 52.3058 48.3613 52.41C48.4428 52.1309 48.5032 51.8459 48.5419 51.5576C49.0254 48.5406 49.6374 45.546 50.378 42.5739"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M54.142 41.2861C53.3378 44.8276 52.7249 48.4099 52.3059 52.0175C52.2754 52.144 52.2963 52.2775 52.3641 52.3885C52.5783 51.4687 52.6701 50.5213 52.8047 49.58C53.1564 46.8623 53.6528 44.1654 54.292 41.5008"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24.9661 50.3427L28.3322 52.7496C28.8249 53.0991 29.3176 53.4456 29.8256 53.7675C29.8256 53.5192 29.6053 53.3321 29.4033 53.1849L25.1007 50.082"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M29.7957 53.366C30.4079 53.1729 31.0353 53.0042 31.6627 52.854C31.9994 52.7743 32.3391 52.7007 32.6727 52.6179C34.3407 52.204 35.9352 51.5386 37.6033 51.1247C37.6367 51.1186 37.6709 51.1186 37.7043 51.1247C37.7808 51.1462 37.7991 51.2565 37.7563 51.3271C37.7068 51.3903 37.638 51.4355 37.5604 51.4558C36.8477 51.6954 36.121 51.891 35.3843 52.0415C33.4684 52.5259 31.6413 53.3967 29.6794 53.6358"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M37.8418 51.1061C39.9871 50.2764 42.1743 49.56 44.3945 48.9598L44.9821 48.7881C45.0555 48.7666 45.1688 48.7728 45.1688 48.8494C45.1632 48.8821 45.1444 48.9109 45.1168 48.9291C44.9049 49.0794 44.6641 49.1838 44.4098 49.2357C43.0937 49.6282 41.7869 50.0513 40.48 50.4775L39.4792 50.8087L37.551 51.4219"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M45.224 48.6902C46.1881 48.3406 47.1338 47.9451 48.0887 47.5649C50.225 46.7084 52.3888 45.9296 54.5802 45.2285C54.6196 45.305 54.6047 45.3982 54.5434 45.4585C54.4817 45.5144 54.4086 45.5563 54.3292 45.5811L47.0603 48.3836C46.4238 48.6503 45.7667 48.8646 45.0955 49.0244"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.2755 26.09C16.6013 28.9721 18.8872 31.8236 21.1885 34.7241C21.2741 34.8315 21.3598 34.9817 21.2772 35.089C21.1364 35.1687 20.9712 34.9633 20.8824 34.8376C19.0463 32.6034 17.2602 30.3355 15.5241 28.0339C15.062 27.4207 14.6275 26.8504 14.196 26.2218C14.196 26.2218 14.1042 26.1084 14.1807 26.0563C14.1957 26.0404 14.2185 26.0349 14.239 26.0422C14.2596 26.0495 14.2739 26.0682 14.2755 26.09Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.4508 22.0033C21.3879 25.3392 23.5331 28.5495 25.7548 31.7014C25.9445 31.9682 26.2015 32.4097 26.1465 32.5875C25.9751 32.7194 25.767 32.3944 25.6415 32.2196C23.4994 29.2731 21.3573 26.3051 19.7385 23.0213C19.6008 22.7453 19.4692 22.4632 19.3468 22.1781C19.3468 22.1781 19.2397 22.0033 19.3009 21.942C19.3621 21.8807 19.4508 22.0033 19.4508 22.0033Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M34.5309 12.5408C34.5655 12.5787 34.586 12.6274 34.589 12.6788L34.8552 14.6073L35.1245 16.5267L35.2469 17.4128C35.2745 17.6029 35.299 17.793 35.3265 17.9862C35.3265 18.0751 35.3602 18.1671 35.3663 18.256C35.3663 18.2744 35.3663 18.2989 35.3479 18.3051C35.2775 18.3265 35.2102 18.1763 35.1888 18.1303C35.1393 17.9893 35.1005 17.8448 35.0725 17.698L34.9532 17.2411C34.8736 16.9345 34.8002 16.6279 34.7298 16.3213C34.5911 15.7075 34.4889 15.0861 34.4238 14.4602C34.3901 14.1536 34.3717 13.847 34.3656 13.5403V12.8474C34.3631 12.7714 34.3682 12.6954 34.3809 12.6205C34.3918 12.5838 34.4094 12.5495 34.4329 12.5193C34.4697 12.4703 34.5309 12.5408 34.5309 12.5408Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M43.1701 12.2496C43.2129 12.3018 43.1701 12.4428 43.1486 12.5011C43.1242 12.6237 43.1089 12.7463 43.0874 12.869C43.0354 13.1756 42.9681 13.4638 42.8916 13.7582C42.7355 14.3468 42.5427 14.9263 42.3591 15.5058C42.2459 15.8523 42.1357 16.2018 42.0378 16.5544C41.6094 18.0875 40.8841 21.1536 40.7342 21.1536C40.5291 21.1168 40.7831 20.338 40.8872 19.9272L41.3584 18.1335C41.8511 16.2448 42.3377 14.3744 42.9742 12.5256C42.9987 12.452 43.0354 12.3876 43.0721 12.2864C43.0813 12.2496 43.1333 12.2128 43.1701 12.2496Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M60.7409 17.8242C60.744 17.8446 60.744 17.8652 60.7409 17.8856C60.6806 18.0296 60.5933 18.1607 60.4838 18.2719C60.3675 18.416 60.2451 18.557 60.1227 18.695C59.8442 19.0016 59.5534 19.3082 59.2596 19.6148C59.1678 19.713 59.076 19.808 58.9811 19.9031C55.6063 23.3228 52.309 26.8182 49.0893 30.3892C48.8965 30.6007 48.5507 31.0269 48.4588 30.9656C48.3364 30.8123 48.7649 30.3708 48.9822 30.1163C51.2266 27.5101 53.5363 24.9601 55.9113 22.4663C57.359 20.9333 58.8311 19.4431 60.3002 17.9408C60.3767 17.8702 60.6338 17.6035 60.7287 17.7507C60.7401 17.7734 60.7444 17.799 60.7409 17.8242Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M57.1419 29.4045C55.8728 30.3223 54.6414 31.2892 53.4478 32.3051C53.3008 32.4279 53.1608 32.5589 53.0285 32.6976C52.9489 32.7711 52.8724 32.8447 52.799 32.9244C52.7255 33.0042 52.6949 33.1697 52.8173 33.1452C52.949 33.1017 53.073 33.0375 53.1846 32.9551C53.4509 32.7957 53.7049 32.6209 53.9589 32.4461L54.0201 32.4032C54.4578 32.0966 54.8771 31.79 55.2872 31.4558C55.5045 31.2841 55.7157 31.1124 55.9299 30.9376L58.5896 28.7913L61.2614 26.6451L61.5675 26.4059C61.6134 26.3691 61.898 26.1974 61.7603 26.1729C61.709 26.1726 61.6585 26.1853 61.6134 26.2097C61.4353 26.2864 61.2642 26.3787 61.1023 26.4856C60.5453 26.8229 60.0158 27.2061 59.4955 27.5925C58.8834 28.0422 58.2855 28.5103 57.702 28.9968C57.4357 29.2175 57.1725 29.4413 56.9185 29.6774"
                        fill="#00AA46"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2077_20991"
                          x1="46.2952"
                          y1="52.8672"
                          x2="-7.44105"
                          y2="41.8195"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#969696" />
                          <stop offset="1" stop-color="white" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_2077_20991"
                          x1="13.8656"
                          y1="40.8384"
                          x2="41.9442"
                          y2="53.9681"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#003C1B" />
                          <stop offset="0.99" stop-color="#005537" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_2077_20991"
                          x1="49.3036"
                          y1="43.5679"
                          x2="39.1692"
                          y2="61.8062"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#00AA46" />
                          <stop offset="0.2" stop-color="#009F44" />
                          <stop offset="0.54" stop-color="#00823F" />
                          <stop offset="0.99" stop-color="#005537" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>Mina beställningar</span>
                  </a>
                  <a href="/mitt-coop/sparade-varukorgar/">
                    <svg
                      width="74"
                      height="72"
                      viewBox="0 0 74 72"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="0.797607" width="72" height="72" rx="36" fill="#E0EFDD" />
                      <g style="mix-blend-mode: multiply" opacity="0.5">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.2562 48.3661C15.6388 48.9604 13.1335 49.9717 10.8359 51.3613C10.3225 51.6027 9.91614 52.0253 9.69459 52.5483C9.37866 53.5771 10.3738 54.4832 11.2466 55.0253C14.5559 57.0828 18.0232 58.8396 21.4826 60.5884C23.5084 61.6172 25.5817 62.6578 27.8011 62.915C30.0205 63.1722 32.2398 62.6499 34.4079 62.092C41.8512 60.1759 49.1861 57.8592 56.3805 55.1519C58.1734 54.5464 59.8886 53.7309 61.4906 52.7224C62.5174 52.03 64.4801 51.4761 63.9311 50.3246C63.6073 49.652 57.8417 47.2423 57.3164 46.7636C53.8847 43.5982 57.0479 43.8316 53.1462 43.3964"
                          fill="url(#paint0_linear_2078_20992)"
                        />
                      </g>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M62.2163 39.4578C62.5954 38.0571 62.9903 36.6591 63.401 35.2637L56.423 36.3162L34.7505 41.9901L28.4043 43.8498L14.1877 36.514C14.4681 36.6604 14.7287 37.4161 14.9578 38.3618C15.3527 40.0276 15.6607 42.279 15.7989 42.8171C16.3491 44.9748 16.8994 47.1286 17.4496 49.2784C17.8445 50.8611 17.8801 52.9622 19.5308 53.7298C21.4184 54.62 23.2074 55.7635 25.0081 56.8121C27.0617 57.9991 29.6365 60.3138 32.1165 59.8706C34.5965 59.4275 37.2503 58.1336 39.7145 57.3502C42.492 56.4613 45.2695 55.5815 48.047 54.7111C51.2892 53.6902 54.5117 52.6456 57.742 51.6288C60.842 50.6475 60.6248 45.7807 61.2962 43.0387C61.5923 41.8516 61.9043 40.6646 62.2202 39.4776L62.2163 39.4578Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M28.4714 35.9007C30.8409 36.2449 33.2103 35.7068 35.4929 34.9471C40.4055 33.313 45.2984 30.6264 50.4046 31.3505C53.2739 31.781 55.8933 33.2301 57.7854 35.4338L63.9499 33.7008L46.2936 25.3916C46.2936 25.3916 32.9813 29.4354 23.0612 32.5137C24.2763 34.3885 26.257 35.6285 28.4714 35.9007Z"
                        fill="#005537"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M26.9826 43.1336L57.8485 34.8561C55.9376 32.7638 53.3581 31.4051 50.5546 31.0141C45.5116 30.3335 40.6819 32.8659 35.8206 34.409C33.5815 35.1252 31.216 35.6356 28.886 35.3111C26.7654 35.0144 24.6763 33.9104 23.539 32.118C18.1761 33.7007 13.8203 35.0302 13.1727 35.3072L26.9826 43.1336Z"
                        fill="url(#paint1_linear_2078_20992)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.2539 37.9703C26.1101 38.8694 29.9757 38.7923 36.5787 36.7358C40.4291 35.5092 44.4374 34.6624 48.193 36.7358C48.4136 36.8419 48.6089 36.9944 48.7656 37.1829C49.508 38.2235 47.028 38.8882 46.5107 39.4303C45.3654 40.6173 43.7858 41.4087 42.1943 42.0417C39.896 42.9558 27.1223 44.8756 24.662 45.2712"
                        fill="#003D23"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M56.423 36.3162L34.7505 41.9901L28.4043 43.8498L14.1877 36.514C14.4681 36.6604 14.7287 37.4161 14.9578 38.3618L17.106 38.6348C18.5948 38.4924 19.8191 39.8654 20.4707 41.2581C21.1223 42.6509 21.5053 44.2455 22.5439 45.3573C23.5825 46.4692 25.1701 46.94 26.2087 48.0875C27.6896 49.7137 27.9305 52.5309 29.8852 53.4765C31.7097 54.3589 33.7988 52.982 35.1652 51.4467C37.7557 48.5306 39.7777 44.566 43.4582 43.5333C46.7596 42.6232 50.2506 44.467 53.631 43.9527C56.8179 43.47 59.3611 40.997 62.2163 39.4578C62.5954 38.0571 62.9903 36.6591 63.401 35.2637L56.423 36.3162Z"
                        fill="url(#paint2_linear_2078_20992)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M47.5575 27.9836L60.7829 33.0601L63.1287 32.4152C64.4121 32.0591 66.434 31.8217 65.5218 30.9868C63.409 29.2735 60.4591 28.4426 57.9435 27.4772C55.1792 26.4089 52.4148 25.3366 49.6505 24.2208C48.0708 23.5719 46.4912 23.2316 44.955 23.6075L31.2873 27.0617L21.229 29.3091C19.2545 29.7483 17.2799 29.9264 15.333 30.4408C14.3655 30.694 13.2874 30.8641 12.5055 31.513C11.9013 32.0156 11.9566 32.4231 12.5055 32.981C13.1294 33.6101 16.0833 35.5291 17.0311 35.2799L45.0893 27.8452C45.901 27.5852 46.7798 27.6345 47.5575 27.9836Z"
                        fill="#007548"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.1934 32.5533C12.1934 32.5533 13.2755 36.5101 13.469 36.5773C13.6625 36.6446 27.9186 44.5976 28.1121 44.5976C29.3686 44.9418 30.6942 44.9418 31.9506 44.5976C34.0989 44.012 63.3852 35.2756 63.3852 35.2756L64.3607 34.9471L65.7034 31.5127C62.0347 32.5296 57.9355 33.8511 54.251 34.868C48.8013 36.3795 43.166 37.6377 37.8229 39.4539C35.37 40.3236 32.8194 40.8871 30.2288 41.1315C28.0016 41.3135 25.8849 39.8654 23.9498 38.9237L20.2219 37.0996L12.1934 32.5533Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M47.4072 13.2486C46.566 12.9004 45.6459 12.6828 44.8008 12.3742C43.7938 12.0102 42.7907 11.6303 41.7876 11.2465C39.8631 10.5053 37.9439 9.7469 36.0299 8.97138C35.2401 8.6588 34.4503 8.34226 33.6802 8.01385C30.6473 6.71604 29.9128 9.20087 29.9641 9.78252C29.9443 9.9706 29.9443 10.1602 29.9641 10.3483C29.9641 10.3483 29.818 28.6166 29.9088 29.3407C29.9088 29.3407 29.9088 30.7968 30.6986 30.7137C31.8202 30.6029 31.6504 28.8065 31.6504 28.8065C31.7135 26.4325 31.7728 24.0466 31.8281 21.6488C31.8728 19.7601 31.911 17.8727 31.9426 15.9867C31.9584 15.169 31.9702 14.3486 31.9781 13.5256C31.9228 12.6623 31.9308 11.7961 32.0018 10.9339C32.0338 10.5958 32.1988 10.2844 32.4603 10.0683C32.7219 9.8523 33.0585 9.74946 33.3958 9.78252C33.4814 9.7903 33.566 9.8062 33.6486 9.83C34.8689 10.1465 35.9746 10.7796 37.1317 11.2663C38.2888 11.753 39.4656 12.2436 40.6345 12.7263C42.1904 13.3752 43.7464 14.0795 45.3457 14.6216C46.6529 15.0687 47.6323 15.9906 47.7902 17.3913C47.8344 18.0644 47.8132 18.7403 47.727 19.4093C47.3914 23.3264 46.9886 37.2146 46.9886 37.2146C46.9886 37.2146 46.8187 38.8923 47.7784 38.8487C48.9197 38.7973 48.8446 36.7279 48.8446 36.7279L50.1004 19.2708C50.2505 17.1974 50.1557 14.7364 48.1259 13.5849C47.8929 13.4742 47.652 13.3555 47.4072 13.2486Z"
                        fill="#333333"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M30.7738 29.0439C30.6701 29.0595 30.5803 29.1244 30.5329 29.218C30.4893 29.3123 30.4664 29.4149 30.4658 29.5188C30.4572 29.6047 30.4737 29.6913 30.5132 29.768C30.5581 29.8361 30.6229 29.8886 30.6988 29.9184C30.7447 29.9395 30.7943 29.9516 30.8449 29.954C30.8914 29.9534 30.9372 29.9426 30.9791 29.9223C31.1749 29.8353 31.2844 29.624 31.2428 29.4135C31.2011 29.203 31.0195 29.0495 30.8054 29.0439"
                        fill="#007548"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M47.9167 37.3099C47.703 37.2662 47.4945 37.4044 47.4509 37.6185C47.4073 37.8326 47.5451 38.0415 47.7588 38.0852C47.9725 38.129 48.1811 37.9909 48.2247 37.7768C48.2461 37.6726 48.2247 37.5642 48.1655 37.4761C48.1025 37.3917 48.0179 37.3261 47.9206 37.2861"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24.2527 44.512C24.184 44.4986 24.1579 44.6004 24.1646 44.6713C24.4951 48.1 25.0048 51.5091 25.6916 54.8845C25.7126 55.0644 25.7792 55.2361 25.8852 55.3829C25.7979 54.2852 25.6397 53.1942 25.4117 52.1169C25.3194 51.6845 25.2154 51.2531 25.1468 50.8184C25.0581 50.2545 25.0398 49.6799 24.9865 49.1127C24.8347 47.7084 24.6122 46.3127 24.3198 44.9309C24.2958 44.7892 24.2641 44.6489 24.2248 44.5106"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M28.7164 45.3775L29.0204 52.8438C29.0309 53.6744 29.1088 54.5028 29.2534 55.3208C29.4154 55.2931 29.443 55.0794 29.439 54.9251L29.0204 45.5001C29.0204 45.3696 28.9138 45.1875 28.8072 45.2627"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.7079 44.4157V50.153C33.7079 52.4321 33.7079 54.727 34.1581 56.9625C34.1147 54.8931 33.7632 52.8317 33.8817 50.7702C33.9054 50.3745 33.9449 49.9472 33.9607 49.5357C34.0041 48.0599 33.6843 46.5761 33.8778 45.1121C33.9133 44.847 33.9409 44.5186 33.7237 44.3643"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M40.2634 42.6437C39.6829 44.6458 39.6987 46.7626 39.4539 48.836C39.3473 49.7302 39.1932 50.6205 39.0985 51.5186C38.976 52.7057 38.9682 53.9441 38.9642 55.1549C38.9515 55.3555 38.9688 55.5569 39.0155 55.7524C39.1577 53.588 39.5724 51.4474 39.7343 49.2831C39.7698 48.8399 39.7935 48.3928 39.8211 47.9457C39.939 46.2937 40.1699 44.6517 40.5122 43.0314C40.5674 42.8532 40.5756 42.6637 40.5359 42.4814"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.1865 41.9494C19.2401 43.5877 19.7675 45.1667 20.0894 46.7766C20.2275 47.4711 20.3292 48.1743 20.4771 48.869C20.6746 49.7863 20.9704 50.7142 21.2623 51.6205C21.3016 51.7736 21.3636 51.9199 21.4462 52.0547C21.0254 50.4018 20.814 48.7003 20.408 47.0426C20.3266 46.7026 20.2354 46.3625 20.1472 46.0214C19.8329 44.7575 19.6057 43.4736 19.467 42.1787C19.4649 42.032 19.4248 41.8884 19.3508 41.7617"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M45.259 41.1552C44.4233 45.0045 43.8794 48.9118 43.632 52.8434C43.5925 53.3794 43.5925 53.9177 43.632 54.4538C43.6216 54.5558 43.6669 54.6556 43.7504 54.7149C43.99 51.9795 44.2836 49.2506 44.6311 46.5284C44.8086 44.8575 45.1136 43.2027 45.5433 41.5785C45.5947 41.4044 45.6223 41.1829 45.4604 41.0879"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M50.2231 39.7031C50.0217 40.4944 49.7413 41.2422 49.5399 42.0257C48.9555 44.285 49.0384 46.659 48.6672 48.9618C48.4843 49.849 48.3524 50.7461 48.2723 51.6485C48.2723 51.783 48.2723 51.9413 48.3986 52.0046C48.6079 50.8927 48.758 49.773 48.912 48.6532C49.2716 45.6814 49.7884 42.7308 50.4601 39.8138C50.4601 39.7466 50.4601 39.6477 50.4087 39.6318"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M55.4792 38.1642C55.131 39.2352 54.8488 40.3267 54.6341 41.4324C54.0259 44.3604 53.556 47.3121 53.086 50.2639C53.0505 50.4815 53.0347 50.7426 53.2085 50.8772C53.3137 50.5169 53.3915 50.1492 53.4414 49.7772C54.0654 45.8838 54.8552 42.0193 55.8109 38.1839"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M60.6681 36.5225C59.6302 41.0926 58.8393 45.7155 58.2986 50.3711C58.2593 50.5343 58.2862 50.7065 58.3736 50.8498C58.6501 49.6628 58.7686 48.4402 58.9423 47.2254C59.3961 43.7183 60.0368 40.238 60.8616 36.7994"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.2799 44.1892L27.3659 51.316C28.0017 51.7671 28.6375 52.2142 29.2931 52.6296C29.2931 52.3091 29.0087 52.0678 28.7481 51.8778L16.0095 43.6484"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M29.2533 52.1121C30.0431 51.8629 30.8526 51.6453 31.6622 51.4514C32.0966 51.3485 32.535 51.2535 32.9654 51.1467C35.1176 50.6125 37.1751 49.7539 39.3274 49.2198C39.3704 49.2119 39.4146 49.2119 39.4577 49.2198C39.5564 49.2475 39.5801 49.3899 39.5248 49.4809C39.4609 49.5625 39.3722 49.6208 39.2721 49.6471C38.3524 49.9563 37.4147 50.2086 36.4643 50.4028C33.9922 51.028 31.6346 52.1517 29.1032 52.4603"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M39.6354 49.1956C42.4034 48.1249 45.2256 47.2004 48.0903 46.4259L48.8485 46.2043C48.9433 46.1766 49.0894 46.1845 49.0894 46.2834C49.0822 46.3255 49.0579 46.3628 49.0223 46.3863C48.7489 46.5802 48.4383 46.7149 48.1101 46.782C46.412 47.2884 44.7257 47.8345 43.0395 48.3844L41.7481 48.8118L39.2602 49.6031"
                        fill="white"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M49.1607 46.0775C50.4046 45.6264 51.6249 45.116 52.857 44.6254C55.6135 43.5201 58.4055 42.5151 61.233 41.6104C61.2838 41.709 61.2646 41.8293 61.1856 41.9071C61.106 41.9793 61.0116 42.0333 60.9092 42.0654L51.5301 45.6818C50.7088 46.026 49.8609 46.3026 48.9948 46.5088"
                        fill="white"
                      />
                      <mask
                        id="mask0_2078_20992"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="3"
                        y="7"
                        width="71"
                        height="35"
                      >
                        <path
                          d="M29.5294 41.2149C24.3917 41.2149 17.9922 35.8068 13.3052 33.1027L6.27465 30.1283L4.3665 24.3399L3.2265 20.9199L5.5065 17.4999H8.5465L15.3865 21.6799L22.2265 16.7399L23.7465 28.5199C31.408 26.5369 44.618 23.3682 46.5649 23.3682C47.2281 23.3682 52.3444 26.4939 56.029 25.8018C70.0901 -3.13143 82.2583 4.43994 65.4932 31.4803C53.8658 34.7252 34.6671 41.2149 29.5294 41.2149Z"
                          fill="#C4C4C4"
                        />
                      </mask>
                      <g mask="url(#mask0_2078_20992)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M40.8681 35.3968C40.3147 33.9062 38.6789 33.911 37.3758 34.8776C36.4114 35.6107 35.9033 36.7985 36.0389 38.0031C36.0899 38.7925 36.2963 39.5639 36.6464 40.2726C37.1196 41.0131 37.9928 41.3931 38.8566 41.2346C40.5005 41.0723 42.6392 39.9567 43.1328 38.247C43.492 37.0143 42.2487 34.518 40.8681 35.3968Z"
                          fill="#FF6565"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M40.8839 35.4013C40.3304 33.9107 38.6946 33.9155 37.3994 34.8841C36.4323 35.6152 35.9235 36.8045 36.0624 38.0096C36.1063 38.8002 36.3132 39.5729 36.6699 40.2791C36.6699 40.2791 37.6108 40.6201 37.9673 38.7313C38.0178 38.2659 38.2331 37.8339 38.574 37.5135C38.9218 37.2441 39.3161 37.3062 39.707 37.191C40.0496 37.0809 40.3495 36.8664 40.5648 36.5774C40.8275 36.2456 40.9429 35.8204 40.8839 35.4013Z"
                          fill="#CC3737"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M41.0662 35.1552C41.156 34.6115 41.0179 34.0551 40.6845 33.6175C40.3208 33.2704 39.8794 33.0155 39.3972 32.8741C39.6428 33.5851 40.0451 34.2313 40.5742 34.7647C40.0179 34.6178 39.5118 34.2488 38.9096 34.7199C38.8163 34.7877 38.7125 34.8947 38.7821 34.9803C38.831 35.0184 38.8932 35.0349 38.9545 35.0259L40.712 35.0364C40.3509 35.1224 40.0545 35.3798 39.918 35.7257C39.7678 36.0881 39.707 36.4814 39.7409 36.8721L41.0256 35.531C41.0437 35.9698 41.0995 36.4062 41.1923 36.8354C41.2901 37.0124 41.478 37.1203 41.68 37.1154C41.9821 36.4475 41.8236 35.9686 41.2146 35.228C42.1047 35.6343 43.1346 35.5948 43.9921 35.1215C44.0417 35.0925 44.0933 35.0558 44.0921 34.9966C44.0904 34.9567 44.0733 34.9191 44.0444 34.8916C43.6732 34.4719 43.1293 34.2477 42.5705 34.2838C42.0064 34.2943 41.4781 34.5635 41.137 35.0142"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M59.7975 32.9003C56.9208 30.161 57.3995 28.2099 57.5725 24.8289L60.4366 18.8009C61.685 16.1778 63.0391 13.4142 65.703 12.0465C66.8238 11.4294 68.1286 11.2344 69.3809 11.4969C73.3589 12.4423 72.1101 19.687 69.1144 22.8221C68.971 22.8351 68.8284 22.857 68.6877 22.8878L67.3074 23.1605C67.0238 23.2275 66.7353 23.2712 66.4446 23.2912C65.7046 23.3015 64.9845 22.9768 64.2376 22.9585C63.4908 22.9402 62.6066 23.4245 62.6634 24.1685C62.7069 24.743 63.2696 25.1569 63.76 25.4336C64.6543 26.0184 65.4798 26.7023 66.2207 27.4723C66.2404 27.7828 66.2508 28.0924 66.2605 28.4114C66.1915 29.7388 65.7762 31.025 65.0559 32.1422C64.6068 32.9433 64.032 33.6671 63.3535 34.286L63.2466 34.1176C61.7935 35.0108 60.16 33.2499 59.7975 32.9003Z"
                          fill="#FFB43D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M63.3766 21.1342C62.6374 21.7365 61.9532 22.4032 61.3319 23.1266C59.6472 25.2813 60.7366 29.0997 57.8991 30.312C56.7797 30.8745 56.3835 31.1594 55.1315 31.1146C53.5447 31.669 61.0136 44.7694 54.5704 49.2946C55.5774 48.5796 56.4648 47.7097 57.1994 46.7169C58.2867 45.1729 59.2826 43.5666 60.182 41.9061C60.7702 41.0473 61.1734 40.0757 61.3662 39.0529C61.3802 38.6621 61.2659 38.2776 61.0406 37.958C60.7803 37.5657 60.6917 37.0842 60.7953 36.625C60.8989 36.1658 61.1858 35.769 61.5893 35.5265C63.0119 34.7335 64.1885 33.5639 64.9899 32.1461C65.7102 31.0289 66.1254 29.7426 66.1944 28.4152C66.246 27.6703 66.1254 26.9235 65.842 26.2327C65.6083 25.8007 65.0544 25.715 65.1874 25.1559C65.3203 24.5968 66.913 24.2491 67.4378 24.0235C71.4901 22.2903 73.9508 12.6251 69.3124 11.5286C68.3226 11.2927 67.5582 12.4423 67.061 13.3159C66.6055 14.2249 66.3408 15.2174 66.283 16.2325C66.2514 16.6873 66.1776 17.1381 66.0627 17.5793C65.5195 18.9933 64.5885 20.2255 63.3766 21.1342Z"
                          fill="url(#paint3_linear_2078_20992)"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M61.6438 35.5496C61.236 35.7882 60.9455 36.1853 60.8415 36.6462C60.7375 37.107 60.8294 37.5904 61.0951 37.981C61.3121 38.3038 61.4227 38.6863 61.4114 39.0751C61.2192 40.0951 60.8162 41.0638 60.2281 41.919C59.3334 43.5837 58.3402 45.1936 57.2539 46.74C56.5132 47.7304 55.6232 48.5997 54.6156 49.3168C51.8769 51.2206 47.3594 51.3135 47.6824 46.748C47.771 45.7592 48.0454 44.796 48.4911 43.9089L57.571 24.8474C57.3609 28.2251 56.9193 30.1794 59.7961 32.9187C60.1585 33.2684 61.792 35.0292 63.2249 34.153L63.3319 34.3214C62.8199 34.7963 62.2532 35.2086 61.6438 35.5496Z"
                          fill="#D1720B"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M62.6447 24.1667C62.5879 23.4226 63.4729 22.9291 64.219 22.9567C64.965 22.9842 65.686 23.2997 66.426 23.2893C66.7167 23.2693 67.0052 23.2256 67.2888 23.1586L68.6691 22.886C68.8098 22.8552 68.9523 22.8332 69.0958 22.8203C68.6428 23.3159 68.0959 23.7166 67.4868 23.9992C66.962 24.2248 65.3858 24.4897 65.2364 25.1316C65.0869 25.7735 65.6573 25.7764 65.9003 26.2092C66.0899 26.6032 66.1928 27.0333 66.202 27.4705C65.4612 26.7004 64.6357 26.0165 63.7414 25.4317C63.2263 25.1155 62.6882 24.7412 62.6447 24.1667Z"
                          fill="url(#paint4_linear_2078_20992)"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M38.5638 39.0639L35.318 31.4097L27.1904 34.0747L23.932 35.0892L27.7187 43.4044C27.7165 43.4429 27.7145 43.4767 27.742 43.5122C28.0924 44.5921 29.8367 45.231 31.9 45.1289C32.9001 45.0816 33.885 44.8726 34.8154 44.5105C38.189 43.2076 39.0727 40.6321 38.5638 39.0639Z"
                          fill="url(#paint5_linear_2078_20992)"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M30.5933 43.5558C30.3785 42.6209 31.4517 41.7709 31.2963 40.8251C31.1669 40.0208 30.2693 39.6255 29.5479 39.2309C28.8244 38.8295 28.1814 38.301 27.6506 37.6715C27.4792 37.4864 27.3515 37.2662 27.2768 37.0267C27.249 36.569 27.3191 36.1108 27.4827 35.6819C27.5778 35.1351 27.4679 34.5726 27.1734 34.0993L23.931 35.1124L27.678 43.4097L27.7011 43.5173C28.0496 44.5952 29.7804 45.2322 31.8383 45.1302C31.8064 45.0812 31.7715 45.034 31.734 44.9889C31.3357 44.5118 30.7298 44.1529 30.5933 43.5558Z"
                          fill="url(#paint6_linear_2078_20992)"
                        />
                        <path
                          d="M30.5147 36.0511C33.6682 35.0478 35.8176 32.9553 35.3155 31.3772C34.8135 29.7992 31.8501 29.3333 28.6966 30.3367C25.5431 31.34 23.3938 33.4326 23.8958 35.0106C24.3979 36.5886 27.3613 37.0545 30.5147 36.0511Z"
                          fill="white"
                        />
                        <path
                          d="M29.6965 33.8797C30.8014 33.5281 31.5546 32.7953 31.3788 32.2429C31.2031 31.6905 30.1649 31.5276 29.06 31.8791C27.9552 32.2307 27.202 32.9635 27.3778 33.5159C27.5535 34.0683 28.5917 34.2312 29.6965 33.8797Z"
                          fill="#005537"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.8176 32.0538C20.8176 32.0538 19.0505 29.0451 16.9196 28.7559C14.7886 28.4666 13.7446 29.0981 13.6984 27.5677C13.6521 26.0373 11.1622 25.5399 10.3554 24.6635C9.54868 23.7871 6.3481 24.0728 6.17927 25.151C5.94925 26.5795 9.04425 26.6179 9.20452 27.8398C9.40259 29.2426 9.26947 31.8318 11.5158 31.6206C13.3852 31.4275 14.4244 30.0183 15.4899 31.1772C16.5554 32.3362 20.8176 32.0538 20.8176 32.0538Z"
                          fill="#235339"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21.1195 32.6101C20.7398 30.9836 22.5054 29.5429 22.478 27.8714C22.4863 27.716 22.4466 27.5618 22.3641 27.4297C21.9113 26.8447 20.7528 27.8857 20.2849 27.4396L20.2085 27.3451L20.1794 27.2451C20.0001 26.4966 20.0887 25.7092 20.4297 25.0203C20.7207 24.2785 21.0763 23.5169 21.0116 22.7214C20.9469 21.9258 20.2455 21.1232 19.4639 21.2751C19.0491 21.3937 18.6978 21.671 18.486 22.047C18.0703 22.6701 17.8404 23.4039 17.374 23.989C17.3352 24.0101 17.3111 24.0584 17.2748 24.0932C17.2195 24.1491 17.1605 24.2013 17.0982 24.2493C16.6209 24.629 15.8289 24.9376 15.4509 24.463C15.2838 24.2566 15.1999 24 15.0755 23.7705C14.6709 23.2096 13.7894 23.6221 13.2306 23.6383C12.9617 23.6506 12.6924 23.6273 12.4296 23.5692C12.3748 23.5609 12.3208 23.5481 12.2681 23.5309C11.757 23.3848 11.2996 23.092 10.9525 22.6887C10.3317 21.9884 9.8853 21.3042 9.31716 20.7011L9.06756 20.4538C8.7174 20.108 8.31845 19.8155 7.88351 19.5857C7.11478 19.187 6.15618 18.9013 5.43128 19.5562C4.08949 20.7872 5.42055 23.2419 6.60789 24.0327C6.82249 24.1549 7.04689 24.2589 7.27874 24.3435L7.32279 24.3599L7.79779 24.5504C9.06143 25.0281 10.6516 25.6911 10.3389 26.8373C10.2244 27.0887 10.082 27.3264 9.91427 27.5457C9.561 28.2004 9.94517 28.9738 10.5633 29.4189C10.6198 29.4613 10.6793 29.4997 10.7412 29.5338C10.8959 29.626 11.0635 29.6946 11.2383 29.7375C12.1931 29.9698 13.1982 29.6463 14.1536 29.4907C14.743 29.3769 15.3502 29.391 15.9341 29.532L16.1502 29.6062C16.4465 29.7079 16.7133 29.8815 16.9265 30.1115C17.1774 30.3983 17.3281 30.7595 17.5501 31.067C17.5986 31.1565 17.68 31.2232 17.7479 31.3021C17.8158 31.3811 17.8426 31.4119 17.8936 31.4597C18.7108 32.2348 19.9568 32.4854 21.1077 32.6718L21.1195 32.6101Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.29937 24.3723L7.77437 24.5628C8.51729 24.4989 9.2526 24.3664 9.97093 24.1671C10.7197 25.0907 11.6814 25.8184 12.7732 26.2872C13.1767 26.4262 13.5952 26.517 14.0199 26.5575C14.2046 26.5832 14.3935 26.6167 14.5747 26.6544C13.6824 27.0376 11.2167 28.1782 10.5321 29.4354C10.5886 29.4779 10.6481 29.5163 10.71 29.5504C11.4653 28.1643 14.6057 26.8691 14.9437 26.7513C16.1137 27.0455 17.1792 27.6601 18.0208 28.526C17.2531 28.6632 16.5343 28.9974 15.9348 29.4961C15.9172 29.5099 15.9046 29.529 15.8991 29.5507L16.1151 29.6248C16.7145 29.1448 17.43 28.8315 18.1894 28.7165C18.3821 28.9318 18.5596 29.1602 18.7207 29.4C18.9627 29.7721 19.1555 30.0905 19.3172 30.3703L19.6105 30.8556C18.939 30.7422 18.2509 30.9112 17.709 31.3229C17.7406 31.3812 17.8036 31.4326 17.8547 31.4805C18.4071 31.0856 19.1018 30.9451 19.7649 31.094C20.0028 31.4546 20.2648 31.7986 20.5492 32.1236C20.568 32.1449 20.5944 32.1579 20.6227 32.1595C20.651 32.1612 20.6787 32.1515 20.6998 32.1326C20.7217 32.1124 20.7346 32.0842 20.7355 32.0543C20.7363 32.0245 20.7251 31.9955 20.7043 31.9741C20.4192 31.6515 20.1577 31.3087 19.9221 30.9484C19.4757 29.5695 20.1436 27.7626 20.2692 27.4478L20.1929 27.3533L20.1638 27.2533C20.1324 27.2533 20.1032 27.2691 20.0861 27.2954C19.6833 28.2775 19.5099 29.3392 19.5791 30.3994L19.4906 30.236C19.3345 29.9481 19.1322 29.64 18.886 29.26C18.7161 29.0043 18.5275 28.7617 18.3216 28.5341C18.311 28.5147 17.3691 27.037 17.2908 24.1597C17.285 24.1348 17.2726 24.112 17.2549 24.0936C17.1996 24.1495 17.1406 24.2017 17.0784 24.2497C17.0942 25.5541 17.3527 26.8445 17.8407 28.0549C17.0212 27.3227 16.0377 26.7992 14.9737 26.5287C14.8335 26.4184 13.1262 25.104 12.3726 23.5846C12.3179 23.5763 12.2639 23.5635 12.2112 23.5463C12.1712 23.5746 12.1559 23.6266 12.174 23.6722C12.7632 24.7358 13.5525 25.6755 14.4982 26.4391L14.0173 26.3676C13.6096 26.3268 13.2076 26.2409 12.8186 26.1115C11.7487 25.6473 10.8075 24.9291 10.0766 24.0192C9.87202 22.9042 9.60011 21.8026 9.26235 20.7204L9.01275 20.4731C8.98806 20.5 8.97824 20.5374 8.9865 20.573C9.32206 21.5931 9.59258 22.6335 9.79645 23.6878L9.64794 23.5066C8.48876 22.0121 7.05799 20.7502 5.43114 19.7875C5.40709 19.7723 5.37799 19.7674 5.35034 19.7739C5.32268 19.7803 5.29881 19.7977 5.28405 19.8219C5.26497 19.8548 5.26411 19.8952 5.28177 19.9289C5.28661 19.9462 5.29526 19.9621 5.30708 19.9756C6.91455 20.925 8.32812 22.1708 9.47283 23.6468L9.76529 23.9916C9.0951 24.1637 7.73116 24.4553 7.3862 24.3101C7.3862 24.3101 7.31752 24.2668 7.19819 24.3617"
                          fill="#235339"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M27.4875 52.8677C27.882 52.2261 28.1093 51.4953 28.1485 50.7424L28.1451 50.6435C28.2932 49.8315 28.301 48.9998 28.168 48.1846L27.6656 44.8124C27.342 42.2872 26.8592 39.7849 26.2201 37.3202C25.8196 35.8963 25.2656 34.4298 24.1359 33.4767C23.0063 32.5237 21.1164 32.3454 20.1002 33.4451L20.0112 33.5588C19.8857 33.6989 19.7862 33.8603 19.7171 34.0354C19.5516 34.4162 19.4719 34.8289 19.4835 35.2444L19.4962 35.2677C19.4978 35.3725 19.5071 35.4732 19.5186 35.5777L19.5308 35.702L19.5748 35.95L19.621 36.1464L19.6508 36.2662L19.7417 36.5542L19.807 36.7302L19.885 36.8741L19.9778 37.0453L20.2015 37.4577C20.9491 38.6883 21.7459 39.852 22.5052 41.0764C22.6381 41.3214 22.7689 41.5626 22.8997 41.8038C23.7901 43.5108 24.2826 45.3731 25.1024 47.1537L25.2923 47.5038C25.771 48.4423 26.3831 49.3487 26.8481 50.2897C27.2793 51.0813 27.5123 51.9655 27.527 52.8664L27.4875 52.8677Z"
                          fill="#FFB43B"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M28.1493 50.7716C28.1072 51.5241 27.8802 52.2541 27.4884 52.897C27.5315 50.7995 25.9624 49.073 25.0747 47.1581C24.1481 45.1435 23.6357 42.9849 22.4638 41.0832C21.7066 39.8628 20.9077 38.6952 20.1621 37.4684C19.579 36.5901 19.359 35.52 19.5484 34.4838C19.6527 34.0648 19.8949 33.3998 20.3696 33.3488C20.9022 33.3133 21.3851 33.6629 21.5188 34.1805C21.5419 34.4517 21.5452 34.7241 21.5288 34.9956C21.5577 35.9012 22.29 36.3347 22.7812 36.9997C23.6076 38.207 24.0629 39.6297 24.091 41.0919C24.2469 44.2141 26.2077 46.2367 26.5496 46.7561C27.3298 47.8986 28.2097 49.3545 28.1493 50.7716Z"
                          fill="url(#paint7_linear_2078_20992)"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2078_20992"
                          x1="51.5666"
                          y1="53.4757"
                          x2="-17.7704"
                          y2="39.2226"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#969696" />
                          <stop offset="1" stop-color="white" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_2078_20992"
                          x1="8.69837"
                          y1="35.9445"
                          x2="44.93"
                          y2="52.8843"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#003C1B" />
                          <stop offset="0.99" stop-color="#005537" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_2078_20992"
                          x1="54.4248"
                          y1="39.4671"
                          x2="41.3456"
                          y2="63.0018"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#00AA46" />
                          <stop offset="0.2" stop-color="#009F44" />
                          <stop offset="0.54" stop-color="#00823F" />
                          <stop offset="0.99" stop-color="#005537" />
                        </linearGradient>
                        <linearGradient
                          id="paint3_linear_2078_20992"
                          x1="66.649"
                          y1="9.3693"
                          x2="50.224"
                          y2="28.0801"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFB743" />
                          <stop offset="1" stop-color="#FF883B" />
                        </linearGradient>
                        <linearGradient
                          id="paint4_linear_2078_20992"
                          x1="69.7381"
                          y1="25.3274"
                          x2="62.5885"
                          y2="24.7044"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FF8A3B" />
                          <stop offset="1" stop-color="#FF7516" />
                        </linearGradient>
                        <linearGradient
                          id="paint5_linear_2078_20992"
                          x1="18.3356"
                          y1="42.4295"
                          x2="41.0924"
                          y2="35.2818"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#D7D7D7" />
                          <stop offset="0.02" stop-color="#D8D8D8" />
                          <stop offset="0.32" stop-color="#E8E8E8" />
                          <stop offset="0.56" stop-color="#EDEDED" />
                        </linearGradient>
                        <linearGradient
                          id="paint6_linear_2078_20992"
                          x1="27.873"
                          y1="40.4224"
                          x2="27.6329"
                          y2="53.419"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B5B5B5" />
                          <stop offset="1" stop-color="#D8D8D8" />
                        </linearGradient>
                        <linearGradient
                          id="paint7_linear_2078_20992"
                          x1="20.5565"
                          y1="36.0917"
                          x2="24.3793"
                          y2="54.6742"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FF8A1A" />
                          <stop offset="0.98" stop-color="#FFB43B" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>Sparade varukorgar</span>
                  </a>
                  <a href="/mitt-coop/mina-inkopslistor/">
                    <svg
                      width="75"
                      height="75"
                      viewBox="0 0 75 75"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="1.77789" width="72" height="72" rx="36" fill="#E0EFDD" />
                      <mask
                        id="mask0_2078_20993"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="5"
                        y="3"
                        width="64"
                        height="72"
                      >
                        <path
                          d="M68.8824 46.4779C68.8824 62.2084 54.9316 74.9605 37.7224 74.9605C20.5132 74.9605 5.22241 63.231 5.22241 47.5005C5.22241 31.77 30.2188 3.52051 47.428 3.52051C64.6372 3.52051 68.8824 30.7474 68.8824 46.4779Z"
                          fill="#E0EFDD"
                        />
                      </mask>
                      <g mask="url(#mask0_2078_20993)">
                        <path
                          d="M31.4268 41.7339L30.3223 42.8385C30.3223 42.8385 37.7053 45.4582 43.8694 47.7262C48.2014 49.3201 53.1663 47.7836 55.7267 43.943C52.7225 43.943 51.8608 41.1816 49.0995 41.1816C46.3381 41.1816 37.1336 41.3657 31.4268 41.7339Z"
                          fill="#827E7E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M49.3114 41.1897C52.8326 41.4502 54.2785 46.6581 55.9996 43.5752C57.3043 41.2381 58.0427 38.2589 57.3827 34.5548C56.3742 26.1136 55.9071 19.9619 57.9354 18.5389L31.5194 16.2997C31.5194 16.2997 28.7335 26.2504 31.7815 33.6914C35.5354 42.871 24.7988 45.1342 24.7988 45.1342C24.7988 45.1342 43.5758 41.182 49.0987 41.1821C49.1723 41.1821 49.2432 41.1846 49.3114 41.1897Z"
                          fill="url(#paint0_linear_2078_20993)"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M35.3713 37.0255C35.3845 37.2419 35.663 37.305 35.8773 37.3213L49.0372 37.8279C49.7079 37.8605 50.3563 37.9994 51.0039 38.0081C51.1781 38.0195 51.5262 37.9771 51.5255 37.8469C51.1184 37.3354 50.4219 37.355 49.7692 37.3213L36.8005 36.6296C36.301 36.6194 35.4332 36.6165 35.3713 37.0255Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M34.3606 32.4318C35.6626 32.458 36.9812 32.8089 38.2823 32.8171C38.9848 32.8475 39.6253 32.8666 40.333 32.857C40.9051 32.8491 41.4767 32.8997 42.0388 33.0079C42.3888 33.0703 42.8021 33.0969 42.8293 33.4898C42.8565 33.8827 38.6428 33.2261 36.4788 33.2316C35.8141 33.2154 35.1557 33.0953 34.5277 32.8757C34.4814 32.8626 34.4368 32.8442 34.3948 32.8208C34.2641 32.7368 34.1734 32.4447 34.3606 32.4318Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M33.6627 28.5429C35.8732 28.4975 38.076 28.7567 40.2868 28.8705C40.5873 28.8929 40.8893 28.8699 41.1827 28.8023C41.797 28.6374 40.7863 28.3043 40.5539 28.2911C39.2691 28.2289 38.006 28.1664 36.7646 28.1037L34.8415 28.0173C34.4969 28.0046 34.1544 27.9156 33.8348 27.8975C33.6627 27.8767 33.4883 27.896 33.3251 27.954C32.875 28.191 33.4233 28.5339 33.6627 28.5429Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M33.4359 23.8235L33.5516 23.8364C34.099 23.9174 34.6502 23.9695 35.203 23.9925L37.0492 24.1389L40.7017 24.4249C43.9028 24.6806 47.1052 24.9507 50.309 25.2352C50.6595 25.2633 51.2704 25.3386 51.2953 25.5623C51.2473 25.9964 42.214 24.9441 37.6558 24.926C36.7178 24.947 35.7794 24.8936 34.8496 24.7666C34.3493 24.7334 33.8571 24.6226 33.3905 24.4382C33.2412 24.3426 33.0161 23.995 33.346 23.8427L33.4359 23.8235Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M33.5274 20.335C33.737 20.3922 33.9823 20.3951 34.1629 20.4307C34.5183 20.505 34.8776 20.5595 35.239 20.5938C35.6381 20.6168 36.0382 20.6144 36.4369 20.5868C36.7941 20.5785 37.1479 20.5992 37.5015 20.6018C37.6566 20.6116 37.8123 20.6088 37.9669 20.5932C38.5945 20.53 37.6945 20.1786 37.4779 20.1611L33.5178 19.7968C33.3012 19.7793 32.9986 19.8777 33.2054 20.1445C33.2904 20.2399 33.4029 20.3066 33.5274 20.335Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M27.9256 41.5854C27.9256 41.5854 18.3563 40.6903 19.6253 51.2766C20.6338 59.7177 18.9797 74.5696 16.9514 75.9926L45.1047 78.8303C45.1047 78.8303 51.044 67.902 46.4904 52.7864C42.7365 43.6068 49.0994 41.1823 49.0994 41.1823L27.9256 41.5854Z"
                          fill="url(#paint1_linear_2078_20993)"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.918 63.4423C27.7709 63.9053 31.4699 64.2145 35.3228 64.6775C35.9105 64.7746 36.5034 64.8373 37.0984 64.8654C37.4497 64.8772 38.0353 64.8751 38.1381 65.1983C38.0531 65.406 37.6414 65.3544 37.3772 65.3483C34.4334 65.3309 31.6987 64.7076 28.758 64.5018C27.9519 64.4446 27.1452 64.4345 26.348 64.3442C25.9254 64.3005 25.5059 64.2311 25.0917 64.1364C24.6901 64.0728 24.3013 63.9442 23.9407 63.7558C23.765 63.6613 23.6468 63.4403 23.918 63.4423Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.8022 59.6896C23.8153 59.906 24.0939 59.9691 24.3082 59.9853L39.4736 60.7009C40.1443 60.7336 40.7927 60.8725 41.4403 60.8812C41.6145 60.8926 41.9626 60.8502 41.9619 60.72C41.5548 60.2085 40.8583 60.228 40.2055 60.1943L25.2313 59.2937C24.7318 59.2835 23.864 59.2806 23.8022 59.6896Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M22.853 68.5222C22.8571 68.7559 23.1516 68.8405 23.3796 68.8708L39.5375 70.548C40.2521 70.6233 40.9379 70.8116 41.6289 70.8597C41.8144 70.8823 42.1879 70.8576 42.1932 70.7173C41.7822 70.1424 41.0377 70.1218 40.3423 70.0465L24.3971 68.1815C23.8643 68.1407 22.9379 68.0857 22.853 68.5222Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M24.0417 55.1186C25.344 55.1319 26.6659 55.4698 27.9671 55.4651C28.6698 55.4886 29.3105 55.5013 30.018 55.4847C30.5901 55.4712 31.1621 55.5161 31.7252 55.6188C32.0759 55.6776 32.4894 55.7002 32.5205 56.0928C32.5516 56.4854 28.3315 55.8705 26.1677 55.8974C25.5029 55.8877 24.8434 55.7742 24.2132 55.5608C24.1668 55.5482 24.122 55.5302 24.0798 55.5072C23.9482 55.4245 23.8546 55.1333 24.0417 55.1186Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M24.2994 52.0685C26.5102 52.0425 28.7107 52.3211 30.9203 52.4543C31.2206 52.4794 31.5228 52.459 31.8168 52.394C32.4325 52.2345 31.4248 51.8925 31.1925 51.8773C29.9083 51.8038 28.6458 51.7302 27.405 51.6565L25.4827 51.5533C25.1383 51.5375 24.7965 51.4456 24.4771 51.4247C24.3053 51.4023 24.1306 51.4201 23.9669 51.4766C23.5148 51.7097 24.0601 52.0574 24.2994 52.0685Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M23.805 47.9489L23.9211 47.9565C24.4717 48.0119 25.0247 48.0383 25.578 48.0356L27.429 48.0961L31.0909 48.2121C34.3003 48.3187 37.5119 48.4396 40.7255 48.575C41.0768 48.5867 41.6906 48.6336 41.7258 48.8559C41.6981 49.2918 32.6256 48.6604 28.0716 48.8542C27.1355 48.9187 26.1957 48.909 25.2609 48.8253C24.7596 48.8154 24.2628 48.7276 23.7882 48.5651C23.6346 48.4765 23.3936 48.1397 23.716 47.9722L23.805 47.9489Z"
                          fill="#00AA46"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M25.9867 45.1306C26.1991 45.1759 26.4443 45.165 26.6266 45.1904C26.9856 45.2446 27.3474 45.2787 27.7101 45.2927C28.1099 45.2932 28.5093 45.2683 28.9058 45.2182C29.262 45.1899 29.6163 45.1906 29.9695 45.1733C30.125 45.1744 30.2802 45.1628 30.4338 45.1386C31.0568 45.0402 30.1384 44.7399 29.9212 44.7347L25.9468 44.5938C25.7296 44.5885 25.433 44.7038 25.6545 44.9585C25.7447 45.0491 25.8608 45.1092 25.9867 45.1306Z"
                          fill="#00AA46"
                        />
                      </g>
                      <path
                        d="M0.624084 32.3847L1.03899 33.3558L21.3038 43.9732L21.3682 44.0092L21.3828 44.0072L21.8121 44.0977L23.3271 44.3981L25.0504 44.7521L23.8409 43.4125L22.3829 41.7791L1.76365 31.1279L1.22524 31.4394L1.01786 31.5569L0.624084 32.3847Z"
                        fill="#FFB43B"
                      />
                      <path
                        d="M0.624084 32.3847L1.03899 33.3558L21.3682 44.0092L21.8121 44.0977L21.5093 43.1333L0.624084 32.3847Z"
                        fill="url(#paint2_linear_2078_20993)"
                      />
                      <path
                        d="M21.9775 42.1918C22.1629 42.2411 22.6137 42.5446 22.6599 42.5011C22.7061 42.4576 22.5171 41.9991 22.3829 41.7791L1.76365 31.1279L1.01786 31.5569L21.9775 42.1918Z"
                        fill="url(#paint3_linear_2078_20993)"
                      />
                      <path
                        d="M21.3348 43.9836L25.0023 44.7285L22.3349 41.7556C22.0462 41.9606 21.7887 42.2062 21.5703 42.4849C21.3296 42.9451 21.2468 43.4717 21.3348 43.9836Z"
                        fill="#F9D49D"
                      />
                      <path
                        d="M23.3263 44.3977L25.0496 44.7517L23.8401 43.4121C23.6051 43.7033 23.4304 44.0383 23.3263 44.3977Z"
                        fill="#235339"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M21.4798 38.8545L21.2924 32.0155C21.3142 30.9799 21.1466 29.9489 20.7979 28.9734C20.4609 27.9762 19.6182 27.234 18.5863 27.0256C16.8409 26.7942 15.4736 28.8059 15.6569 30.5545C15.8402 32.3031 17.0463 33.7643 18.1913 35.097L21.4284 38.8449"
                        fill="#06A84B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M21.7751 47.7603C21.3466 47.7395 20.9172 47.7551 20.4914 47.8069C20.0525 47.8341 19.6228 47.9441 19.2249 48.131C18.8239 48.3244 18.514 48.6665 18.3613 49.0847C18.2168 49.5125 18.3379 49.9853 18.6702 50.2913C18.8824 50.4495 19.1489 50.5169 19.4108 50.4784C19.6727 50.4399 19.9084 50.2987 20.066 50.0861C20.276 49.7893 20.2799 49.3956 20.3862 49.0469C20.5939 48.4029 21.1216 47.9133 21.7794 47.7542"
                        fill="#06A84B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M21.7543 45.5C20.2637 44.7458 18.5832 44.4496 16.9246 44.6488C16.341 44.7031 15.7901 44.9426 15.3524 45.3325C14.9203 45.75 14.8524 46.4184 15.1918 46.9142C15.5458 47.3304 16.193 47.3535 16.7235 47.1994C17.0097 47.1157 17.2821 46.9905 17.5321 46.8279C17.7974 46.6598 18.0378 46.4531 18.2985 46.2717C19.0212 45.7676 19.8704 45.4754 20.7503 45.4279C21.0865 45.4191 21.4228 45.4433 21.7543 45.5Z"
                        fill="#00AA46"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M26.0732 42.6494C24.8312 40.6809 24.208 38.3777 24.2819 36.0302C24.2858 35.2066 24.5535 34.4006 25.0459 33.7301C25.5777 33.0631 26.5065 32.8672 27.2437 33.2664C27.8711 33.698 27.9835 34.5988 27.8331 35.3633C27.7512 35.7759 27.6095 36.1754 27.4123 36.5493C27.2095 36.9454 26.9495 37.3126 26.7274 37.7043C26.1101 38.7903 25.8055 40.021 25.8479 41.2576C25.8772 41.7287 25.9527 42.1948 26.0732 42.6494Z"
                        fill="#00AA46"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2078_20993"
                          x1="47.3387"
                          y1="17.3003"
                          x2="43.7165"
                          y2="73.9163"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.14762" stop-color="white" />
                          <stop offset="0.371201" stop-color="#DDDDDD" />
                          <stop offset="0.49576" stop-color="#B1B1B1" />
                          <stop offset="0.88" stop-color="#969696" />
                          <stop offset="1" stop-color="#8C8C8C" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_2078_20993"
                          x1="26.4099"
                          y1="74.6287"
                          x2="31.68"
                          y2="-11.5045"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.25" stop-color="white" />
                          <stop offset="0.43" stop-color="#DDDDDD" />
                          <stop offset="0.69" stop-color="#B1B1B1" />
                          <stop offset="0.88" stop-color="#969696" />
                          <stop offset="1" stop-color="#8C8C8C" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_2078_20993"
                          x1="-0.290838"
                          y1="38.1399"
                          x2="48.4494"
                          y2="35.7535"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFB743" />
                          <stop offset="1" stop-color="#D98231" />
                        </linearGradient>
                        <linearGradient
                          id="paint3_linear_2078_20993"
                          x1="-3.8314"
                          y1="37.7961"
                          x2="63.7387"
                          y2="39.6339"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFB743" />
                          <stop offset="1" stop-color="#D98231" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>Mina inköpslistor</span>
                  </a>
                `;
                element.prepend(icons);
              });
            }
          });
        });
        observer.observe(element);
      },
      {
        querySelectorAll: true,
      }
    );

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
                  style="background-color: #F5F3EB; padding: 11px"
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
