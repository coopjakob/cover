let itemsInCart = parseInt(
  document.querySelector('.CartButton .Badge').textContent
);
let isStoreSet = !!document.querySelector('.TimeslotPreview-info').textContent;

if (!itemsInCart) {
  console.debug('0 in cart');

  if (isStoreSet) {
    window.addEventListener(
      'ga:modifyCart',
      () => {
        dataLayer.push({
          event: 'optimize.activate.storefocus',
        });
      },
      {
        once: true,
      }
    );
  } else {
    let portalObserver = new MutationObserver((mutations) => {
      portalObserver.disconnect();
      dataLayer.push({
        event: 'optimize.activate.storefocus',
      });
    });

    portalObserver.observe(document.getElementById('portal'), {
      childList: true,
      subtree: false,
    });
  }
}
