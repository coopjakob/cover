function updateText() {
  let amountLeft = 2000 - Math.floor(sum);

  if (amountLeft < 0) {
    amountLeft = 0;
  }

  if (amountLeft <= 500 && amountLeft >= 0) {
    heading.textContent = `Psst! Du har ${amountLeft} kr kvar till fri frakt.`;
    document.querySelector(
      '.u-bgWhite.u-borderRadius8.u-paddingA.u-marginB.u-flex.u-flexDirectionRow.u-flexAlignCenter p'
    ).textContent =
      'Vill du lägga något mer i varukorgen? Nedan finner du några förslag på populära varor.';
  }
}

updateText();

window.addEventListener('ga:modifyCart', () => {
  fetch('https://www.coop.se/api/hybris/carts/current').then(function (
    response
  ) {
    response.json().then(function (data) {
      sum = data.cartData.productSum;
      updateText();
    });
  });
});
