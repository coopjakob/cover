// event: 'interaction';
// eventAction: 'Slider - Slider öppnas';

(function run() {
  console.debug('<experiment> wait for button');

  if (document.querySelector('.Cart-footer button.is-disabled')) {
    console.debug('<experiment> activate drawercheckout');
    dataLayer.push({
      event: 'optimize.activate.drawercheckout',
    });
  } else if (
    document.querySelector('#portal .Modal') &&
    !document.querySelector('[data-test=goToCheckout]')
  ) {
    setTimeout(run, 1000);
  }
})();
