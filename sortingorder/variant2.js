window.addEventListener('ga:productImpression', function () {
  var wrapper = document.querySelector('.js-accordionFilter > .u-flex > .Dropdown');

  if (window.location.pathname.startsWith('/handla/varor/')) {
    wrapper = document.querySelector('.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown');
  }

  var label = document.createElement('p');
  label.classList.add('experiment', 'u-pullLeft', 'u-marginAxsm');
  label.innerText = 'Sortera:';
  wrapper.prepend(label);
}, {
  once: true
});