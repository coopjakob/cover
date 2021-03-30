event: 'interaction';

eventAction: 'Slider - Slider öppnas'; // eventCategory: 'Ecommerce';
// eventLabel: 'Cart ikon';


if (document.querySelector('.Cart-footer button.is-disabled')) {
  console.debug('<experiment> activate drawercheckout');
  dataLayer.push({
    event: 'optimize.activate.drawercheckout'
  });
}