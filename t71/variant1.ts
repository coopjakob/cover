t71(document.querySelector('.T71'));

document.addEventListener('cover.ready T71', (event) => {
  t71(event.target);
});

function t71(element) {
  const link = document.createElement('a');
  link.classList.add('Link', 'Link--green');
  link.href = '/handla/aktuella-erbjudanden/';
  link.innerText = 'Visa alla';

  element.append(link);
}
