var searchInput = document.getElementsByClassName('js-ecommerceSearchInput');
var searchResults = document.getElementsByClassName('js-ecommerceSearchResults');

for (var i = 0; i < searchInput.length; i++) {
  searchInput[i].addEventListener('keydown', function () {
    dataLayer.push({
      event: 'optimize.activate'
    });
  }, {
    once: true
  });
  searchInput[i].addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
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
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'search-dropdown',
    transport: 'beacon'
  });

  if (document.getElementsByClassName('ProductSearch-footer')[0].textContent.trim() == 'Inga resultat funna') {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: 'no-results',
      eventLabel: 'dropdown',
      transport: 'beacon',
      nonInteraction: true
    });
  }
});

for (var i = 0; i < searchResults.length; i++) {
  observer.observe(searchResults[i], {
    attributes: false,
    childList: true,
    subtree: false
  });
}