var element = document.querySelector('.Cart-footer button');
element.textContent = 'Gå till kassan';
element.addEventListener('click', function (event) {
  location.href = '/handla/betala/';
});
element.classList.remove('is-disabled');