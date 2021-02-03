var storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  var onlineoffersStyle = document.createElement('style');
  onlineoffersStyle.innerHTML = "\n    .experiment.onlineoffers {\n      box-sizing: border-box;\n      text-align: center;\n      background-color: #e8f2d2;\n      padding: 13px 16px;\n      width: 100%;\n      margin: 1em 0;\n    }\n    .experiment.onlineoffers a {\n      margin-top: 8px;\n    }";
  storeModulesSection.appendChild(onlineoffersStyle);
  var onlineoffers = document.createElement('div');
  onlineoffers.classList.add('experiment', 'onlineoffers');
  onlineoffers.innerHTML = "\n    <div>Sidan visar erbjudanden i butik. Det finns andra <a href=\"/handla/aktuella-erbjudanden/\">erbjudanden</a> om du best\xE4ller fr\xE5n coop.se</div>";
  var onlineoffersLink = onlineoffers.querySelector('a');
  onlineoffersLink.classList.add('Link', 'Link--green');
  onlineoffersLink.style.marginTop = '0px';
  onlineoffersLink.addEventListener('click', function (event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: 'online-offers-click',
      eventLabel: '',
      transport: 'beacon',
      nonInteraction: false
    });
  });
  storeModulesSection.appendChild(onlineoffers);
}