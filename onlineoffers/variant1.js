var storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  var onlineoffers = document.createElement('div');
  onlineoffers.classList.add('u-textCenter', 'u-paddingAmd', 'u-bgGreenLight2');
  onlineoffers.innerHTML = "\n    Sidan visar erbjudanden i butik. Det finns andra <a href=\"/handla/aktuella-erbjudanden/\">erbjudanden</a> om du best\xE4ller fr\xE5n coop.se";
  var onlineoffersLink = onlineoffers.querySelector('a');
  onlineoffersLink.classList.add('Link', 'Link--green');
  onlineoffersLink.addEventListener('click', function (event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: 'online-offers-click',
      transport: 'beacon'
    });
  });
  storeModulesSection.appendChild(onlineoffers);
}