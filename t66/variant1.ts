document.querySelector('.T66')?.classList.add('u-hidden');

if (window.location.pathname == '/handla/') {
  document
    .querySelector('[data-react-component="NoticeRibbonDefaultStore"]')
    ?.classList.add('u-hidden');
}

document.addEventListener('cover.ready T66', (event) => {
  const element = event.target as HTMLElement;
  element.classList.add('u-hidden');
});
