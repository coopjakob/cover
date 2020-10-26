function experimentClick(label) {
  console.log('send:', label);
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'click',
    eventLabel: label,
    transport: 'beacon',
  });
}

document.querySelectorAll('.quicklinks .item a').forEach((e) => {
  console.log('listen: ', e.getAttribute('href'));
  e.addEventListener('click', () => {
    console.log('click: ', e.getAttribute('href'));
    experimentClick(e.getAttribute('href'));
  });
});

document.querySelectorAll('.quicklinks .item').forEach((element) => {
  element.addEventListener('touchstart', (event) => {
    element.style.backgroundColor = '#e8f2d2';
  });
});
