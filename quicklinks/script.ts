function experimentClick(label) {
  console.debug('<experiment> click', label);
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'click',
    eventLabel: label,
    transport: 'beacon',
  });
}

document.querySelectorAll('.quicklinks .item a').forEach((e) => {
  console.debug('<experiment> listen for', e.getAttribute('href'));
  e.addEventListener('click', () => {
    console.debug('<experiment> click', e.getAttribute('href'));
    experimentClick(e.getAttribute('href'));
  });
});

document.querySelectorAll('.quicklinks .item').forEach((element) => {
  element.addEventListener('touchstart', (event) => {
    console.debug('<experiment> touchstart');
    element.style.backgroundColor = '#e8f2d2';
  });
});
