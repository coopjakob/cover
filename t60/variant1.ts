document.querySelectorAll('.T60').forEach((element) => {
  run(element);
});

document.addEventListener('cover.ready T60', (event) => {
  run(event.target);
});

function run(element) {
  element.classList.add('u-lg-size1of4');
  element.classList.remove('u-lg-size1of6');

  element.querySelector('.ItemTeaser-media').style.height = '200px';

  let button = element.querySelector('.ItemTeaser-button');
  button.style.width = '170px';
  button.style.margin = '0 auto';
}
