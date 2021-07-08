document.querySelector('.T66')?.remove();

document.addEventListener('cover.ready T66', (event) => {
  console.log(event);
  event.target.remove();
});
