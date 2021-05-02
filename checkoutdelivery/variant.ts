function updateText() {
  let amountLeft = 2000 - Math.floor(experimentCartDataProductSum);

  if (amountLeft < 0) {
    amountLeft = 0;
  }

  if (amountLeft <= 500 && amountLeft >= 0) {
    document.querySelector(
      '.Checkout h1.Heading'
    ).textContent = `Psst! Du har ${amountLeft} kr kvar till fri frakt.`;
    document.querySelector('.Checkout h1.Heading + p').textContent =
      'Vill du lägga något mer i varukorgen? Nedan finner du några förslag på populära varor.';
  }
}

updateText();

window.addEventListener('ga:modifyCart', () => {
  fetch('/api/hybris/carts/current').then((response) => {
    response.json().then((data) => {
      experimentCartDataProductSum = data.cartData.productSum;
      updateText();
    });
  });
});
