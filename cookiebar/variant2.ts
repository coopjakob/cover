declare const { ga, hj };

function experimentEvent(action: string, label?: undefined) {
  if (typeof ga !== 'undefined') {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: action,
      eventLabel: label,
      transport: 'beacon',
    });
  } else {
    console.warn('ga undefined', action);
  }
}

document
  .querySelector('.m-notification.is-cookie .is-close')
  .addEventListener('click', () => {
    experimentEvent('click-close');
  });
document
  .querySelector('.m-notification.is-cookie .a-link')
  .addEventListener('click', () => {
    experimentEvent('click-more');
  });

window.dispatchEvent(new Event('resize'));

hj('trigger', 'experiment-cookiebar-bottom');
