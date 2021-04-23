(function run() {
  if (document.querySelector('.Cart-footer button.is-disabled')) {
    dataLayer.push({
      event: 'optimize.activate.drawercheckout'
    });
  } else if (document.querySelector('#portal .Modal') && !document.querySelector('[data-test=goToCheckout]')) {
    setTimeout(run, 200);
  }
})();