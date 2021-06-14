document.querySelectorAll('.Grid-cell').forEach((element) => {
  element.classList.remove('u-lg-size1of6');
  element.classList.add('u-lg-size1of4');
  element.querySelector('.ItemTeaser-media').style.height = '200px';
});
