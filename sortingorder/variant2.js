var steps = dataLayer.length;
var step;

while (steps > 0) {
  step = steps - 1;

  if (dataLayer[step].event === 'gtm.historyChange') {
    window.addEventListener('ga:productImpression', run, {
      once: true
    });
    break;
  }

  if (step === 0 || dataLayer[step].event === 'impression') {
    run();
    break;
  }

  steps = steps - 1;
}

function run() {
  var wrapper = document.querySelector('.js-accordionFilter > .u-flex > .Dropdown');

  if (window.location.pathname.startsWith('/handla/varor/')) {
    wrapper = document.querySelector('.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown');
  }

  var label = document.createElement('p');
  label.classList.add('experiment', 'u-pullLeft', 'u-marginAxsm');
  label.innerText = 'Sortera:';
  wrapper.prepend(label);
}