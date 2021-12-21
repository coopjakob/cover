document.querySelectorAll('.T84').forEach((element) => {
  t84(element);
});

document.addEventListener('cover.ready T84', (event) => {
  t84(event.currentTarget);
});

function t84(element) {
  element?.remove();
}
