var container = document.createElement('li');
container.classList.add('experiment', 't43', 'Navigation-item', 'u-paddingLmd', 'u-paddingRz');
var link = document.createElement('a');
link.classList.add('Button', 'Button--green', 'Button--radius', 'u-paddingHsm');
link.style.color = 'white';
link.textContent = 'Till kassan';
link.addEventListener('click', function (event) {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'headercheckout-click',
    eventLabel: ''
  });
  location.href = '/handla/betala/';
});
var wrapper = document.querySelector('.Navigation--secondaryGreen .Navigation-list');
container.append(link);
wrapper.append(container);
var style = document.createElement('style');
style.innerHTML = "\n  .t43 .Button--green:hover {\n    background-color: unset;\n    border-color: white;\n  }\n";
document.body.appendChild(style);