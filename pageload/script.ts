document.addEventListener('load', function () {
  var loadTime =
    window.performance.timing.loadEventEnd -
    window.performance.timing.navigationStart;

  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'load-time',
    eventValue: loadTime,
    transport: 'beacon',
    nonInteraction: true,
  });

  console.log('<experiment> load time', loadTime);
});
