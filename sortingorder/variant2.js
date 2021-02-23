var wrapper = document.querySelector('.js-accordionFilter > .u-flex > .u-sm-flex');
var label = document.createElement('p');
label.classList.add('experiment', 'u-marginAxsm');
label.innerText = 'Sortera:';
wrapper.prepend(label);

document.querySelectorAll('.js-accordionFilter .Dropdown .Dropdown-header').forEach(function (element) {
  element.style.border = '1px solid #777777';
});