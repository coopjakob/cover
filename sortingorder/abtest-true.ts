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
    label.classList.add('experiment', 't41', 'u-pullLeft', 'u-marginAxsm');
    label.innerText = 'Sortera:';

    wrapper.prepend(label);
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

    element.classList.add('experiment', 't41');

    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = '16px center';
    element.style.backgroundImage =
      'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNyAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDMuNTcxMjlWMTIuOTk5OSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE2LjQyODQgOS41NzIyN0wxMi45OTk5IDEzLjAwMDhMOS41NzEyOSA5LjU3MjI3IiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNC40Mjg3MSAxMC40Mjg2VjEiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xIDQuNDI4NTdMNC40Mjg1NyAxTDcuODU3MTQgNC40Mjg1NyIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==)';
    element.style.paddingLeft = '41px';

    let experimentStyle = document.createElement('style');
    experimentStyle.innerHTML = `
      .Dropdown .Dropdown-header {
        border: 1px solid #777777!important;
      }
    `;
    document.body.appendChild(experimentStyle);
  }
}
