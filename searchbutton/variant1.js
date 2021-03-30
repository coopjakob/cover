var style = document.createElement('style');
style.innerHTML = "\n  .Search.Search--online .Search-icon {\n    top: -1px;\n    right: -1px;\n    left: unset;\n    width: 40px;\n    height: 44px;\n    padding: 0;\n    border-right: 4px solid #00aa46;\n    background-color: #00aa46;\n    border-radius: 0 22px 22px 0;\n  }\n\n  .Search.Search--radiusDropdown.is-active .Search-icon {\n    border-radius: 0 22px 0 0;\n  }\n\n  .Search-clear {\n    right: 44px !important;\n  }\n\n  .Search-input {\n    padding-left: 1rem;\n  }\n\n  .Search.Search--green .Search-content .Search-icon svg {\n    stroke: white !important;\n  }\n";
document.body.appendChild(style);
var element = document.querySelector('.Search.Search--online .Search-icon');
element.addEventListener('click', function () {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'searchbutton-click',
    eventLabel: ''
  });
  var enterkey = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13
  });
  document.querySelector('.Search-input').dispatchEvent(enterkey);
});