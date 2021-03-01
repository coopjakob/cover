let element = document.createElement('li');
element.classList.add(
  'experiment',
  't43',
  'Navigation-item',
  'u-paddingLmd',
  'u-paddingRz'
);
element.innerHTML = `
  <div class="Button Button--green Button--radius u-paddingHsm ">
    <a href="https://www.coop.se/handla/betala/" style="color: white!important">Till kassan</a>
  </div>
`;

let wrapper = document.querySelector(
  '.Navigation--secondaryGreen .Navigation-list'
);
wrapper.append(element);

let style = document.createElement('style');
style.innerHTML = `
  .t43 .Button--green:hover {
    border-color: white;
  }
`;
document.body.appendChild(style);

let link = document.createElement('a');
link.style.color = 'white!important';
link.textContent = 'Till kassan';
link.addEventListener('click', (event) => {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'headercheckout-click',
  });

  if (window.dataLayer.find((x) => x.event === 'nonInteraction').storeId == 0) {
    document.querySelector('.js-cncTrigger .CartButton').click();
  } else {
    location.href = 'https://www.coop.se/handla/betala/';
  }
});
