const storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  const onlineoffers = document.createElement('p');
  onlineoffers.classList.add('u-textCenter', 'u-paddingAmd', 'u-bgGreenLight2');
  onlineoffers.innerHTML = `
    Sidan visar erbjudanden i butik. Det finns andra <a href="/handla/aktuella-erbjudanden/">erbjudanden</a> om du beställer från coop.se`;

  const onlineoffersLink = onlineoffers.querySelector('a');
  onlineoffersLink.classList.add('Link', 'Link--green');
  onlineoffersLink.addEventListener('click', (event) => {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'online-offers-click',
    });
  });

  storeModulesSection.appendChild(onlineoffers);
}
