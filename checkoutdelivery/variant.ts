function updateText() {
  let amountLeft = 1000 - Math.floor(sum);

  if (amountLeft < 0) {
    amountLeft = 0;
  }

  if (amountLeft >= 0) {
    heading.textContent = 'Handla lite till och få fri frakt!';
    document.querySelector(
      '.u-bgWhite.u-borderRadius8.u-paddingA.u-marginB.u-flex.u-flexDirectionRow.u-flexAlignCenter p'
    ).textContent = `Du behöver bara handla för ytterligare ${amountLeft} kr. Nedan finner du förslag på varor vi tror du gillar.`;
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
