var experimentCartDataProductSum;

if (
  document.querySelector('.Checkout h1.Heading')?.textContent ==
  'Psst! Du har väl inte glömt någonting?'
) {
  fetch('https://www.coop.se/api/hybris/carts/current').then(function (
    response
  ) {
    response.json().then(function (data) {
      experimentCartDataProductSum = data.cartData.productSum;
      if (
        experimentCartDataProductSum < 2000 &&
        experimentCartDataProductSum >= 1500
      ) {
        dataLayer.push({
          event: 'optimize.activate.checkoutdelivery',
        });
      }
    });
  });
}
