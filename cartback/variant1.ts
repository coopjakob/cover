let modalContainer = document.querySelector('#portal .Modal-container');

let containerDiv = modalContainer.querySelector('div');
let back = document.createElement('button');
back.classList.add(
  'Experiment',
  'T59',
  'u-flex',
  'u-flexAlignCenter',
  'u-textXSmall'
);
back.innerHTML =
  '<svg role="img"><svg viewBox="0 0 12 14"><path d="M12.3 6.9H-.2m5 5l-5-5 5-5"></path></svg></svg>Fortsätt handla';

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

let styleT59 = document.createElement('style');
styleT59.innerHTML = `
  .Experiment.T59 {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    padding: .93750234rem;
    stroke: #333;
  }
  .Experiment.T59 svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    fill: none;
  }
  .Experiment.T59:hover {
    text-decoration: underline;
    color: #00aa46;
    stroke: #00aa46;
  }
`;
document.body.appendChild(styleT59);
