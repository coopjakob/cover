var wrapper = document.querySelector('.Main-container .Section .Grid');
var element = document.createElement('div');
element.classList.add('experiment', 't50', 'Grid-cell', 'u-sizeFull');

if (element.clientWidth > 310) {
  element.innerHTML = 'Spara tid – Handla hemma<br>Hämta i butik';
} else {
  element.innerText = 'Spara tid – Handla hemma – Hämta i butik';
}

element.style.padding = '5px 10px';
element.style.border = '1px solid #005537';
element.style.borderTop = 'unset';
element.style.backgroundColor = 'white';
element.style.borderRadius = '0 0 6px 6px';
element.style.fontSize = '0.9em';
element.style.textAlign = 'center';
wrapper.prepend(element);
var style = document.createElement('style');
style.innerHTML = "\n  @media only screen and (max-width: 1025px) {\n    .js-childLayoutContainer.u-marginTmd {\n      margin-top: 10px !important;\n    }\n  }\n";
wrapper.prepend(style);