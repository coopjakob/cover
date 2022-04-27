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
    const container = document.querySelector('.js-navPrimary ul');
    if (container && window.innerWidth >= 1024) {
      const recept = container.querySelector('li[data-test="mainnav-recept"]');
      const receptLink = recept.querySelector('a');

      receptLink.addEventListener('click', (event) => {
        event.preventDefault();
        dataLayer.push({
          event: 'interaction',
          eventCategory: 'experiment',
          eventAction: 'click',
          eventLabel: 'recept-nav',
        });
        setTimeout(() => {
          location.href = (<HTMLAnchorElement>event.target).href;
        }, 100);
      });

      cover.variantReady('T121', () => {
        const erbjudanden = container.querySelector(
          'li[data-test="mainnav-butiker-erbjudanden"]'
        );

        container.insertBefore(recept, erbjudanden);
      });
    }

    if (window.innerWidth < 1024) {
      cover.waitFor(
        '.js-navTrigger',
        (element) => {
          element.addEventListener('click', () => {
            dataLayer.push({
              event: 'interaction',
              eventCategory: 'experiment',
              eventAction: 'click',
              eventLabel: 'hamburger-menu',
            });
          });

          cover.variantReady('T94', () => {
            const container = document.querySelector('.Header .Main-container');
            const logo = container.querySelector('.Header-logo');

            const item = element.parentElement;
            item.remove();

            const list = document.createElement('ul');
            list.classList.add('Navigation-list');
            list.style.marginRight = '16px';
            list.innerHTML = `
              <li class="Navigation-item u-lg-hidden">
                <button type="button" class="MenuButton MenuButton--white js-navTrigger" aria-label="Meny">
                  <div class="MenuButton-icon">
                    <span></span>
                  </div>
                </button>
              </li>
            `;

            list
              .querySelector('.js-navTrigger')
              .addEventListener('click', () => {
                dataLayer.push({
                  event: 'interaction',
                  eventCategory: 'experiment',
                  eventAction: 'click',
                  eventLabel: 'hamburger-menu',
                });
              });

            container.insertBefore(list, logo);
          });
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

    cover.waitFor('.Cart.Cart--mini.is-visible', (element) => {
      const inputs =
        element.querySelectorAll<HTMLInputElement>('.AddToCart-input');

      let selectedItems = [];

      for (const input of inputs) {
        if (parseInt(input.value) >= 50) {
          const item = input.closest('.Cart-item');

          selectedItems.push(item);
        }
      }

      if (selectedItems) {
        cover.variantReady('T116', () => {
          for (const item of selectedItems) {
            const wrapper = item.querySelector('.Cart-itemWrapperDetail');
            wrapper.style.width = 'auto';
            wrapper.style.flexGrow = '1';

            const price = item.querySelector('.Cart-itemWrapperPrice');
            price.style.order = 'unset';

            const container = item.querySelector('.Cart-itemContainer');
            container.style.overflow = 'auto';
            container.style.flexWrap = 'wrap';

            const notification = document.createElement('div');
            notification.setAttribute('role', 'button');
            notification.style.display = 'flex';
            notification.style.width = '100%';
            notification.style.backgroundColor = '#FFFBDB';
            notification.style.alignItems = 'flex-start';
            notification.style.padding = '16px';
            notification.style.borderRadius = '16px';
            notification.style.marginLeft = '65px';
            container.append(notification);

            if (window.innerWidth < 600) {
              notification.style.marginBottom = '16px';
            } else {
              notification.style.marginTop = '16px';
            }

            const icon = document.createElement('div');
            icon.style.marginRight = '16px';
            icon.innerHTML = `
              <svg style="display:block" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6275 24 24 18.6275 24 12C24 5.37258 18.6275 0 12 0C5.37255 0 0 5.37258 0 12C0 18.6275 5.37255 24 12 24Z" fill="#FF6565"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 6C12.7539 6 13.3651 6.61121 13.3651 7.36517V13.4326C13.3651 14.1865 12.7539 14.7978 11.9999 14.7978C11.2459 14.7978 10.6347 14.1865 10.6347 13.4326V7.36517C10.6347 6.61121 11.2459 6 11.9999 6Z" fill="white"/>
                <path d="M13.8201 17.6798C13.8201 18.6851 13.0052 19.5 11.9999 19.5C10.9946 19.5 10.1797 18.6851 10.1797 17.6798C10.1797 16.6745 10.9946 15.8596 11.9999 15.8596C13.0052 15.8596 13.8201 16.6745 13.8201 17.6798Z" fill="white"/>
              </svg>
            `;
            notification.append(icon);

            const content = document.createElement('div');
            content.style.alignSelf = 'center';
            content.style.flexGrow = '1';

            const header = document.createElement('p');
            header.style.fontSize = '14px';
            header.style.margin = '3px 0';
            header.style.fontWeight = 'bold';
            header.innerText = 'Stort antal av denna vara';
            content.append(header);

            const moreInfo = document.createElement('p');
            moreInfo.classList.add('u-hidden');
            moreInfo.style.fontSize = '12px';
            moreInfo.style.margin = '0';
            moreInfo.innerHTML =
              'Vi rekommenderar att du kontaktar <a href="https://www.coop.se/Globala-sidor/coop-kundservice/" class="Link Link--green">Coop kundservice</a> så säkerställer vi att önskat antal finns i lager.';
            content.append(moreInfo);

            moreInfo.querySelector('a').addEventListener('click', (event) => {
              event.preventDefault();
              dataLayer.push({
                event: 'interaction',
                eventCategory: 'experiment',
                eventAction: 'click',
                eventLabel: 'contact-ks',
              });
              setTimeout(() => {
                location.href = (<HTMLAnchorElement>event.target).href;
              }, 100);
            });

            notification.append(content);

            const door = document.createElement('div');
            door.style.width = '24px';
            door.innerHTML = `
              <svg style="display:block" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#0A893D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `;
            notification.append(door);

            notification.addEventListener('click', (event) => {
              moreInfo.classList.toggle('u-hidden');

              if (!door.classList.contains('is-rotated')) {
                door.style.transform = 'rotate(180deg)';
                door.classList.add('is-rotated');
              } else {
                door.style.transform = 'unset';
                door.classList.remove('is-rotated');
              }
            });
          }

          const container = element.querySelector('.Cart-container ul');

          const messageItem = document.createElement('div');
          messageItem.style.borderBottom = '1px solid #ededed';
          container.prepend(messageItem);

          const notification = document.createElement('div');
          notification.setAttribute('role', 'button');
          notification.style.display = 'flex';
          notification.style.backgroundColor = '#FFFBDB';
          notification.style.alignItems = 'flex-start';
          notification.style.padding = '16px';
          notification.style.borderRadius = '16px';
          notification.style.margin = '16px';
          messageItem.append(notification);

          const icon = document.createElement('div');
          icon.style.marginRight = '16px';
          icon.innerHTML = `
              <svg style="display:block" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6275 24 24 18.6275 24 12C24 5.37258 18.6275 0 12 0C5.37255 0 0 5.37258 0 12C0 18.6275 5.37255 24 12 24Z" fill="#FF6565"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 6C12.7539 6 13.3651 6.61121 13.3651 7.36517V13.4326C13.3651 14.1865 12.7539 14.7978 11.9999 14.7978C11.2459 14.7978 10.6347 14.1865 10.6347 13.4326V7.36517C10.6347 6.61121 11.2459 6 11.9999 6Z" fill="white"/>
                <path d="M13.8201 17.6798C13.8201 18.6851 13.0052 19.5 11.9999 19.5C10.9946 19.5 10.1797 18.6851 10.1797 17.6798C10.1797 16.6745 10.9946 15.8596 11.9999 15.8596C13.0052 15.8596 13.8201 16.6745 13.8201 17.6798Z" fill="white"/>
              </svg>
            `;
          notification.append(icon);

          const content = document.createElement('div');
          content.style.alignSelf = 'center';
          content.style.flexGrow = '1';

          const header = document.createElement('p');
          header.style.fontSize = '16px';
          header.style.margin = '0';
          header.style.marginBottom = '3px';
          header.style.fontWeight = 'bold';
          header.innerText = 'Stort antal av vissa varor i din varukorg';
          content.append(header);

          const moreInfo = document.createElement('p');
          moreInfo.classList.add('u-hidden');
          moreInfo.style.fontSize = '14px';
          moreInfo.style.margin = '0';
          moreInfo.innerHTML =
            'Vid en större beställning av en vara kan du kontakta <a href="https://www.coop.se/Globala-sidor/coop-kundservice/" class="Link Link--green">Coop kundservice</a> först så säkerställer vi att önskat antal finns i lager.';
          content.append(moreInfo);

          moreInfo.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            dataLayer.push({
              event: 'interaction',
              eventCategory: 'experiment',
              eventAction: 'click',
              eventLabel: 'contact-ks',
            });
            setTimeout(() => {
              location.href = (<HTMLAnchorElement>event.target).href;
            }, 100);
          });

          notification.append(content);

          const door = document.createElement('div');
          door.style.width = '24px';
          door.innerHTML = `
              <svg style="display:block" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#0A893D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `;
          notification.append(door);

          notification.addEventListener('click', (event) => {
            moreInfo.classList.toggle('u-hidden');

            if (!door.classList.contains('is-rotated')) {
              door.style.transform = 'rotate(180deg)';
              door.classList.add('is-rotated');
            } else {
              door.style.transform = 'unset';
              door.classList.remove('is-rotated');
            }
          });
        });
      }
    });

    if (window.location.pathname === '/') {
      if (!coopUserSettings.isCompany) {
        cover.variantReady('T112', () => {
          let wrapper = document.querySelector('.js-page');

          let element = document.createElement('div');
          element.classList.add('Grid-cell', 'u-sizeFull');

          element.innerHTML = 'Fri frakt från 2000 kr';

          element.style.padding = '9px 0 9px 0';
          element.style.backgroundColor = '#00A142';
          element.style.fontSize = '0.75em';
          element.style.textAlign = 'center';
          element.style.color = 'white';
          element.style.marginBottom = '1.25em';
          element.style.fontWeight = 'bold';

          wrapper.prepend(element);

          let container = document.querySelector('.js-childLayoutContainer');
          container.classList.remove('u-marginTmd');
        });
      }
    } // if

    if (
      window.location.pathname === '/butiker-erbjudanden/' &&
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
                Gäller samtliga Coop-butiker t.o.m. 2022-05-01
                </p>
              </div>
        
              <div
                class="Grid-cell u-size1of2 u-xsm-size1of2 u-md-size1of4 u-lg-size1of6"
              >
              <article class="ItemTeaser" itemscope="" itemtype="http://schema.org/Product">
        <div class="ItemTeaser-content">
            <div class="ItemTeaser-media">
                <div class="ItemTeaser-image">
                    

                        <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1639032984/cloud/240782.png" alt="Lantbröd">
                </div>
                    <div class="ItemTeaser-promos">

                            <div class="ItemTeaser-splash">
                                <p class="Splash">
                                    
                                    <svg role="presentation" class="Splash-bg">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220422.0812#splash"></use>
                                    </svg>
                                    <span class="Splash-content ">
                                            <span class="Splash-pricePre"></span>
                                            <span class="Splash-priceLarge">20:-</span>
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
                <h3 class="ItemTeaser-heading" data-id="7314873552010">Lantbröd</h3>
                <p class="ItemTeaser-description">
                        <span class="ItemTeaser-brand">Fazer.</span>
                    600 g. Välj mellan olika Bistro, Havssalt och Lantfranska. Jfr-pris 33:33/kg.
                </p>
                    <div class="ItemTeaser-cta">
                            <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                    </div>
                <p style="display: none">
                    ItemID: 7314873552010<br>
                    EAGID: 31926<br>
                    Vecka: 17
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
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1621895583/429515.png" alt="Bregott/Ekologiskt bregott">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220422.0812#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre"></span>
                                                  <span class="Splash-priceLarge">29</span>
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
                      <h3 class="ItemTeaser-heading" data-id="7310860005842">Bregott/Ekologiskt bregott</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">Bregott.</span>
                          600 g. Välj mellan olika sorter. Gäller ej laktosfri. Jfr-pris 49:83/kg.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                      <p style="display: none">
                          ItemID: 7310860005842<br>
                          EAGID: 30745<br>
                          Vecka: 17
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
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1551294610/364941.png" alt="Glass klassikerlåda 18-pack">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220422.0812#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre"></span>
                                                  <span class="Splash-priceLarge">79</span>
                                                      <span class="Splash-priceSupSub">
      
                                                              <span class="Splash-priceSup">90</span>
                                                              <span class="Splash-priceSub Splash-priceUnit ">/förp</span>
                                                      </span>
                                                  <span class="Splash-pricePre"></span>
      
      
                                          </span>
                                      </p>
                                  </div>
      
                          </div>
                  </div>
                  <div class="ItemTeaser-info">
                      <h3 class="ItemTeaser-heading" data-id="8711327343573">Glass klassikerlåda 18-pack</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">Gb Glace.</span>
                          Jfr-pris 56:55/lit.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                                                                                      <p style="display: none">
                          ItemID: 8711327343573<br>
                          EAGID: 24310<br>
                          Vecka: 17
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
                          
      
                              <img class="u-posAbsoluteCenter" src="//res.cloudinary.com/coopsverige/image/upload//t_200x200_png/v1601372577/409132.png" alt="Tvättmedel/Sköljmedel">
                      </div>
                          <div class="ItemTeaser-promos">
      
                                  <div class="ItemTeaser-splash">
                                      <p class="Splash">
                                          
                                          <svg role="presentation" class="Splash-bg">
                                              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220422.0812#splash"></use>
                                          </svg>
                                          <span class="Splash-content ">
                                                  <span class="Splash-pricePre">4 för</span>
                                                  <span class="Splash-priceLarge">99:-</span>
                                                  <span class="Splash-pricePre"></span>
      
      
                                          </span>
                                      </p>
                                  </div>
      
                          </div>
                  </div>
                  <div class="ItemTeaser-info">
                      <h3 class="ItemTeaser-heading" data-id="7310610015794">Tvättmedel/Sköljmedel</h3>
                      <p class="ItemTeaser-description">
                              <span class="ItemTeaser-brand">Grumme.</span>
                          Välj mellan olika sorter flytande tvättmedel 750-800 ml och sköljmedel 600 ml. Jfr-pris 0:92/tvätt/disk.
                      </p>
                          <div class="ItemTeaser-cta">
                                  <span class="ItemTeaser-tag ItemTeaser-tag--medlem">Medlemspris</span>
                          </div>
                      <p style="display: none">
                          ItemID: 7310610015794<br>
                          EAGID: 29542<br>
                          Vecka: 17
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

    document.querySelector('.js-profileMenuTrigger').addEventListener(
      'click',
      () => {
        dataLayer.push({
          event: 'interaction',
          eventCategory: 'experiment',
          eventAction: 'click',
          eventLabel: 'profile-menu',
        });
      },
      { once: true }
    );

    cover.waitFor(
      '.ProfileMenu--dropdown',
      (element) => {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              observer.disconnect();

              cover.variantReady('T115', () => {
                const style = document.createElement('style');
                style.innerHTML = `
                  .ProfileMenu--dropdown {
                    width: 375px!important;
                    padding: 20px;
                    background: white;
                  }
                  .ProfileMenu--dropdown .icons {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin: 12px 12px 0 12px;
                    height: 125px;
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
                  .ProfileMenu-header {
                    display: none!important;
                  }
                  .ProfileMenu-close {
                    stroke: black!important;
                  }
                `;
                document.head.appendChild(style);

                const icons = document.createElement('div');
                icons.classList.add('icons');
                icons.innerHTML = `
                  <a href="/mitt-coop/mina-bestallningar/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="none"><rect width="72" height="72" x=".798" y=".234" fill="#E0EFDD" rx="36"/><path fill="url(#a)" fill-rule="evenodd" d="M20.48 48.908a19.424 19.424 0 0 0-5.752 2.32 1.787 1.787 0 0 0-.884.92c-.245.798.526 1.5 1.203 1.92 2.565 1.594 5.252 2.956 7.933 4.31 1.57.798 3.177 1.605 4.897 1.804 1.72.2 3.44-.206 5.12-.638a165.489 165.489 0 0 0 17.03-5.378 18.614 18.614 0 0 0 3.96-1.883c.795-.536 2.316-.965 1.89-1.858-.25-.52-4.719-2.388-5.126-2.76-2.66-2.452-.208-2.271-3.231-2.608" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M55.342 43.56c.294-1.085.6-2.168.918-3.25l-5.408.816-16.796 4.397-4.918 1.441-11.019-5.684c.218.113.42.698.597 1.431.306 1.291.545 3.036.652 3.453l1.28 5.007c.306 1.226.333 2.854 1.612 3.45 1.463.689 2.85 1.575 4.245 2.388 1.592.92 3.587 2.713 5.51 2.37 1.922-.344 3.978-1.346 5.888-1.953 2.153-.69 4.305-1.371 6.458-2.046 2.513-.79 5.01-1.6 7.514-2.388 2.402-.76 2.234-4.532 2.754-6.656.23-.92.471-1.84.716-2.76l-.003-.015Z" clip-rule="evenodd"/><path fill="#005537" fill-rule="evenodd" d="M29.19 40.804c1.836.267 3.672-.15 5.442-.74 3.807-1.266 7.599-3.347 11.556-2.786a9.373 9.373 0 0 1 5.72 3.164l4.778-1.343-13.684-6.439s-10.317 3.134-18.005 5.52a5.848 5.848 0 0 0 4.193 2.624Z" clip-rule="evenodd"/><path fill="url(#b)" fill-rule="evenodd" d="m28.036 46.41 23.922-6.415a9.419 9.419 0 0 0-5.653-2.977c-3.909-.528-7.652 1.435-11.42 2.63-1.735.555-3.568.951-5.374.7-1.643-.23-3.262-1.086-4.144-2.475-4.156 1.227-7.532 2.257-8.034 2.472l10.703 6.064Z" clip-rule="evenodd"/><path fill="#003D23" fill-rule="evenodd" d="M19.64 42.812a37.05 37.05 0 0 0 15.833-1.361c2.984-.95 6.09-1.607 9.001 0 .171.082.323.2.444.346.575.807-1.346 1.322-1.748 1.742-.887.92-2.111 1.533-3.345 2.023-1.78.709-13.12 3.373-15.027 3.68" clip-rule="evenodd"/><path fill="url(#c)" fill-rule="evenodd" d="m50.852 41.126-16.796 4.397-4.918 1.441-11.019-5.684c.218.113.42.698.597 1.431l1.665.212c1.154-.11 2.103.953 2.608 2.033.505 1.079.802 2.315 1.607 3.176.805.862 2.035 1.227 2.84 2.116 1.148 1.26 1.334 3.443 2.85 4.176 1.413.684 3.032-.383 4.091-1.573 2.008-2.26 3.575-5.332 6.427-6.132 2.56-.706 5.265.723 7.884.325 2.47-.374 4.441-2.29 6.654-3.483.294-1.086.6-2.17.918-3.25l-5.408.815Z" clip-rule="evenodd"/><path fill="#C6C5C4" fill-rule="evenodd" d="M28.953 43.947s.487.122.447.858l-7.48-2.174 1.39-1.744 5.643 3.06Z" clip-rule="evenodd"/><path fill="#007548" fill-rule="evenodd" d="m43.981 34.67 10.25 3.933 1.818-.5c.995-.275 2.562-.46 1.855-1.106-1.638-1.328-3.924-1.972-5.873-2.72a462.691 462.691 0 0 1-6.428-2.523c-1.224-.503-2.448-.767-3.639-.476l-10.592 2.677-7.796 1.742c-1.53.34-3.06.478-4.57.877-.749.196-1.584.328-2.19.83-.469.39-.426.706 0 1.138.483.487 2.772 1.975 3.507 1.781l21.745-5.76a2.676 2.676 0 0 1 1.913.106Z" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M16.574 38.21s.839 3.067.988 3.119c.15.052 11.2 6.215 11.35 6.215a5.63 5.63 0 0 0 2.974 0c1.665-.454 24.362-7.224 24.362-7.224l.756-.254 1.04-2.662c-2.843.788-6.02 1.812-8.875 2.6-4.223 1.172-8.591 2.147-12.732 3.554a24.499 24.499 0 0 1-5.885 1.3c-1.727.141-3.367-.981-4.867-1.71l-2.889-1.414-6.222-3.523Z" clip-rule="evenodd"/><path fill="#333" fill-rule="evenodd" d="M43.865 23.25c-.652-.27-1.365-.438-2.02-.677-.78-.282-1.558-.576-2.335-.874a277.433 277.433 0 0 1-4.462-1.763 74.936 74.936 0 0 1-1.822-.742c-2.35-1.005-2.92.92-2.88 1.37a2.1 2.1 0 0 0 0 .44s-.113 14.155-.042 14.716c0 0 0 1.129.612 1.065.869-.086.737-1.478.737-1.478.05-1.84.095-3.689.138-5.547a632.141 632.141 0 0 0 .116-6.295c-.043-.669-.036-1.34.019-2.008a.991.991 0 0 1 1.276-.855c.946.245 1.803.735 2.7 1.113.896.377 1.808.757 2.714 1.13 1.206.504 2.412 1.05 3.651 1.47 1.013.346 1.772 1.06 1.895 2.146a8.1 8.1 0 0 1-.05 1.564c-.26 3.035-.572 13.797-.572 13.797s-.131 1.3.613 1.266c.884-.04.826-1.643.826-1.643l.973-13.528c.117-1.606.043-3.514-1.53-4.406-.18-.086-.367-.178-.557-.26Z" clip-rule="evenodd"/><path fill="#007548" fill-rule="evenodd" d="M30.974 35.49a.251.251 0 0 0-.187.135.56.56 0 0 0-.052.233.346.346 0 0 0 .037.193.306.306 0 0 0 .144.117.308.308 0 0 0 .113.028.247.247 0 0 0 .104-.025.356.356 0 0 0-.134-.68" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M44.26 41.896a.306.306 0 1 0 .193.13.452.452 0 0 0-.19-.148" clip-rule="evenodd"/><path fill="#7A7B7B" fill-rule="evenodd" d="M20.816 51.984a46.851 46.851 0 0 1 3.627 2.612c.082.052 1.784-1.938 1.922-2.192a9.519 9.519 0 0 0 1.05-3.229c.128-.969-.037-1.968.327-2.897.288-.73.689-1.368 1.6-1.509a7.64 7.64 0 0 1-.77-.23l-5.855-2.4s-2.427-1.196-3.245 2.486" clip-rule="evenodd" opacity=".31"/><path fill="#EDEDED" fill-rule="evenodd" d="M22.102 40.136s-2.975-2.11-4.567 1.61c-1.27 2.965-2.448 5-3.385 5.083l8.714 6.273s2.803-2.74 3.213-5.764c.508-3.728 2.877-3.388 2.877-3.388l-6.852-3.814Z" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M16.81 46.363c1.178.883 2.335 1.686 3.513 2.57.174.142.357.276.547.398.114.07.306.18.279.306-.067.052-.193-.043-.279-.095-.963-.564-1.744-1.288-2.671-1.913-.254-.172-.517-.328-.762-.509a3.97 3.97 0 0 1-.373-.307 1.426 1.426 0 0 1-.306-.343c-.04-.064-.037-.16.052-.107ZM17.547 45.208c-.037.073.043.147.11.193l4.848 3.112c.214.138.4.306.612.432.055.037.177.09.202.046-.037-.245-.27-.37-.478-.506l-4.75-3.136c-.161-.098-.446-.264-.544-.141ZM18.257 43.846c.426.251.796.613 1.224.859.227.14.435.266.67.395.191.104.37.227.536.368.104.086.236.172.171.307-.064.135-1.334-.868-2.05-1.27a2.422 2.422 0 0 1-.612-.524c-.027-.052-.003-.166.061-.135ZM19.05 43.06c.731.411 1.401.92 2.102 1.383.094.066.197.116.306.15.233.065-.033-.239-.107-.288l-1.203-.79-.611-.4c-.11-.07-.206-.165-.306-.232a.425.425 0 0 0-.178-.08c-.193-.01-.08.209-.003.258ZM19.54 41.445l.036.024c.17.123.348.237.53.34l.597.372 1.18.733c1.035.643 2.067 1.292 3.098 1.947.113.07.306.202.275.282-.092.138-2.953-1.79-4.486-2.591a6.743 6.743 0 0 1-.918-.543 1.833 1.833 0 0 1-.435-.365c-.033-.058-.049-.214.09-.208l.033.009ZM20.791 40.933c.062.055.144.098.2.141.107.086.22.166.336.24.131.075.267.143.407.202.122.058.239.125.358.187.05.03.104.055.16.076.223.086-.022-.187-.093-.23l-1.279-.8c-.07-.043-.19-.061-.165.064.012.047.04.09.076.12Z" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M26.674 47.666c-.052-.015-.08.062-.08.117.006 2.669.152 5.336.438 7.99.003.14.042.278.113.399.012-.854-.03-1.707-.129-2.554-.04-.34-.088-.681-.11-1.022-.027-.441 0-.886 0-1.327a32.552 32.552 0 0 0-.211-3.275 3.075 3.075 0 0 0-.043-.33M29.38 48.148l.235 5.785c.009.644.069 1.286.18 1.92.126-.022.148-.187.145-.307l-.325-7.303c0-.102-.082-.243-.165-.184M33.248 47.402v4.446c0 1.766 0 3.544.349 5.277-.034-1.604-.306-3.201-.215-4.799.019-.306.05-.637.062-.956.033-1.144-.215-2.294-.065-3.428.028-.206.05-.46-.119-.58M38.328 46.029c-.45 1.551-.438 3.192-.627 4.798-.083.693-.202 1.383-.276 2.08-.095.92-.1 1.879-.104 2.817-.01.156.004.312.04.463.11-1.677.431-3.336.557-5.013.028-.343.046-.69.067-1.036.092-1.28.27-2.553.536-3.808a.838.838 0 0 0 .018-.427M42.2 44.876a60.64 60.64 0 0 0-1.26 9.058c-.031.415-.031.832 0 1.248a.221.221 0 0 0 .091.202c.186-2.12.413-4.234.682-6.344.138-1.295.374-2.577.707-3.836.04-.135.061-.306-.064-.38M46.048 43.75c-.157.614-.374 1.193-.53 1.8-.453 1.751-.388 3.59-.676 5.375a18.357 18.357 0 0 0-.306 2.082c0 .104 0 .227.098.276.162-.861.278-1.73.398-2.597.278-2.303.679-4.59 1.2-6.85 0-.052 0-.128-.04-.14M50.12 42.559c-.269.83-.488 1.675-.654 2.532-.471 2.27-.835 4.556-1.2 6.844-.027.168-.04.37.095.475.082-.28.142-.564.18-.852a107.476 107.476 0 0 1 1.837-8.984M54.142 41.286a101.17 101.17 0 0 0-1.836 10.731c-.03.127-.01.26.058.371.214-.92.306-1.867.44-2.808a76.998 76.998 0 0 1 1.488-8.08" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="m24.966 50.343 3.366 2.407c.493.35.986.696 1.494 1.017 0-.248-.22-.435-.423-.582l-4.302-3.103" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M29.796 53.366a27.53 27.53 0 0 1 1.867-.512c.336-.08.676-.153 1.01-.236 1.668-.414 3.262-1.08 4.93-1.493a.281.281 0 0 1 .101 0c.077.021.095.132.052.202a.367.367 0 0 1-.196.129c-.712.24-1.439.435-2.176.585-1.916.485-3.743 1.356-5.705 1.595" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M37.842 51.106a65.693 65.693 0 0 1 6.553-2.146l.587-.172c.074-.021.187-.015.187.061a.12.12 0 0 1-.052.08c-.212.15-.453.255-.707.307-1.316.392-2.623.815-3.93 1.242l-1 .33-1.929.614" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M45.224 48.69c.964-.35 1.91-.745 2.865-1.125a96.26 96.26 0 0 1 6.491-2.337c.04.077.025.17-.037.23a.574.574 0 0 1-.214.123l-7.269 2.803c-.636.266-1.293.48-1.965.64" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M14.275 26.09c2.326 2.882 4.612 5.734 6.914 8.634.085.108.17.258.088.365-.14.08-.306-.126-.395-.251a207.905 207.905 0 0 1-5.358-6.804c-.462-.613-.896-1.184-1.328-1.812 0 0-.092-.114-.015-.166a.055.055 0 0 1 .095.034ZM19.45 22.003c1.938 3.336 4.083 6.546 6.305 9.698.19.267.447.709.392.886-.172.132-.38-.193-.505-.367-2.143-2.947-4.285-5.915-5.904-9.199-.137-.276-.269-.558-.391-.843 0 0-.107-.175-.046-.236s.15.061.15.061ZM34.53 12.54a.224.224 0 0 1 .059.139l.266 1.928.27 1.92.122.886c.028.19.052.38.08.573 0 .09.033.181.04.27 0 .018 0 .043-.02.05-.07.02-.137-.13-.158-.176a3.004 3.004 0 0 1-.117-.432l-.119-.457c-.08-.306-.153-.613-.223-.92a15.912 15.912 0 0 1-.306-1.86 10.284 10.284 0 0 1-.058-.92v-.694a1.134 1.134 0 0 1 .015-.226.307.307 0 0 1 .052-.102c.037-.049.098.022.098.022ZM43.17 12.25c.043.052 0 .193-.021.251-.025.123-.04.245-.062.368-.052.307-.119.595-.195.89-.157.588-.35 1.167-.533 1.747-.113.346-.223.696-.321 1.048-.429 1.534-1.154 4.6-1.304 4.6-.205-.037.05-.816.153-1.227l.471-1.793c.493-1.89.98-3.76 1.616-5.608.025-.074.061-.138.098-.24.01-.036.061-.073.098-.036ZM60.74 17.824a.204.204 0 0 1 0 .062c-.06.144-.147.275-.256.386-.117.144-.239.285-.361.423a47.533 47.533 0 0 1-1.142 1.208A319.776 319.776 0 0 0 49.09 30.39c-.192.212-.538.638-.63.577-.123-.154.306-.595.523-.85a206.192 206.192 0 0 1 6.93-7.65c1.447-1.533 2.92-3.023 4.388-4.525.077-.07.334-.337.429-.19a.125.125 0 0 1 .012.073ZM57.142 29.404c-1.27.918-2.5 1.885-3.694 2.901a5.082 5.082 0 0 0-.42.393 3.96 3.96 0 0 0-.229.226c-.074.08-.104.246.018.221a1.31 1.31 0 0 0 .368-.19c.266-.16.52-.334.774-.509l.061-.043c.438-.306.857-.613 1.267-.947.218-.172.429-.344.643-.518l2.66-2.147 2.671-2.146.306-.24c.046-.036.331-.208.193-.232a.305.305 0 0 0-.147.037c-.178.076-.349.169-.51.276-.558.337-1.087.72-1.608 1.107-.612.45-1.21.917-1.793 1.404-.266.22-.53.444-.783.68" clip-rule="evenodd"/><defs><linearGradient id="a" x1="46.295" x2="-7.441" y1="52.867" y2="41.819" gradientUnits="userSpaceOnUse"><stop stop-color="#969696"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="b" x1="13.866" x2="41.944" y1="40.838" y2="53.968" gradientUnits="userSpaceOnUse"><stop stop-color="#003C1B"/><stop offset=".99" stop-color="#005537"/></linearGradient><linearGradient id="c" x1="49.304" x2="39.169" y1="43.568" y2="61.806" gradientUnits="userSpaceOnUse"><stop stop-color="#00AA46"/><stop offset=".2" stop-color="#009F44"/><stop offset=".54" stop-color="#00823F"/><stop offset=".99" stop-color="#005537"/></linearGradient></defs></svg>
                    <span>Mina beställningar</span>
                  </a>
                  <a href="/mitt-coop/sparade-varukorgar/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="none"><rect width="72" height="72" x=".798" fill="#E0EFDD" rx="36"/><path fill="url(#a)" fill-rule="evenodd" d="M18.256 48.366a25.06 25.06 0 0 0-7.42 2.995c-.514.242-.92.664-1.141 1.187-.316 1.03.679 1.935 1.552 2.477 3.309 2.058 6.776 3.815 10.236 5.563 2.025 1.03 4.099 2.07 6.318 2.327 2.22.257 4.439-.265 6.607-.823a213.54 213.54 0 0 0 21.972-6.94 24.015 24.015 0 0 0 5.11-2.43c1.027-.692 2.99-1.246 2.441-2.397-.324-.673-6.09-3.083-6.615-3.561-3.431-3.166-.268-2.932-4.17-3.368" clip-rule="evenodd" opacity=".5" style="mix-blend-mode:multiply"/><path fill="#00AA46" fill-rule="evenodd" d="M62.216 39.458c.38-1.4.774-2.799 1.185-4.194l-6.978 1.052-21.672 5.674-6.347 1.86-14.216-7.336c.28.146.54.902.77 1.848.395 1.666.703 3.917.84 4.455.551 2.158 1.101 4.312 1.652 6.461.395 1.583.43 3.684 2.08 4.452 1.888.89 3.677 2.034 5.478 3.082 2.054 1.187 4.629 3.502 7.109 3.059 2.48-.444 5.133-1.737 7.598-2.52 2.777-.89 5.554-1.77 8.332-2.64 3.242-1.02 6.465-2.065 9.695-3.082 3.1-.981 2.883-5.848 3.554-8.59.296-1.187.608-2.374.924-3.561l-.004-.02Z" clip-rule="evenodd"/><path fill="#005537" fill-rule="evenodd" d="M28.471 35.9c2.37.345 4.74-.193 7.022-.953 4.913-1.634 9.805-4.32 14.912-3.597 2.869.431 5.488 1.88 7.38 4.084L63.95 33.7l-17.656-8.31S32.98 29.436 23.06 32.515a7.545 7.545 0 0 0 5.41 3.387Z" clip-rule="evenodd"/><path fill="url(#b)" fill-rule="evenodd" d="m26.983 43.134 30.866-8.278a12.152 12.152 0 0 0-7.294-3.842c-5.043-.68-9.873 1.852-14.734 3.395-2.24.716-4.605 1.227-6.935.902-2.12-.297-4.21-1.4-5.347-3.193-5.363 1.583-9.719 2.912-10.366 3.19l13.81 7.826Z" clip-rule="evenodd"/><path fill="#003D23" fill-rule="evenodd" d="M19.254 37.97c6.856.9 10.722.822 17.325-1.234 3.85-1.227 7.858-2.074 11.614 0 .22.106.416.258.573.447.742 1.04-1.738 1.705-2.255 2.247-1.146 1.187-2.725 1.979-4.317 2.612-2.298.914-15.072 2.834-17.532 3.23" clip-rule="evenodd"/><path fill="url(#c)" fill-rule="evenodd" d="M56.423 36.316 34.751 41.99l-6.347 1.86-14.216-7.336c.28.146.54.902.77 1.848l2.148.273c1.489-.143 2.713 1.23 3.365 2.623.651 1.393 1.034 2.987 2.073 4.1 1.038 1.111 2.626 1.582 3.665 2.73 1.48 1.626 1.721 4.443 3.676 5.389 1.825.882 3.914-.495 5.28-2.03 2.59-2.916 4.613-6.881 8.293-7.914 3.302-.91 6.793.934 10.173.42 3.187-.483 5.73-2.956 8.585-4.495.38-1.4.774-2.799 1.185-4.194l-6.978 1.052Z" clip-rule="evenodd"/><path fill="#007548" fill-rule="evenodd" d="m47.557 27.984 13.226 5.076 2.346-.645c1.283-.356 3.305-.593 2.393-1.428-2.113-1.713-5.063-2.544-7.579-3.51a598.451 598.451 0 0 1-8.292-3.256c-1.58-.65-3.16-.99-4.696-.613l-13.668 3.454-10.058 2.247c-1.974.44-3.95.617-5.896 1.132-.967.253-2.046.423-2.828 1.072-.604.503-.548.91 0 1.468.624.63 3.578 2.548 4.526 2.299l28.058-7.435c.812-.26 1.69-.21 2.468.139Z" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M12.193 32.553s1.082 3.957 1.276 4.024c.194.068 14.45 8.02 14.643 8.02a7.264 7.264 0 0 0 3.839 0c2.148-.585 31.434-9.321 31.434-9.321l.976-.329 1.342-3.434c-3.668 1.017-7.768 2.338-11.452 3.355-5.45 1.511-11.085 2.77-16.428 4.586a31.609 31.609 0 0 1-7.594 1.678c-2.227.181-4.344-1.267-6.28-2.208L20.223 37.1l-8.029-4.547Z" clip-rule="evenodd"/><path fill="#333" fill-rule="evenodd" d="M47.407 13.249c-.841-.349-1.761-.566-2.606-.875-1.007-.364-2.01-.744-3.013-1.128a357.1 357.1 0 0 1-5.758-2.275c-.79-.312-1.58-.629-2.35-.957-3.033-1.298-3.767 1.187-3.716 1.769-.02.188-.02.377 0 .565 0 0-.146 18.269-.055 18.993 0 0 0 1.456.79 1.373 1.121-.111.951-1.907.951-1.907.064-2.374.123-4.76.178-7.158a819.68 819.68 0 0 0 .15-8.123c-.055-.864-.047-1.73.024-2.592a1.28 1.28 0 0 1 1.647-1.104c1.22.316 2.326.95 3.483 1.436 1.157.487 2.334.978 3.503 1.46 1.555.65 3.111 1.353 4.71 1.896 1.308.447 2.287 1.369 2.445 2.77a10.44 10.44 0 0 1-.063 2.017c-.336 3.917-.738 17.806-.738 17.806s-.17 1.677.79 1.634c1.14-.052 1.066-2.121 1.066-2.121L50.1 19.27c.15-2.074.056-4.535-1.974-5.686-.233-.11-.474-.23-.719-.336Z" clip-rule="evenodd"/><path fill="#007548" fill-rule="evenodd" d="M30.774 29.044a.324.324 0 0 0-.241.174.727.727 0 0 0-.067.3.447.447 0 0 0 .047.25c.045.068.11.12.186.15a.395.395 0 0 0 .146.036.317.317 0 0 0 .134-.032.46.46 0 0 0-.174-.878" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M47.917 37.31a.395.395 0 1 0 .248.166.581.581 0 0 0-.244-.19" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M24.253 44.512c-.069-.013-.095.088-.088.16.33 3.428.84 6.837 1.527 10.213.02.18.087.351.193.498a25.562 25.562 0 0 0-.473-3.266c-.093-.432-.197-.864-.265-1.299-.089-.563-.107-1.138-.16-1.705a42.005 42.005 0 0 0-.667-4.182 3.952 3.952 0 0 0-.095-.42M28.716 45.377l.304 7.467c.01.83.089 1.659.233 2.477.162-.028.19-.242.186-.396L29.02 45.5c0-.13-.106-.313-.213-.237M33.708 44.416v5.737c0 2.28 0 4.574.45 6.81-.043-2.07-.395-4.131-.276-6.193.023-.396.063-.823.079-1.234.043-1.476-.277-2.96-.083-4.424.035-.265.063-.593-.154-.748M40.263 42.644c-.58 2.002-.564 4.119-.81 6.192-.106.894-.26 1.785-.355 2.683-.122 1.187-.13 2.425-.134 3.636-.012.2.005.402.052.597.142-2.164.556-4.305.718-6.469.036-.443.06-.89.087-1.337.118-1.652.349-3.294.691-4.915.055-.178.064-.367.024-.55M19.186 41.95c.054 1.638.581 3.217.903 4.827.139.694.24 1.397.388 2.092.198.917.493 1.845.785 2.752.04.153.102.299.184.434-.42-1.653-.632-3.355-1.038-5.012-.081-.34-.173-.68-.26-1.022a28.502 28.502 0 0 1-.681-3.842.851.851 0 0 0-.116-.417M45.259 41.155a78.256 78.256 0 0 0-1.627 11.688c-.04.536-.04 1.075 0 1.61a.285.285 0 0 0 .118.262c.24-2.736.534-5.464.881-8.187.178-1.67.483-3.325.912-4.95.052-.174.08-.395-.083-.49M50.223 39.703c-.201.791-.482 1.54-.683 2.323-.584 2.259-.502 4.633-.873 6.936a23.674 23.674 0 0 0-.395 2.686c0 .135 0 .293.127.357.209-1.112.359-2.232.513-3.352.36-2.972.876-5.922 1.548-8.84 0-.066 0-.165-.051-.181M55.48 38.164a27.564 27.564 0 0 0-.846 3.268c-.608 2.928-1.078 5.88-1.548 8.832-.035.217-.051.479.123.613.105-.36.182-.728.232-1.1a138.725 138.725 0 0 1 2.37-11.593M60.668 36.523a130.52 130.52 0 0 0-2.37 13.848.634.634 0 0 0 .076.479c.276-1.187.395-2.41.568-3.625a99.367 99.367 0 0 1 1.92-10.426" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="m16.28 44.19 11.086 7.126c.636.451 1.271.898 1.927 1.314 0-.32-.284-.562-.545-.752l-12.739-8.23" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M29.253 52.112c.79-.25 1.6-.467 2.41-.66.434-.103.872-.198 1.302-.305 2.153-.535 4.21-1.393 6.362-1.927a.361.361 0 0 1 .13 0c.1.028.123.17.068.26a.474.474 0 0 1-.253.167 23.7 23.7 0 0 1-2.808.756c-2.472.625-4.83 1.749-7.36 2.057" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M39.635 49.196a84.74 84.74 0 0 1 8.455-2.77l.758-.222c.095-.027.241-.02.241.08a.155.155 0 0 1-.067.102 2.412 2.412 0 0 1-.912.396 209.183 209.183 0 0 0-5.07 1.602l-1.292.428-2.488.791" clip-rule="evenodd"/><path fill="#fff" fill-rule="evenodd" d="M49.16 46.078c1.245-.452 2.465-.962 3.697-1.453a124.18 124.18 0 0 1 8.376-3.015.254.254 0 0 1-.047.297.742.742 0 0 1-.277.158l-9.379 3.617c-.821.344-1.67.62-2.535.827" clip-rule="evenodd"/><mask id="d" width="71" height="35" x="3" y="7" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#C4C4C4" d="M29.53 41.215c-5.138 0-11.538-5.408-16.225-8.112l-7.03-2.975-1.909-5.788-1.14-3.42 2.28-3.42h3.04l6.84 4.18 6.84-4.94 1.52 11.78c7.662-1.983 20.872-5.152 22.819-5.152.663 0 5.78 3.126 9.464 2.434C70.09-3.131 82.259 4.44 65.493 31.48c-11.627 3.245-30.826 9.735-35.964 9.735Z"/></mask><g mask="url(#d)"><path fill="#FF6565" fill-rule="evenodd" d="M40.868 35.397c-.553-1.49-2.19-1.486-3.492-.52a3.443 3.443 0 0 0-1.337 3.126c.05.79.257 1.56.607 2.27a2.16 2.16 0 0 0 2.21.962c1.645-.163 3.783-1.278 4.277-2.988.359-1.233-.884-3.729-2.265-2.85Z" clip-rule="evenodd"/><path fill="#CC3737" fill-rule="evenodd" d="M40.884 35.401c-.554-1.49-2.19-1.486-3.485-.517a3.427 3.427 0 0 0-1.337 3.126c.044.79.251 1.563.608 2.27 0 0 .94.34 1.297-1.549.05-.465.266-.897.607-1.218.348-.269.742-.207 1.133-.322a1.73 1.73 0 0 0 .858-.614c.263-.331.378-.757.319-1.176Z" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M41.066 35.155a2 2 0 0 0-.382-1.538 3.147 3.147 0 0 0-1.287-.743 5.005 5.005 0 0 0 1.177 1.89c-.556-.146-1.062-.515-1.664-.044-.094.068-.197.175-.128.26a.227.227 0 0 0 .173.046l1.757.01a1.137 1.137 0 0 0-.794.69c-.15.362-.211.755-.177 1.146l1.285-1.341c.018.439.073.875.166 1.304a.542.542 0 0 0 .488.28c.302-.668.144-1.146-.465-1.887a3.09 3.09 0 0 0 2.777-.107c.05-.029.101-.065.1-.124a.154.154 0 0 0-.048-.105 1.811 1.811 0 0 0-1.473-.608c-.565.01-1.093.28-1.434.73" clip-rule="evenodd"/><path fill="#FFB43D" fill-rule="evenodd" d="M59.797 32.9c-2.876-2.739-2.397-4.69-2.224-8.071l2.864-6.028c1.248-2.623 2.602-5.387 5.266-6.754a5.35 5.35 0 0 1 3.678-.55c3.978.945 2.73 8.19-.267 11.325a3.454 3.454 0 0 0-.426.066l-1.38.272a5.35 5.35 0 0 1-.863.131c-.74.01-1.46-.314-2.207-.332-.747-.019-1.631.465-1.575 1.21.044.574.607.988 1.097 1.265a14.2 14.2 0 0 1 2.46 2.038c.02.31.03.62.04.94a7.614 7.614 0 0 1-1.204 3.73 8.582 8.582 0 0 1-1.703 2.144l-.106-.168c-1.453.893-3.087-.868-3.45-1.218Z" clip-rule="evenodd"/><path fill="url(#e)" fill-rule="evenodd" d="M63.377 21.134a16.106 16.106 0 0 0-2.045 1.993c-1.685 2.154-.595 5.973-3.433 7.185-1.12.563-1.516.847-2.767.803-1.587.554 5.882 13.654-.562 18.18a11.687 11.687 0 0 0 2.63-2.578 48.348 48.348 0 0 0 2.982-4.81 7.511 7.511 0 0 0 1.184-2.854c.014-.39-.1-.775-.325-1.095a1.724 1.724 0 0 1 .548-2.431 8.864 8.864 0 0 0 3.4-3.38 7.615 7.615 0 0 0 1.205-3.732 4.865 4.865 0 0 0-.352-2.182c-.234-.432-.788-.518-.655-1.077.133-.56 1.726-.907 2.25-1.133 4.053-1.733 6.514-11.398 1.875-12.494-.99-.236-1.754.913-2.251 1.787a7.456 7.456 0 0 0-.778 2.917 7.371 7.371 0 0 1-.22 1.346 8.053 8.053 0 0 1-2.686 3.555Z" clip-rule="evenodd"/><path fill="#D1720B" fill-rule="evenodd" d="M61.644 35.55a1.705 1.705 0 0 0-.549 2.431c.217.323.328.705.316 1.094a7.455 7.455 0 0 1-1.183 2.844 47.542 47.542 0 0 1-2.974 4.821c-.74.99-1.63 1.86-2.638 2.577-2.74 1.904-7.257 1.996-6.934-2.569a7.893 7.893 0 0 1 .81-2.84l9.079-19.06c-.21 3.377-.652 5.331 2.225 8.07.362.35 1.996 2.111 3.429 1.235l.107.168a8.805 8.805 0 0 1-1.688 1.229Z" clip-rule="evenodd"/><path fill="url(#f)" fill-rule="evenodd" d="M62.645 24.167c-.057-.744.828-1.238 1.574-1.21.746.027 1.467.343 2.207.332.29-.02.58-.063.863-.13l1.38-.273c.14-.03.283-.053.427-.066-.453.496-1 .897-1.61 1.18-.524.225-2.1.49-2.25 1.132-.15.641.421.644.664 1.077.19.394.293.824.302 1.262a14.19 14.19 0 0 0-2.46-2.04c-.516-.316-1.054-.69-1.097-1.264Z" clip-rule="evenodd"/><path fill="url(#g)" fill-rule="evenodd" d="m38.564 39.064-3.246-7.654-8.128 2.665-3.258 1.014 3.787 8.315c-.003.039-.005.073.023.108.35 1.08 2.095 1.719 4.158 1.617 1-.047 1.985-.256 2.915-.618 3.374-1.303 4.258-3.879 3.749-5.447Z" clip-rule="evenodd"/><path fill="url(#h)" fill-rule="evenodd" d="M30.593 43.556c-.215-.935.859-1.785.703-2.73-.13-.805-1.027-1.2-1.748-1.595a6.79 6.79 0 0 1-1.897-1.56 1.69 1.69 0 0 1-.374-.644 3.224 3.224 0 0 1 .206-1.345 2.26 2.26 0 0 0-.31-1.583l-3.242 1.013 3.747 8.298.023.107c.349 1.078 2.08 1.715 4.137 1.613a1.508 1.508 0 0 0-.104-.141c-.398-.477-1.004-.836-1.14-1.433Z" clip-rule="evenodd"/><path fill="#fff" d="M30.515 36.051c3.153-1.003 5.303-3.096 4.8-4.674-.502-1.578-3.465-2.044-6.618-1.04-3.154 1.003-5.303 3.096-4.801 4.674.502 1.578 3.465 2.043 6.619 1.04Z"/><path fill="#005537" d="M29.697 33.88c1.104-.352 1.858-1.085 1.682-1.637-.176-.553-1.214-.715-2.319-.364-1.105.352-1.858 1.085-1.682 1.637.175.552 1.214.715 2.319.364Z"/><path fill="#235339" fill-rule="evenodd" d="M20.818 32.054s-1.768-3.009-3.898-3.298c-2.131-.29-3.175.342-3.222-1.188-.046-1.53-2.536-2.028-3.343-2.905-.806-.876-4.007-.59-4.176.488-.23 1.428 2.865 1.467 3.026 2.689.198 1.403.064 3.992 2.31 3.78 1.87-.193 2.91-1.602 3.975-.443 1.065 1.16 5.328.877 5.328.877Z" clip-rule="evenodd"/><path fill="#00AA46" fill-rule="evenodd" d="M21.12 32.61c-.38-1.626 1.385-3.067 1.358-4.739a.757.757 0 0 0-.114-.441c-.453-.585-1.611.456-2.08.01l-.075-.095-.03-.1a3.289 3.289 0 0 1 .25-2.225c.292-.741.647-1.503.583-2.299-.065-.795-.767-1.598-1.548-1.446a1.64 1.64 0 0 0-.978.772c-.416.623-.646 1.357-1.112 1.942-.039.021-.063.07-.1.104a1.756 1.756 0 0 1-.176.156c-.477.38-1.27.689-1.647.214-.167-.206-.251-.463-.376-.693-.404-.56-1.286-.148-1.844-.132a3.062 3.062 0 0 1-.801-.069 1.006 1.006 0 0 1-.162-.038 2.724 2.724 0 0 1-1.316-.842c-.62-.7-1.067-1.385-1.635-1.988l-.25-.247a5.028 5.028 0 0 0-1.183-.868c-.77-.399-1.728-.685-2.453-.03-1.342 1.231-.01 3.686 1.177 4.477.214.122.439.226.67.31l.045.017.475.19c1.263.478 2.854 1.141 2.54 2.287a3.67 3.67 0 0 1-.424.709c-.353.654.031 1.428.65 1.873.056.042.115.08.177.115.155.092.322.16.497.204.955.232 1.96-.092 2.916-.247.589-.114 1.196-.1 1.78.041l.216.074a1.9 1.9 0 0 1 .777.505c.25.287.401.648.623.956.049.09.13.156.198.235.068.08.095.11.146.158.817.775 2.063 1.025 3.214 1.212l.011-.062Z" clip-rule="evenodd"/><path fill="#235339" fill-rule="evenodd" d="m7.3 24.372.474.19a12.092 12.092 0 0 0 2.197-.395 7.332 7.332 0 0 0 2.802 2.12c.404.14.822.23 1.247.27.185.026.373.06.555.097-.893.384-3.358 1.524-4.043 2.781a1.5 1.5 0 0 0 .178.115c.755-1.386 3.896-2.68 4.234-2.799a6.503 6.503 0 0 1 3.077 1.775 4.5 4.5 0 0 0-2.086.97.1.1 0 0 0-.036.055l.216.074c.6-.48 1.315-.794 2.074-.909.193.216.37.444.532.684.242.372.434.69.596.97l.293.486a2.464 2.464 0 0 0-1.901.467c.032.058.095.11.146.157a2.385 2.385 0 0 1 1.91-.386c.238.36.5.705.784 1.03a.106.106 0 0 0 .186-.07.11.11 0 0 0-.03-.08 8.925 8.925 0 0 1-.783-1.026c-.446-1.378.222-3.185.347-3.5l-.076-.095-.03-.1a.093.093 0 0 0-.077.042 6.982 6.982 0 0 0-.507 3.104l-.088-.163c-.157-.288-.359-.596-.605-.976a6.18 6.18 0 0 0-.564-.726c-.011-.02-.953-1.497-1.031-4.374a.142.142 0 0 0-.036-.066 1.766 1.766 0 0 1-.177.156c.016 1.304.275 2.595.763 3.805a6.829 6.829 0 0 0-2.867-1.526c-.14-.11-1.848-1.425-2.601-2.944a1.007 1.007 0 0 1-.162-.039.106.106 0 0 0-.037.126 9.429 9.429 0 0 0 2.324 2.767l-.48-.071a5.548 5.548 0 0 1-1.2-.256 7.186 7.186 0 0 1-2.741-2.093 28.083 28.083 0 0 0-.815-3.299l-.25-.247a.11.11 0 0 0-.026.1c.336 1.02.607 2.06.81 3.115l-.148-.181a15.013 15.013 0 0 0-4.217-3.72.106.106 0 0 0-.15.142.12.12 0 0 0 .026.047 14.791 14.791 0 0 1 4.166 3.67l.292.346c-.67.172-2.034.463-2.379.318 0 0-.068-.043-.188.052" clip-rule="evenodd"/><path fill="#FFB43B" fill-rule="evenodd" d="M27.488 52.868a4.505 4.505 0 0 0 .66-2.126l-.003-.098a7.223 7.223 0 0 0 .023-2.46l-.502-3.372a60.473 60.473 0 0 0-1.446-7.492c-.4-1.424-.954-2.89-2.084-3.843-1.13-.953-3.02-1.132-4.036-.032l-.089.114c-.125.14-.225.301-.294.476-.165.381-.245.794-.233 1.21l.012.023c.002.105.011.205.023.31l.012.124.044.248.046.196.03.12.09.288.066.176.078.144.093.171.223.413c.748 1.23 1.545 2.394 2.304 3.618l.395.728c.89 1.707 1.383 3.57 2.202 5.35l.19.35c.479.938 1.091 1.845 1.556 2.786.431.791.664 1.675.679 2.576l-.04.002Z" clip-rule="evenodd"/><path fill="url(#i)" fill-rule="evenodd" d="M28.15 50.772a4.575 4.575 0 0 1-.662 2.125c.044-2.097-1.526-3.824-2.413-5.739-.927-2.014-1.44-4.173-2.611-6.075-.757-1.22-1.556-2.388-2.302-3.615a4.073 4.073 0 0 1-.614-2.984c.105-.42.347-1.084.822-1.135a1.112 1.112 0 0 1 1.149.832c.023.27.026.543.01.815.029.905.761 1.339 1.252 2.004a7.5 7.5 0 0 1 1.31 4.092c.156 3.122 2.117 5.145 2.459 5.664.78 1.143 1.66 2.599 1.6 4.016Z" clip-rule="evenodd"/></g><defs><linearGradient id="a" x1="51.567" x2="-17.77" y1="53.476" y2="39.223" gradientUnits="userSpaceOnUse"><stop stop-color="#969696"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="b" x1="8.698" x2="44.93" y1="35.944" y2="52.884" gradientUnits="userSpaceOnUse"><stop stop-color="#003C1B"/><stop offset=".99" stop-color="#005537"/></linearGradient><linearGradient id="c" x1="54.425" x2="41.346" y1="39.467" y2="63.002" gradientUnits="userSpaceOnUse"><stop stop-color="#00AA46"/><stop offset=".2" stop-color="#009F44"/><stop offset=".54" stop-color="#00823F"/><stop offset=".99" stop-color="#005537"/></linearGradient><linearGradient id="e" x1="66.649" x2="50.224" y1="9.369" y2="28.08" gradientUnits="userSpaceOnUse"><stop stop-color="#FFB743"/><stop offset="1" stop-color="#FF883B"/></linearGradient><linearGradient id="f" x1="69.738" x2="62.589" y1="25.327" y2="24.704" gradientUnits="userSpaceOnUse"><stop stop-color="#FF8A3B"/><stop offset="1" stop-color="#FF7516"/></linearGradient><linearGradient id="g" x1="18.336" x2="41.092" y1="42.429" y2="35.282" gradientUnits="userSpaceOnUse"><stop stop-color="#D7D7D7"/><stop offset=".02" stop-color="#D8D8D8"/><stop offset=".32" stop-color="#E8E8E8"/><stop offset=".56" stop-color="#EDEDED"/></linearGradient><linearGradient id="h" x1="27.873" x2="27.633" y1="40.422" y2="53.419" gradientUnits="userSpaceOnUse"><stop stop-color="#B5B5B5"/><stop offset="1" stop-color="#D8D8D8"/></linearGradient><linearGradient id="i" x1="20.556" x2="24.379" y1="36.092" y2="54.674" gradientUnits="userSpaceOnUse"><stop stop-color="#FF8A1A"/><stop offset=".98" stop-color="#FFB43B"/></linearGradient></defs></svg>
                    <span>Sparade varukorgar</span>
                  </a>
                  <a href="/mitt-coop/mina-inkopslistor/">
                    <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.77789" width="72" height="72" rx="36" fill="#E0EFDD"/>
                    <mask id="mask0_2078_20993" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="5" y="3" width="64" height="72">
                    <path d="M68.8824 46.4779C68.8824 62.2084 54.9316 74.9605 37.7224 74.9605C20.5132 74.9605 5.22241 63.231 5.22241 47.5005C5.22241 31.77 30.2188 3.52051 47.428 3.52051C64.6372 3.52051 68.8824 30.7474 68.8824 46.4779Z" fill="#E0EFDD"/>
                    </mask>
                    <g mask="url(#mask0_2078_20993)">
                    <path d="M31.4268 41.7339L30.3223 42.8385C30.3223 42.8385 37.7053 45.4582 43.8694 47.7262C48.2014 49.3201 53.1663 47.7836 55.7267 43.943C52.7225 43.943 51.8608 41.1816 49.0995 41.1816C46.3381 41.1816 37.1336 41.3657 31.4268 41.7339Z" fill="#827E7E"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3114 41.1897C52.8326 41.4502 54.2785 46.6581 55.9996 43.5752C57.3043 41.2381 58.0427 38.2589 57.3827 34.5548C56.3742 26.1136 55.9071 19.9619 57.9354 18.5389L31.5194 16.2997C31.5194 16.2997 28.7335 26.2504 31.7815 33.6914C35.5354 42.871 24.7988 45.1342 24.7988 45.1342C24.7988 45.1342 43.5758 41.182 49.0987 41.1821C49.1723 41.1821 49.2432 41.1846 49.3114 41.1897Z" fill="url(#paint0_linear_2078_20993)"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.3713 37.0255C35.3845 37.2419 35.663 37.305 35.8773 37.3213L49.0372 37.8279C49.7079 37.8605 50.3563 37.9994 51.0039 38.0081C51.1781 38.0195 51.5262 37.9771 51.5255 37.8469C51.1184 37.3354 50.4219 37.355 49.7692 37.3213L36.8005 36.6296C36.301 36.6194 35.4332 36.6165 35.3713 37.0255Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M34.3606 32.4318C35.6626 32.458 36.9812 32.8089 38.2823 32.8171C38.9848 32.8475 39.6253 32.8666 40.333 32.857C40.9051 32.8491 41.4767 32.8997 42.0388 33.0079C42.3888 33.0703 42.8021 33.0969 42.8293 33.4898C42.8565 33.8827 38.6428 33.2261 36.4788 33.2316C35.8141 33.2154 35.1557 33.0953 34.5277 32.8757C34.4814 32.8626 34.4368 32.8442 34.3948 32.8208C34.2641 32.7368 34.1734 32.4447 34.3606 32.4318Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.6627 28.5429C35.8732 28.4975 38.076 28.7567 40.2868 28.8705C40.5873 28.8929 40.8893 28.8699 41.1827 28.8023C41.797 28.6374 40.7863 28.3043 40.5539 28.2911C39.2691 28.2289 38.006 28.1664 36.7646 28.1037L34.8415 28.0173C34.4969 28.0046 34.1544 27.9156 33.8348 27.8975C33.6627 27.8767 33.4883 27.896 33.3251 27.954C32.875 28.191 33.4233 28.5339 33.6627 28.5429Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.4359 23.8235L33.5516 23.8364C34.099 23.9174 34.6502 23.9695 35.203 23.9925L37.0492 24.1389L40.7017 24.4249C43.9028 24.6806 47.1052 24.9507 50.309 25.2352C50.6595 25.2633 51.2704 25.3386 51.2953 25.5623C51.2473 25.9964 42.214 24.9441 37.6558 24.926C36.7178 24.947 35.7794 24.8936 34.8496 24.7666C34.3493 24.7334 33.8571 24.6226 33.3905 24.4382C33.2412 24.3426 33.0161 23.995 33.346 23.8427L33.4359 23.8235Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5274 20.335C33.737 20.3922 33.9823 20.3951 34.1629 20.4307C34.5183 20.505 34.8776 20.5595 35.239 20.5938C35.6381 20.6168 36.0382 20.6144 36.4369 20.5868C36.7941 20.5785 37.1479 20.5992 37.5015 20.6018C37.6566 20.6116 37.8123 20.6088 37.9669 20.5932C38.5945 20.53 37.6945 20.1786 37.4779 20.1611L33.5178 19.7968C33.3012 19.7793 32.9986 19.8777 33.2054 20.1445C33.2904 20.2399 33.4029 20.3066 33.5274 20.335Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9256 41.5854C27.9256 41.5854 18.3563 40.6903 19.6253 51.2766C20.6338 59.7177 18.9797 74.5696 16.9514 75.9926L45.1047 78.8303C45.1047 78.8303 51.044 67.902 46.4904 52.7864C42.7365 43.6068 49.0994 41.1823 49.0994 41.1823L27.9256 41.5854Z" fill="url(#paint1_linear_2078_20993)"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.918 63.4423C27.7709 63.9053 31.4699 64.2145 35.3228 64.6775C35.9105 64.7746 36.5034 64.8373 37.0984 64.8654C37.4497 64.8772 38.0353 64.8751 38.1381 65.1983C38.0531 65.406 37.6414 65.3544 37.3772 65.3483C34.4334 65.3309 31.6987 64.7076 28.758 64.5018C27.9519 64.4446 27.1452 64.4345 26.348 64.3442C25.9254 64.3005 25.5059 64.2311 25.0917 64.1364C24.6901 64.0728 24.3013 63.9442 23.9407 63.7558C23.765 63.6613 23.6468 63.4403 23.918 63.4423Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.8022 59.6896C23.8153 59.906 24.0939 59.9691 24.3082 59.9853L39.4736 60.7009C40.1443 60.7336 40.7927 60.8725 41.4403 60.8812C41.6145 60.8926 41.9626 60.8502 41.9619 60.72C41.5548 60.2085 40.8583 60.228 40.2055 60.1943L25.2313 59.2937C24.7318 59.2835 23.864 59.2806 23.8022 59.6896Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.853 68.5222C22.8571 68.7559 23.1516 68.8405 23.3796 68.8708L39.5375 70.548C40.2521 70.6233 40.9379 70.8116 41.6289 70.8597C41.8144 70.8823 42.1879 70.8576 42.1932 70.7173C41.7822 70.1424 41.0377 70.1218 40.3423 70.0465L24.3971 68.1815C23.8643 68.1407 22.9379 68.0857 22.853 68.5222Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0417 55.1186C25.344 55.1319 26.6659 55.4698 27.9671 55.4651C28.6698 55.4886 29.3105 55.5013 30.018 55.4847C30.5901 55.4712 31.1621 55.5161 31.7252 55.6188C32.0759 55.6776 32.4894 55.7002 32.5205 56.0928C32.5516 56.4854 28.3315 55.8705 26.1677 55.8974C25.5029 55.8877 24.8434 55.7742 24.2132 55.5608C24.1668 55.5482 24.122 55.5302 24.0798 55.5072C23.9482 55.4245 23.8546 55.1333 24.0417 55.1186Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.2994 52.0685C26.5102 52.0425 28.7107 52.3211 30.9203 52.4543C31.2206 52.4794 31.5228 52.459 31.8168 52.394C32.4325 52.2345 31.4248 51.8925 31.1925 51.8773C29.9083 51.8038 28.6458 51.7302 27.405 51.6565L25.4827 51.5533C25.1383 51.5375 24.7965 51.4456 24.4771 51.4247C24.3053 51.4023 24.1306 51.4201 23.9669 51.4766C23.5148 51.7097 24.0601 52.0574 24.2994 52.0685Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.805 47.9489L23.9211 47.9565C24.4717 48.0119 25.0247 48.0383 25.578 48.0356L27.429 48.0961L31.0909 48.2121C34.3003 48.3187 37.5119 48.4396 40.7255 48.575C41.0768 48.5867 41.6906 48.6336 41.7258 48.8559C41.6981 49.2918 32.6256 48.6604 28.0716 48.8542C27.1355 48.9187 26.1957 48.909 25.2609 48.8253C24.7596 48.8154 24.2628 48.7276 23.7882 48.5651C23.6346 48.4765 23.3936 48.1397 23.716 47.9722L23.805 47.9489Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.9867 45.1306C26.1991 45.1759 26.4443 45.165 26.6266 45.1904C26.9856 45.2446 27.3474 45.2787 27.7101 45.2927C28.1099 45.2932 28.5093 45.2683 28.9058 45.2182C29.262 45.1899 29.6163 45.1906 29.9695 45.1733C30.125 45.1744 30.2802 45.1628 30.4338 45.1386C31.0568 45.0402 30.1384 44.7399 29.9212 44.7347L25.9468 44.5938C25.7296 44.5885 25.433 44.7038 25.6545 44.9585C25.7447 45.0491 25.8608 45.1092 25.9867 45.1306Z" fill="#00AA46"/>
                    </g>
                    <path d="M0.624084 32.3847L1.03899 33.3558L21.3038 43.9732L21.3682 44.0092L21.3828 44.0072L21.8121 44.0977L23.3271 44.3981L25.0504 44.7521L23.8409 43.4125L22.3829 41.7791L1.76365 31.1279L1.22524 31.4394L1.01786 31.5569L0.624084 32.3847Z" fill="#FFB43B"/>
                    <path d="M0.624084 32.3847L1.03899 33.3558L21.3682 44.0092L21.8121 44.0977L21.5093 43.1333L0.624084 32.3847Z" fill="url(#paint2_linear_2078_20993)"/>
                    <path d="M21.9775 42.1918C22.1629 42.2411 22.6137 42.5446 22.6599 42.5011C22.7061 42.4576 22.5171 41.9991 22.3829 41.7791L1.76365 31.1279L1.01786 31.5569L21.9775 42.1918Z" fill="url(#paint3_linear_2078_20993)"/>
                    <path d="M21.3348 43.9836L25.0023 44.7285L22.3349 41.7556C22.0462 41.9606 21.7887 42.2062 21.5703 42.4849C21.3296 42.9451 21.2468 43.4717 21.3348 43.9836Z" fill="#F9D49D"/>
                    <path d="M23.3263 44.3977L25.0496 44.7517L23.8401 43.4121C23.6051 43.7033 23.4304 44.0383 23.3263 44.3977Z" fill="#235339"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4798 38.8545L21.2924 32.0155C21.3142 30.9799 21.1466 29.9489 20.7979 28.9734C20.4609 27.9762 19.6182 27.234 18.5863 27.0256C16.8409 26.7942 15.4736 28.8059 15.6569 30.5545C15.8402 32.3031 17.0463 33.7643 18.1913 35.097L21.4284 38.8449" fill="#06A84B"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.7751 47.7603C21.3466 47.7395 20.9172 47.7551 20.4914 47.8069C20.0525 47.8341 19.6228 47.9441 19.2249 48.131C18.8239 48.3244 18.514 48.6665 18.3613 49.0847C18.2168 49.5125 18.3379 49.9853 18.6702 50.2913C18.8824 50.4495 19.1489 50.5169 19.4108 50.4784C19.6727 50.4399 19.9084 50.2987 20.066 50.0861C20.276 49.7893 20.2799 49.3956 20.3862 49.0469C20.5939 48.4029 21.1216 47.9133 21.7794 47.7542" fill="#06A84B"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.7543 45.5C20.2637 44.7458 18.5832 44.4496 16.9246 44.6488C16.341 44.7031 15.7901 44.9426 15.3524 45.3325C14.9203 45.75 14.8524 46.4184 15.1918 46.9142C15.5458 47.3304 16.193 47.3535 16.7235 47.1994C17.0097 47.1157 17.2821 46.9905 17.5321 46.8279C17.7974 46.6598 18.0378 46.4531 18.2985 46.2717C19.0212 45.7676 19.8704 45.4754 20.7503 45.4279C21.0865 45.4191 21.4228 45.4433 21.7543 45.5Z" fill="#00AA46"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M26.0732 42.6494C24.8312 40.6809 24.208 38.3777 24.2819 36.0302C24.2858 35.2066 24.5535 34.4006 25.0459 33.7301C25.5777 33.0631 26.5065 32.8672 27.2437 33.2664C27.8711 33.698 27.9835 34.5988 27.8331 35.3633C27.7512 35.7759 27.6095 36.1754 27.4123 36.5493C27.2095 36.9454 26.9495 37.3126 26.7274 37.7043C26.1101 38.7903 25.8055 40.021 25.8479 41.2576C25.8772 41.7287 25.9527 42.1948 26.0732 42.6494Z" fill="#00AA46"/>
                    <defs>
                    <linearGradient id="paint0_linear_2078_20993" x1="47.3387" y1="17.3003" x2="43.7165" y2="73.9163" gradientUnits="userSpaceOnUse">
                    <stop offset="0.14762" stop-color="white"/>
                    <stop offset="0.371201" stop-color="#DDDDDD"/>
                    <stop offset="0.49576" stop-color="#B1B1B1"/>
                    <stop offset="0.88" stop-color="#969696"/>
                    <stop offset="1" stop-color="#8C8C8C"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_2078_20993" x1="26.4099" y1="74.6287" x2="31.68" y2="-11.5045" gradientUnits="userSpaceOnUse">
                    <stop offset="0.25" stop-color="white"/>
                    <stop offset="0.43" stop-color="#DDDDDD"/>
                    <stop offset="0.69" stop-color="#B1B1B1"/>
                    <stop offset="0.88" stop-color="#969696"/>
                    <stop offset="1" stop-color="#8C8C8C"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_2078_20993" x1="-0.290838" y1="38.1399" x2="48.4494" y2="35.7535" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFB743"/>
                    <stop offset="1" stop-color="#D98231"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_2078_20993" x1="-3.8314" y1="37.7961" x2="63.7387" y2="39.6339" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFB743"/>
                    <stop offset="1" stop-color="#D98231"/>
                    </linearGradient>
                    </defs>
                    </svg>
                    <span>Mina inköpslistor</span>
                  </a>
                `;
                element.prepend(icons);

                const listItems = element.querySelectorAll<HTMLLIElement>(
                  'ul.ProfileMenu-list li'
                );

                listItems.forEach((item) => {
                  if (
                    item.innerText.includes('Mina beställningar') ||
                    item.innerText.includes('Sparade varukorgar') ||
                    item.innerText.includes('Mina inköpslistor')
                  ) {
                    item.remove();
                  }
                });

                const close = document.createElement('button');
                close.type = 'button';
                close.classList.add('ProfileMenu-close');
                close.innerHTML = `
                  <svg role="img">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg#close">
                      <title>Dölj</title>
                    </use>
                  </svg>
                `;
                close.addEventListener('click', () => {
                  document
                    .querySelector<HTMLElement>('.js-profileMenuTrigger')
                    ?.click();
                });
                element.prepend(close);
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
        cover.waitFor(
          '.Checkout h1.Heading',
          (element) => {
            let experimentCartDataProductSum = 0;

            function updateText() {
              let amountLeft = 2000 - Math.floor(experimentCartDataProductSum);

              if (amountLeft < 0) {
                amountLeft = 0;
              }

              if (amountLeft <= 1000 && amountLeft > 0) {
                cover.variantReady('T111', () => {
                  element.textContent = `${amountLeft} kr kvar till fri frakt!`;
                  document.querySelector(
                    '.Checkout h1.Heading + p'
                  ).textContent =
                    'Behöver du något mer? Här är några förslag på populära varor.';
                });
              } else if (
                amountLeft === 0 &&
                cover.variantHistory.includes('T111')
              ) {
                element.textContent = 'Du har nu fri frakt!';
                document.querySelector('.Checkout h1.Heading + p').textContent =
                  'Behöver du något mer? Här är några förslag på populära varor.';
              }
            }

            function handleModifyCart() {
              if (window.location.hash === '#/') {
                fetch('https://www.coop.se/api/hybris/carts/current').then(
                  (response) => {
                    response.json().then((data) => {
                      experimentCartDataProductSum = data.cartData.productSum;
                      updateText();
                    });
                  }
                );
              } else {
                window.removeEventListener('ga:modifyCart', handleModifyCart);
              }
            }

            handleModifyCart();
            window.addEventListener('ga:modifyCart', handleModifyCart);
          },
          {
            content: 'Psst! Du har väl inte glömt någonting?',
          }
        );

        cover.waitFor('.CheckoutCartSummary', (element) => {
          cover.variantReady('T113', () => {
            (function run() {
              // reset
              window.removeEventListener('ga:modifyCart', run);

              setTimeout(() => {
                const items = element.querySelectorAll('li');

                let content = false;
                let discountHeader = undefined;
                let discountLines = 0;

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

                  if (text.startsWith('Total rabatt')) {
                    discountHeader = item;
                  }

                  // Discounts
                  if (item.classList.contains('u-textXSmall')) {
                    if (text === 'Fri frakt vid köp över 2000kr') {
                      block.querySelector<HTMLElement>(
                        '.InformationBox'
                      ).style.backgroundColor = '#e0efdd';
                      block.querySelector('.InformationBox-icon').innerHTML =
                        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220329.1219#check2"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=220329.1219#check"></use></use>';

                      item.classList.remove('u-flex');
                      item.style.display = 'none';
                    } else {
                      discountLines += 1;
                    }
                  }
                }

                if (content) {
                  element.querySelector('.T113')?.remove();
                  element.firstElementChild.append(block);
                }

                if (discountHeader) {
                  if (discountLines === 0) {
                    if (discountHeader.classList.contains('u-flex')) {
                      discountHeader.classList.remove('u-flex');
                    }
                    discountHeader.style.display = 'none';
                  } else {
                    discountHeader.classList.add('u-flex');
                    discountHeader.style.display = 'unset';
                  }
                }

                window.addEventListener('ga:modifyCart', run);
              }, 1000);
            })();
          });
        });

        cover.waitFor('.Loader', (element) => {
          if (window.location.hash === '#/leverans') {
            const item: HTMLElement = element.closest('.DeliveryItem');
            if (item) {
              item.style.gap = 'unset';

              const itemInfo = item.querySelector('.DeliveryItem-info');
              itemInfo.classList.remove('u-hidden');

              const icon = item.querySelector('.DeliveryItem-icon');
              icon.classList.remove('u-hidden');
              icon.parentElement.querySelector('svg')?.remove(); // TODO: Only remove if it exists
            }
          }
        });

        const DATA = {
          ADRESS: {
            label: 'Välj adress',
            icon: `<svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M20 43C31.0457 43 40 34.0457 40 23C40 11.9543 31.0457 3 20 3C8.9543 3 0 11.9543 0 23C0 34.0457 8.9543 43 20 43Z" fill="#F5F5F5"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8148 24.7255H21.1852C21.5125 24.7255 21.7778 25.0064 21.7778 25.3529V29.7451H18.2222V25.3529C18.2222 25.0064 18.4875 24.7255 18.8148 24.7255Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.4446 20.2706V17.1961C24.4446 17.0228 24.312 16.8824 24.1483 16.8824H22.9631C22.7995 16.8824 22.6668 17.0228 22.6668 17.1961V18.5389L20.2005 16.1363C20.087 16.0255 19.9122 16.0255 19.7987 16.1363L13.2802 22.6123C13.1902 22.6999 13.1603 22.8371 13.2049 22.9576C13.2495 23.0781 13.3594 23.1573 13.4817 23.1569H14.9631V29.1177C14.9631 29.4642 15.2284 29.7451 15.5557 29.7451H24.4446C24.7719 29.7451 25.0372 29.4642 25.0372 29.1177V23.1569H26.5187C26.6408 23.157 26.7505 23.0778 26.795 22.9573C26.8394 22.8368 26.8095 22.6998 26.7196 22.6123L24.4446 20.2706Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35 16C39.4183 16 43 12.4183 43 8C43 3.58172 39.4183 0 35 0C30.5817 0 27 3.58172 27 8C27 12.4183 30.5817 16 35 16Z" fill="#FF6565"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35.2135 4C35.7161 4 36.1236 4.40747 36.1236 4.91011V8.95506C36.1236 9.4577 35.7161 9.86517 35.2135 9.86517C34.7108 9.86517 34.3034 9.4577 34.3034 8.95506V4.91011C34.3034 4.40747 34.7108 4 35.2135 4Z" fill="white"/>
            <path d="M36.427 11.7865C36.427 12.4567 35.8837 13 35.2135 13C34.5433 13 34 12.4567 34 11.7865C34 11.1163 34.5433 10.573 35.2135 10.573C35.8837 10.573 36.427 11.1163 36.427 11.7865Z" fill="white"/>
            </svg>`,
          },
          LEVERANSTID: {
            label: 'Välj leveransstid',
            icon: `<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="1" width="40" height="40" rx="20" fill="#F5F5F5"/>
            <path d="M20 15.9996V20.9996L16.5 24.4996M30 20.9996C30 26.5225 25.5228 30.9996 20 30.9996C14.4772 30.9996 10 26.5225 10 20.9996C10 15.4768 14.4772 10.9996 20 10.9996C25.5228 10.9996 30 15.4768 30 20.9996Z" stroke="#0A893D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="23" width="16" height="16" rx="8" fill="#FF6565"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M31 3.5C31.5026 3.5 31.9101 3.90747 31.9101 4.41011V8.45506C31.9101 8.9577 31.5026 9.36517 31 9.36517C30.4973 9.36517 30.0899 8.9577 30.0899 8.45506V4.41011C30.0899 3.90747 30.4973 3.5 31 3.5Z" fill="white"/>
            <path d="M32.2135 11.2865C32.2135 11.9567 31.6702 12.5 31 12.5C30.3298 12.5 29.7865 11.9567 29.7865 11.2865C29.7865 10.6163 30.3298 10.073 31 10.073C31.6702 10.073 32.2135 10.6163 32.2135 11.2865Z" fill="white"/>
            </svg>`,
          },
          'HÄMTAS PÅ': {
            label: 'Välj butik',
            icon: `<svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M20 43C31.0457 43 40 34.0457 40 23C40 11.9543 31.0457 3 20 3C8.9543 3 0 11.9543 0 23C0 34.0457 8.9543 43 20 43Z" fill="#F5F5F5"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8148 24.7255H21.1852C21.5125 24.7255 21.7778 25.0064 21.7778 25.3529V29.7451H18.2222V25.3529C18.2222 25.0064 18.4875 24.7255 18.8148 24.7255Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.4446 20.2706V17.1961C24.4446 17.0228 24.312 16.8824 24.1483 16.8824H22.9631C22.7995 16.8824 22.6668 17.0228 22.6668 17.1961V18.5389L20.2005 16.1363C20.087 16.0255 19.9122 16.0255 19.7987 16.1363L13.2802 22.6123C13.1902 22.6999 13.1603 22.8371 13.2049 22.9576C13.2495 23.0781 13.3594 23.1573 13.4817 23.1569H14.9631V29.1177C14.9631 29.4642 15.2284 29.7451 15.5557 29.7451H24.4446C24.7719 29.7451 25.0372 29.4642 25.0372 29.1177V23.1569H26.5187C26.6408 23.157 26.7505 23.0778 26.795 22.9573C26.8394 22.8368 26.8095 22.6998 26.7196 22.6123L24.4446 20.2706Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35 16C39.4183 16 43 12.4183 43 8C43 3.58172 39.4183 0 35 0C30.5817 0 27 3.58172 27 8C27 12.4183 30.5817 16 35 16Z" fill="#FF6565"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35.2135 4C35.7161 4 36.1236 4.40747 36.1236 4.91011V8.95506C36.1236 9.4577 35.7161 9.86517 35.2135 9.86517C34.7108 9.86517 34.3034 9.4577 34.3034 8.95506V4.91011C34.3034 4.40747 34.7108 4 35.2135 4Z" fill="white"/>
            <path d="M36.427 11.7865C36.427 12.4567 35.8837 13 35.2135 13C34.5433 13 34 12.4567 34 11.7865C34 11.1163 34.5433 10.573 35.2135 10.573C35.8837 10.573 36.427 11.1163 36.427 11.7865Z" fill="white"/>
            </svg>`,
          },
          KONTAKTUPPGIFTER: {
            label: 'Fyll i mina uppgifter',
            icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#F5F5F5"/>
            <path d="M11 27.4996C11 25.0144 13.0147 22.9996 15.5 22.9996H24.5C26.9853 22.9996 29 25.0144 29 27.4996C29 28.3281 28.3284 28.9996 27.5 28.9996H12.5C11.6716 28.9996 11 28.3281 11 27.4996Z" stroke="#0A893D" stroke-width="2"/>
            <path d="M24 14.9996C24 17.2088 22.2091 18.9996 20 18.9996C17.7909 18.9996 16 17.2088 16 14.9996C16 12.7905 17.7909 10.9996 20 10.9996C22.2091 10.9996 24 12.7905 24 14.9996Z" stroke="#0A893D" stroke-width="2"/>
            <rect x="24" width="16" height="16" rx="8" fill="#FF6565"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M32 3.5C32.5026 3.5 32.9101 3.90747 32.9101 4.41011V8.45506C32.9101 8.9577 32.5026 9.36517 32 9.36517C31.4973 9.36517 31.0899 8.9577 31.0899 8.45506V4.41011C31.0899 3.90747 31.4973 3.5 32 3.5Z" fill="white"/>
            <path d="M33.2135 11.2865C33.2135 11.9567 32.6702 12.5 32 12.5C31.3298 12.5 30.7865 11.9567 30.7865 11.2865C30.7865 10.6163 31.3298 10.073 32 10.073C32.6702 10.073 33.2135 10.6163 33.2135 11.2865Z" fill="white"/>
            </svg>`,
          },
          AVHÄMTNINGSTID: {
            label: 'Välj avhämtningsstid',
            icon: `<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="1" width="40" height="40" rx="20" fill="#F5F5F5"/>
            <path d="M20 15.9996V20.9996L16.5 24.4996M30 20.9996C30 26.5225 25.5228 30.9996 20 30.9996C14.4772 30.9996 10 26.5225 10 20.9996C10 15.4768 14.4772 10.9996 20 10.9996C25.5228 10.9996 30 15.4768 30 20.9996Z" stroke="#0A893D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="23" width="16" height="16" rx="8" fill="#FF6565"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M31 3.5C31.5026 3.5 31.9101 3.90747 31.9101 4.41011V8.45506C31.9101 8.9577 31.5026 9.36517 31 9.36517C30.4973 9.36517 30.0899 8.9577 30.0899 8.45506V4.41011C30.0899 3.90747 30.4973 3.5 31 3.5Z" fill="white"/>
            <path d="M32.2135 11.2865C32.2135 11.9567 31.6702 12.5 31 12.5C30.3298 12.5 29.7865 11.9567 29.7865 11.2865C29.7865 10.6163 30.3298 10.073 31 10.073C31.6702 10.073 32.2135 10.6163 32.2135 11.2865Z" fill="white"/>
            </svg>`,
          },
        };

        cover.waitFor(
          'button',
          (button) => {
            // https://www.coop.se/handla/betala/#/leverans/dialog/hemleverans
            if (window.location.hash.startsWith('#/leverans')) {
              const item: HTMLElement = button.closest('.DeliveryItem');
              const itemInfo = item.querySelector('.DeliveryItem-info');
              const header = itemInfo.querySelector('h3');
              const text = itemInfo.querySelector('p');
              const icon = item.querySelector('.DeliveryItem-icon');

              if (text.textContent === 'Saknas') {
                cover.variantReady('T114', () => {
                  item.style.justifyContent = 'unset';
                  item.style.gap = '15px';

                  itemInfo.classList.add('u-hidden');

                  button.classList.add('Button--grayGreenToDarkGreen');

                  const data = DATA[header.textContent];
                  button.innerText = data['label'];

                  icon.classList.add('u-hidden');

                  const newIconExist = icon.parentElement.querySelector('svg');
                  if (!newIconExist) {
                    icon.insertAdjacentHTML('afterend', data['icon']);
                  }

                  button.addEventListener(
                    'click',
                    () => {
                      if (header.textContent === 'HÄMTAS PÅ') {
                        const tooMuchHiddenFix = document.querySelector(
                          '[data-test="pickupdelivery-contact"] .DeliveryItem-info.u-hidden'
                        );
                        if (tooMuchHiddenFix) {
                          tooMuchHiddenFix.classList.remove('u-hidden');

                          const tooMuchHiddenFixGap: HTMLElement =
                            document.querySelector(
                              '[data-test="pickupdelivery-contact"] .DeliveryItem'
                            );

                          if (tooMuchHiddenFixGap) {
                            tooMuchHiddenFixGap.style.gap = 'unset';
                          }

                          const nextIcon = document.querySelector(
                            '[data-test="pickupdelivery-contact"] .DeliveryItem-icon'
                          );

                          nextIcon.classList.remove('u-hidden');
                          nextIcon.parentElement.querySelector('svg').remove();
                        }
                      }

                      // Need to reset for React to act
                      button.innerText = 'Lägg till';

                      item.style.justifyContent = 'space-between';
                      item.style.gap = 'unset';

                      button.classList.remove('Button--grayGreenToDarkGreen');

                      icon.classList.remove('u-hidden');
                      icon.parentElement.querySelector('svg').remove();

                      itemInfo.classList.remove('u-hidden');
                    },
                    { once: true }
                  );
                });
              }
            }
          },
          {
            content: 'Lägg till',
          }
        );
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
