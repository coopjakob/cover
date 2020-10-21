function experimentClick(label) {
  console.log('send:', label);
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'click',
    eventLabel: label,
    transport: 'beacon'
  });
}

document.querySelectorAll('.quicklinks .item a').forEach(function (e) {
  console.log('listen: ', e.getAttribute('href'));
  e.addEventListener('click', function () {
    console.log('click: ', e.getAttribute('href'));
    experimentClick(e.getAttribute('href'));
  });
});