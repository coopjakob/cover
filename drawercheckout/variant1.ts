let element = document.querySelector('.Cart-footer button');

element.textContent = 'Gå till kassan';
element.addEventListener('click', (event) => {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Ecommerce',
    eventAction: 'Slider - Varukorg - Överblick',
    eventLabel: 'Gå till kassan',
  });
  location.href = '/handla/betala/';
});
element.classList.remove('is-disabled');
