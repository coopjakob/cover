if (document.querySelector('.u-colorGray.u-textSmall').textContent == '0 resultat') {
  console.debug('<experiment> no results event');
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'no-results',
    eventLabel: 'search-page',
    nonInteraction: true
  });
}