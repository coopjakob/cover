function experimentEvent(action: string, nonInteraction: boolean) {
  if (typeof ga !== 'undefined') {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: action,
      eventLabel: '',
      transport: 'beacon',
      nonInteraction: nonInteraction,
    });
  } else {
    console.warn('ga undefined', action);
  }
}

experimentEvent('view', true);
experimentEvent('click-close', false);
experimentEvent('click-login', false);
experimentEvent('click-register', false);

if (window.location.pathname == '/') {
  hj('trigger', 'experiment-loginreminder-variant1');
}
