var storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  var onlineoffersStyle = document.createElement('style');
  onlineoffersStyle.innerHTML = "\n    .experiment.onlineoffers {\n      box-sizing: border-box;\n      text-align: center;\n      background-color: #e8f2d2;\n      padding: 13px 16px;\n      width: 100%;\n      margin: 1em 0;\n    }\n    .experiment.onlineoffers a {\n      margin-top: 8px;\n    }";
  storeModulesSection.appendChild(onlineoffersStyle);
  var onlineoffers = document.createElement('div');
  onlineoffers.classList.add('experiment', 'onlineoffers');
  onlineoffers.innerHTML = "\n    <div>Denna sida visar erbjudanden i butik. Det finns andra erbjudanden n\xE4r du best\xE4ller fr\xE5n coop.se</div>";
  var onlineoffersLink = document.createElement('a');
  onlineoffersLink.classList.add('Button', 'Button--green', 'Button--small', 'Button--radius');
  onlineoffersLink.innerText = 'Visa';
  onlineoffersLink.addEventListener('click', function (event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: 'online-offers-click',
      eventLabel: '',
      transport: 'beacon',
      nonInteraction: false
    });
    document.location.href = '/handla/aktuella-erbjudanden/';
  });
  onlineoffers.appendChild(onlineoffersLink);
  storeModulesSection.appendChild(onlineoffers);
}