document.querySelector('.T66')?.classList.add('u-hidden');

if (window.location.pathname == '/handla/') {
  document
    .querySelector('[data-react-component="NoticeRibbonDefaultStore"]')
    ?.classList.add('u-hidden');
}

document.addEventListener('cover.ready T66', (event) => {
  console.log(event);
  event.target.classList.add('u-hidden');
});
