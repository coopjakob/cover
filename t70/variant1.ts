document.querySelectorAll('.T70').forEach((element) => {
  t70(element);
});

document.addEventListener('cover.ready T70', (event) => {
  t70(event.target);
});

function t70(element) {
  element.style.opacity = 1;
}
