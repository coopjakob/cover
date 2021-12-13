t82();

document.addEventListener('cover.ready T82', (event) => {
  t82(event.currentTarget);
});

function t82(element = document.querySelector('.Experiment.T82')) {
  if (element) {
    const title = element.querySelector('h2');
    const body = element.querySelector('p');
    const button = element.querySelector('.Button');

    element.style.minHeight = 'unset';
    element.style.textAlign = 'center';

    title.innerText = 'Medlemmar tjänar mer!';
    title.classList.add('u-sizeFull', 'u-sm-textLeft');

    body.innerText =
      'Samla poäng och handla till medlemspriser även på Coop.se – anslut ditt medlemskap.';
    body.classList.add('u-marginBxsm', 'u-sm-textLeft');

    const logo = document.createElement('span');
    logo.innerHTML = `
      <svg class="Icon Icon--bankid u-alignTextTop u-marginLxsm" role="img">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=210223.1040#bankid">
          <title>BankID</title>
        </use>
      </svg>
    `;

    button.append(logo);
  }
}
