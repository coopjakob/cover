function updateText() {
  var amountLeft = 2000 - Math.floor(experimentCartDataProductSum);
  var deliveryModeText;

  if (amountLeft < 0) {
    amountLeft = 0;
  }

  if (amountLeft <= 500 && amountLeft >= 0) {
    if (experimentCartDataDeliveryMode == 'homedelivery') {
      deliveryModeText = 'fri frakt';
    } else {
      deliveryModeText = 'fri plockavgift';
    }

    document.querySelector('.Checkout h1.Heading').textContent = "Psst! Du har ".concat(amountLeft, " kr kvar till ").concat(deliveryModeText, ".");
    document.querySelector('.Checkout h1.Heading + p').textContent = 'Vill du lägga något mer i varukorgen? Nedan finner du några förslag på populära varor.';
  }
}

updateText();
window.addEventListener('ga:modifyCart', function () {
  fetch('/api/hybris/carts/current').then(function (response) {
    response.json().then(function (data) {
      experimentCartDataProductSum = data.cartData.productSum;
      updateText();
    });
  });
});