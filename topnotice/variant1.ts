let element = document.createElement('div');
element.classList.add('experiment', 't50', 'Grid-cell', 'u-sizeFull');

element.innerHTML = `
  <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.074 9.746l5.662-8.432a.4.4 0 01.592-.098.494.494 0 01.09.649l-5.924 8.821a.4.4 0 01-.604.087L.659 7.06a.496.496 0 01-.066-.653.398.398 0 01.594-.072l3.887 3.412z" fill="#fff" stroke="#fff" stroke-width=".5"/>
  </svg> Spara tid

  <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.074 9.746l5.662-8.432a.4.4 0 01.592-.098.494.494 0 01.09.649l-5.924 8.821a.4.4 0 01-.604.087L.659 7.06a.496.496 0 01-.066-.653.398.398 0 01.594-.072l3.887 3.412z" fill="#fff" stroke="#fff" stroke-width=".5"/>
  </svg> Handla hemma

  <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.074 9.746l5.662-8.432a.4.4 0 01.592-.098.494.494 0 01.09.649l-5.924 8.821a.4.4 0 01-.604.087L.659 7.06a.496.496 0 01-.066-.653.398.398 0 01.594-.072l3.887 3.412z" fill="#fff" stroke="#fff" stroke-width=".5"/>
  </svg> Flexibel leverans
  `;

element.style.padding = '9px 0 9px 0';
element.style.backgroundColor = '#00AA46';
element.style.fontSize = '0.75em';
element.style.textAlign = 'center';
element.style.color = 'white';
element.style.marginBottom = '1.25em';
element.style.fontWeight = 'bold';

element.querySelectorAll('svg').forEach(function (element) {
  element.style.margin = '0 2px 0 8px';
  element.style.verticalAlign = 'top';
  element.style.marginTop = '2px';
});

// no margin left on first icon, to make everything centered
element.querySelector('svg').style.marginLeft = '0';

let wrapper = document.querySelector('.js-childLayoutContainer');
wrapper.prepend(element);

wrapper.classList.remove('u-marginTmd');
