var queries = new URLSearchParams(location.search);

if (queries.get('variant') == '2') {
  let steps = dataLayer.length;
  let step;

  while (steps > 0) {
    step = steps - 1;

    if (step === 0 || dataLayer[step].event === 'gtm.historyChange') {
      window.addEventListener('ga:productImpression', run, {
        once: true,
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
      let wrapper;

      if (window.location.pathname.startsWith('/handla/varor/')) {
        wrapper = document.querySelector(
          '.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown'
        );
      } else {
        wrapper = document.querySelector(
          '.Dropdown.Dropdown--stripped.Dropdown--limitHeight'
        );
      }

      let label = document.createElement('p');
      label.classList.add('experiment', 't49', 'u-pullLeft', 'u-marginAxsm');
      label.innerText = 'Sortera:';

      wrapper.prepend(label);
    }
  }
} else {
  let steps = dataLayer.length;
  let step;

  while (steps > 0) {
    step = steps - 1;

    if (step === 0 || dataLayer[step].event === 'gtm.historyChange') {
      window.addEventListener('ga:productImpression', run, {
        once: true,
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
      let element;

      if (window.location.pathname.startsWith('/handla/varor/')) {
        element = document.querySelector(
          '.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown-header'
        );
      } else {
        element = document.querySelector(
          '.Dropdown.Dropdown--stripped.Dropdown--limitHeight .Dropdown-header'
        );
      }

      element.classList.add('experiment', 't49');

      let experimentStyle = document.createElement('style');
      experimentStyle.innerHTML = `
        .Dropdown .Dropdown-header {
          border: 1px solid #777777!important;
        }
      `;
      document.body.appendChild(experimentStyle);

      let wrapper;

      if (window.location.pathname.startsWith('/handla/varor/')) {
        wrapper = document.querySelector(
          '.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown'
        );
      } else {
        wrapper = document.querySelector(
          '.Dropdown.Dropdown--stripped.Dropdown--limitHeight'
        );
      }

      let label = document.createElement('p');
      label.classList.add('experiment', 't49', 'u-pullLeft', 'u-marginAxsm');
      label.innerText = 'Sortera:';

      wrapper.prepend(label);
    }
  }
}
