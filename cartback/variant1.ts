let modalContainer = document.querySelector('#portal .Modal-container');

let containerDiv = modalContainer.querySelector('div');
let back = document.createElement('button');
back.classList.add('FlyIn-back', 'u-flex', 'u-flexAlignCenter', 'u-textXSmall');
back.innerHTML =
  '<svg role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=210608.1232#pointer-left"><title>Tillbaka</title></use></svg> &nbsp; Fortsätt handla';

containerDiv.prepend(back);

back.addEventListener('click', (event) => {
  document.querySelector('.FlyIn-close').click();
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'cartback-click',
    eventLabel: '',
  });
});
