var containerDiv = document.querySelector('#portal .Modal-container .Cart-header');
var back = document.createElement('button');
back.classList.add('Experiment', 'T59', 'u-flex', 'u-flexAlignCenter', 'u-textXSmall');
back.innerHTML = '<svg role="img"><svg viewBox="0 0 12 14"><path d="M12.3 6.9H-.2m5 5l-5-5 5-5"></path></svg></svg><span>Fortsätt handla</span>';
containerDiv.prepend(back);
back.addEventListener('click', function (event) {
  document.querySelector('.FlyIn-close').click();
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'cartback-click',
    eventLabel: ''
  });
});
var styleT59 = document.createElement('style');
styleT59.innerHTML = "\n  .Experiment.T59 {\n    z-index: 2;\n    position: absolute;\n    top: 0;\n    left: 0;\n    cursor: pointer;\n    padding: .93750234rem;\n    stroke: #333;\n  }\n  .Experiment.T59 svg {\n    width: 16px;\n    height: 16px;\n    margin-right: 5px;\n    fill: none;\n  }\n  .Experiment.T59:hover {\n    text-decoration: underline;\n    color: #00aa46;\n    stroke: #00aa46;\n  }\n  .Cart-headerInfo--slim .Experiment.T59 span {\n    display: none;\n  }\n";
document.body.appendChild(styleT59);