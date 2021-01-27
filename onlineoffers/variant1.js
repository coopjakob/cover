var storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  var onlineoffersStyle = document.createElement('style');
  onlineoffersStyle.innerHTML = "\n        .experiment.onlineoffers {\n            box-sizing: border-box;\n            text-align: center;\n            background-color: #e8f2d2;\n            padding: 13px 16px;\n            width: 100%;\n            margin: 1em 0;\n        }\n        .experiment.onlineoffers a {\n            margin-top: 8px;\n        }";
  storeModulesSection.appendChild(onlineoffersStyle);
  var onlineoffers = document.createElement('div');
  onlineoffers.classList.add('Grid-cell', 'u-sizeFull');
  onlineoffers.innerHTML = "\n        <div class=\"experiment onlineoffers\">\n            <div>Det finns ytterligare erbjudanden n\xE4r du best\xE4ller fr\xE5n coop.se</div>\n            <div><a href=\"/handla/aktuella-erbjudanden/\" class=\"Button Button--green Button--small Button--radius\">Aktuella erbjudanden</a></div>\n        </div>";
  storeModulesSection.appendChild(onlineoffers);
}