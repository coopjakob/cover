var queries = new URLSearchParams(location.search);

if (queries.get('variant') == '2') {
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
} else {
  var _steps = dataLayer.length;

  var _step;

  while (_steps > 0) {
    _step = _steps - 1;

    if (_step === 0 || dataLayer[_step].event === 'gtm.historyChange') {
      window.addEventListener('ga:productImpression', run, {
        once: true
      });
      break;
    }

    if (dataLayer[_step].event === 'impression') {
      run();
      break;
    }

    _steps = _steps - 1;
  }

  function run() {
    if (!document.querySelector('.experiment.t49')) {
      var element;

      if (window.location.pathname.startsWith('/handla/varor/')) {
        element = document.querySelector('.js-accordionFilter > .u-flex > .u-sm-flex .Dropdown-header');
      } else {
        element = document.querySelector('.Dropdown.Dropdown--stripped.Dropdown--limitHeight .Dropdown-header');
      }

      element.classList.add('experiment', 't49');
      var experimentStyle = document.createElement('style');
      experimentStyle.innerHTML = "\n        .Dropdown .Dropdown-header {\n          border: 1px solid #777777!important;\n        }\n      ";
      document.body.appendChild(experimentStyle);
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
}