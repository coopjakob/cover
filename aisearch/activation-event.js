document.getElementsByClassName('js-ecommerceSearchInput').forEach(function (e) {
  e.addEventListener('keydown', function () {
    dataLayer.push({
      event: 'optimize.activate'
    });
  }, {
    once: true
  });
});