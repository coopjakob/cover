let experimentCartDataProductSum;
let experimentCartDataDeliveryMode;

if (
  document.querySelector('.Checkout h1.Heading')?.textContent ==
  'Psst! Du har väl inte glömt någonting?'
) {
  fetch('/api/hybris/carts/current').then(function (response) {
    response.json().then(function (data) {
      experimentCartDataProductSum = data.cartData.productSum;
      experimentCartDataDeliveryMode = data.cartData.deliveryMode;
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
