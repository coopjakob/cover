var observer = new MutationObserver(function () {
  console.log('Söker...');
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'search-dropdown',
    transport: 'beacon'
  });
});
document.getElementsByClassName('js-ecommerceSearchResults').forEach(function (e) {
  console.log('Bevakar sökning');
  observer.observe(e, {
    attributes: false,
    childList: true,
    subtree: false
  });
});
document.getElementsByClassName('js-ecommerceSearchInput').forEach(function (e) {
  e.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      console.log('Skickar...');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Experiment',
        eventAction: 'search-submit',
        transport: 'beacon'
      });
    }
  });
});