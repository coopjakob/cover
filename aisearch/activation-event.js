document.querySelectorAll('.js-ecommerceSearchInput').forEach(function (e) {
  e.addEventListener('focus', function () {
    dataLayer.push({
      event: 'optimize.activate'
    });
  }, {
    once: true
  });
});