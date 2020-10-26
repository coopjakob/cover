const searchInput = document.getElementsByClassName('js-ecommerceSearchInput');
const searchResults = document.getElementsByClassName(
  'js-ecommerceSearchResults'
);

for (var i = 0; i < searchInput.length; i++) {
  searchInput[i].addEventListener(
    'keydown',
    () => {
      console.debug('<experiment> activate');
      dataLayer.push({ event: 'optimize.activate' });
    },
    { once: true }
  );

  searchInput[i].addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      console.debug('<experiment> send submt event');
      ga('send', {
        hitType: 'event',
        eventCategory: 'Experiment',
        eventAction: 'search-submit',
        transport: 'beacon',
      });
    }
  });
}

const observer = new MutationObserver(() => {
  console.debug('<experiment> send search event');
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'search-dropdown',
    transport: 'beacon',
  });
});

for (var i = 0; i < searchResults.length; i++) {
  console.debug('<experiment> observing search results');
  observer.observe(searchResults[i], {
    attributes: false,
    childList: true,
    subtree: false,
  });
}
