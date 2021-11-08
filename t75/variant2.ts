document.querySelectorAll('.T75').forEach((element) => {
  T75(element);
});

document.addEventListener('cover.ready T75', (event) => {
  T75(event.target);
});

function T75(button) {
  if (!button.matches('[data-event=substitute-click]')) {
    button.dataset.event = 'substitute-click';
    button.addEventListener('click', (event) => {
      if (event.currentTarget.querySelector('.svg-close.u-hidden')) {
        dataLayer.push({
          event: 'interaction',
          eventCategory: 'Experiment',
          eventAction: 'substitute-click',
          eventLabel: '',
        });
        DY.API('event', {
          name: `substitute-click`,
        });
      }
    });
  }
}
