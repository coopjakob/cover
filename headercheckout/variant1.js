var element = document.createElement('li');
element.classList.add('experiment', 't43', 'Navigation-item', 'u-paddingLmd', 'u-paddingRz');
element.innerHTML = "\n  <div class=\"Button Button--green Button--radius u-paddingHsm \">\n    <a href=\"https://www.coop.se/handla/betala/\" style=\"color: white!important\">Till kassan</a>\n  </div>\n";
var wrapper = document.querySelector('.Navigation--secondaryGreen .Navigation-list');
wrapper.append(element);
var style = document.createElement('style');
style.innerHTML = "\n  .t43 .Button--green:hover {\n    border-color: white;\n  }\n";
document.body.appendChild(style);
var link = document.createElement('a');
link.style.color = 'white!important';
link.textContent = 'Till kassan';
link.addEventListener('click', function (event) {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'headercheckout-click'
  });

  if (window.dataLayer.find(function (x) {
    return x.event === 'nonInteraction';
  }).storeId == 0) {
    document.querySelector('.js-cncTrigger .CartButton').click();
  } else {
    location.href = 'https://www.coop.se/handla/betala/';
  }
});