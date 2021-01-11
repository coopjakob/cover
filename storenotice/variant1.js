function showStorenotice() {
  var productList = document.querySelector('.js-productList');

  if (productList) {
    var productListParent = productList.parentElement;
    var storenoticeStyle = document.createElement('style');
    storenoticeStyle.innerHTML = "\n      .experiment.Storenotice {\n        box-sizing: border-box;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        background-color: #e8f2d2;\n        padding: 13px 16px;\n        width: 100%;\n        margin: 1em 0;\n      }\n      \n      .experiment.Storenotice .Storenotice--data {\n        font-weight: bold;\n      }\n      \n      .experiment.Storenotice button {\n        margin-left: 8px;\n      }\n      \n      @media (min-width: 480px) {\n        .experiment.Storenotice {\n          justify-content: flex-start;\n        }\n        .experiment.Storenotice div {\n          display: inline;\n        }\n      }\n    ";
    productListParent.appendChild(storenoticeStyle);
    productListParent.style.flexWrap = 'wrap';
    var storenotice = document.createElement('div');
    storenotice.classList.add('Grid-cell', 'u-sizeFull');
    storenotice.innerHTML = "\n      <div class=\"experiment Storenotice\">\n        <div>\n          <div>Nu visas varor f\xF6r:</div> \n          <div class=\"Storenotice--data\">Hemleverans i Stockholm</div>\n        </div>\n        <button type=\"button\" class=\"Button Button--greenDark Button--small Button--radius js-cartClick\" onclick=\"document.querySelector('.js-cncTrigger .CartButton').click();\">\xC4ndra</button>\n      </div>\n    ";
    productListParent.insertBefore(storenotice, productListParent.firstChild);
  }
}

showStorenotice();
window.addEventListener('ga:virtualPageView', function () {
  window.addEventListener('ga:productImpression', showStorenotice, {
    once: true
  });
});