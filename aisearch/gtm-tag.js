var searchInput = document.getElementsByClassName('js-ecommerceSearchInput');
var searchResults = document.getElementsByClassName('js-ecommerceSearchResults');

for (var i = 0; i < searchInput.length; i++) {
  searchInput[i].addEventListener('keydown', function () {
    console.debug('<experiment> activate');
    dataLayer.push({
      event: 'optimize.activate'
    });
  }, {
    once: true
  });
  searchInput[i].addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      console.debug('<experiment> send submit event');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Experiment',
        eventAction: 'search-submit',
        transport: 'beacon'
      });
    }
  });
}

var observer = new MutationObserver(function () {
  console.debug('<experiment> send search event');
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'search-dropdown',
    transport: 'beacon'
  });
});

for (var i = 0; i < searchResults.length; i++) {
  console.debug('<experiment> observing search results');
  observer.observe(searchResults[i], {
    attributes: false,
    childList: true,
    subtree: false
  });
}