document.querySelector('.T67')?.classList.add('u-hidden');

document.addEventListener('cover.ready T67', (event) => {
  console.log(event);
  event.target.classList.add('u-hidden');
});
