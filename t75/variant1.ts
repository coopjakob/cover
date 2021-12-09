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

  button.style.width = 'unset';
  button.style.borderRadius = '999px';
  button.style.padding = '5px 15px';
  button.style.backgroundColor = 'white';

  const icon = button.querySelector('svg');
  icon.style.left = '10px';
  icon.style.right = 'unset';
  icon.style.stroke = '#00aa46';

  const label = document.createElement('span');
  label.style.marginLeft = '20px';
  label.innerText = 'Byt vara';

  const close = button.querySelector('.svg-close');
  close.style.left = '12px';
  close.style.right = 'unset';
  close.style.stroke = '#00aa46';

  button.insertBefore(label, close);
}
