let wrapper = document.querySelector('.js-page');

let element = document.createElement('div');
element.classList.add('experiment', 't50', 'Grid-cell', 'u-sizeFull');

element.innerText = 'Spara tid – Handla hemma – Flexibel leverans';

element.style.padding = '9px';
element.style.backgroundColor = '#00AA46';
element.style.fontSize = '0.75em';
element.style.textAlign = 'center';
element.style.color = 'white';
element.style.marginBottom = '1.25em';

wrapper.prepend(element);

let container = document.querySelector('.js-childLayoutContainer');
container.classList.remove('u-marginTmd');
