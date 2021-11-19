t71();

document.addEventListener('cover.ready T71', () => {
  t71();
});

function t71() {
  const element = document.querySelector('.T71');
  const link = document.createElement('a');

  link.classList.add('Link', 'Link--green');
  link.href = '/handla/aktuella-erbjudanden/';
  link.innerText = 'Visa alla';

  link.addEventListener('click', () => {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'T71-click',
      eventLabel: '',
    });
    DY.API('event', {
      name: 'T71-click',
    });
  });

  element.append(link);
}
