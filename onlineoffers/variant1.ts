let storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  const onlineoffersStyle = document.createElement('style');
  onlineoffersStyle.innerHTML = `
    .experiment.onlineoffers {
      box-sizing: border-box;
      text-align: center;
      background-color: #e8f2d2;
      padding: 13px 16px;
      width: 100%;
      margin: 1em 0;
    }
    .experiment.onlineoffers a {
      margin-top: 8px;
    }`;
  storeModulesSection.appendChild(onlineoffersStyle);

  const onlineoffers = document.createElement('div');
  onlineoffers.classList.add('experiment', 'onlineoffers');
  onlineoffers.innerHTML = `
    <div>Denna sida visar erbjudanden i butik. Det finns andra erbjudanden när du beställer från coop.se</div>`;

  const onlineoffersLink = document.createElement('a');
  onlineoffersLink.classList.add(
    'Button',
    'Button--green',
    'Button--small',
    'Button--radius'
  );
  onlineoffersLink.innerText = 'Visa';
  onlineoffersLink.addEventListener('click', (event) => {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: 'online-offers-click',
      eventLabel: '',
      transport: 'beacon',
      nonInteraction: false,
    });
    document.location.href = '/handla/aktuella-erbjudanden/';
  });

  onlineoffers.appendChild(onlineoffersLink);

  storeModulesSection.appendChild(onlineoffers);
}
