document.querySelectorAll('.T75').forEach((element) => {
  T75(element);
});

document.addEventListener('cover.ready T75', (event) => {
  T75(event.target);
});

function T75(button) {
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
