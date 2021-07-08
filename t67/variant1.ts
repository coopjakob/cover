document.querySelector('.T67')?.remove();

document.addEventListener('cover.ready T67', (event) => {
  console.log(event);
  event.target.remove();
});
