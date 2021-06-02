var itemsInCart = parseInt(document.querySelector('.CartButton .Badge').textContent);
var isStoreSet = !!document.querySelector('.TimeslotPreview-info').textContent;

if (!itemsInCart) {
  if (isStoreSet) {
    window.addEventListener('ga:modifyCart', function () {
      dataLayer.push({
        event: 'optimize.activate.storefocus'
      });
    }, {
      once: true
    });
  } else {
    var portalObserver = new MutationObserver(function (mutations) {
      portalObserver.disconnect();
      dataLayer.push({
        event: 'optimize.activate.storefocus'
      });
    });
    portalObserver.observe(document.getElementById('portal'), {
      childList: true,
      subtree: false
    });
  }
}