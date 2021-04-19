var heading = document.querySelector(
  '.u-bgWhite.u-borderRadius8.u-paddingA.u-marginB.u-flex.u-flexDirectionRow.u-flexAlignCenter .Heading'
);

var sum;

if (heading.textContent == "Psst! Du har väl inte glömt någonting?") {
  fetch('https://www.coop.se/api/hybris/carts/current')
    .then(
      function(response) {
        response.json().then(function(data) {
          sum = data.cartData.productSum;
          if (sum < 2000) {
            dataLayer.push({
              event: 'optimize.activate.checkoutdelivery'
            });
          }
        })
      }
    )
}