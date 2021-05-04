var _document$querySelect;

var experimentCartDataProductSum;
var experimentCartDataDeliveryMode;

if (((_document$querySelect = document.querySelector('.Checkout h1.Heading')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.textContent) == 'Psst! Du har väl inte glömt någonting?') {
  fetch('/api/hybris/carts/current').then(function (response) {
    response.json().then(function (data) {
      experimentCartDataProductSum = data.cartData.productSum;
      experimentCartDataDeliveryMode = data.cartData.deliveryMode;

      if (experimentCartDataProductSum < 2000 && experimentCartDataProductSum >= 1500) {
        dataLayer.push({
          event: 'optimize.activate.checkoutdelivery'
        });
      }
    });
  });
}