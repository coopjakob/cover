let container = document.createElement('li');
container.classList.add(
  'experiment',
  't43',
  'Navigation-item',
  'u-paddingLmd',
  'u-paddingRz'
);

let button = document.createElement('div');
button.classList.add(
  'Button',
  'Button--green',
  'Button--radius',
  'u-paddingHsm'
);

let link = document.createElement('a');
link.style.color = 'white';
link.textContent = 'Till kassan';
link.addEventListener('click', (event) => {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'headercheckout-click',
  });
  location.href = '/handla/betala/';
});

let wrapper = document.querySelector(
  '.Navigation--secondaryGreen .Navigation-list'
);

button.append(link);
container.append(button);
wrapper.append(container);

let style = document.createElement('style');
style.innerHTML = `
  .t43 .Button--green:hover {
    background-color: unset;
    border-color: white;
  }
`;
document.body.appendChild(style);
