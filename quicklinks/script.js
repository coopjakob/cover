function experimentClick(label) {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'click',
    eventLabel: label,
    transport: 'beacon'
  });
}

document.querySelectorAll('.quicklinks .item a').forEach(function (e) {
  e.addEventListener('click', function () {
    experimentClick(e.getAttribute('href'));
  });
});
document.querySelectorAll('.quicklinks .item').forEach(function (element) {
  element.addEventListener('click', function (event) {
    var originalColor = element.style.backgroundColor;
    element.style.backgroundColor = '#e8f2d2';
    setTimeout(function () {
      element.style.backgroundColor = originalColor;
    }, 300);
  });
});