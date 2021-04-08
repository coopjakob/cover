if (document.querySelector('.u-colorGray.u-textSmall').textContent == '0 resultat') {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'no-results',
    eventLabel: 'search-page',
    nonInteraction: true
  });
}