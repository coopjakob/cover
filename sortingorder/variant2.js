var steps = dataLayer.length;
var step;

while (steps > 0) {
  step = steps - 1;

  if (step === 0 || dataLayer[step].event === 'gtm.historyChange') {
    window.addEventListener('ga:productImpression', run, {
      once: true
    });
    break;
  }

  if (dataLayer[step].event === 'impression') {
    run();
    break;
  }

  steps = steps - 1;
}

function run() {
  if (!document.querySelector('.experiment.t49')) {
    var wrapper;

    if (window.location.pathname.startsWith('/handla/varor/')) {
      wrapper = document.querySelector('.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown');
    } else {
      wrapper = document.querySelector('.Dropdown.Dropdown--stripped.Dropdown--limitHeight');
    }

    var label = document.createElement('p');
    label.classList.add('experiment', 't49', 'u-pullLeft', 'u-marginAxsm');
    label.innerText = 'Sortera:';
    wrapper.prepend(label);
  }
}