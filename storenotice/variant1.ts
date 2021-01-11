function showStorenotice() {
  let productList = document.querySelector('.js-productList');

  if (productList) {
    let productListParent = productList.parentElement;

    const storenoticeStyle = document.createElement('style');
    storenoticeStyle.innerHTML = `
      .experiment.Storenotice {
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #e8f2d2;
        padding: 13px 16px;
        width: 100%;
        margin: 1em 0;
      }
      
      .experiment.Storenotice .Storenotice--data {
        font-weight: bold;
      }
      
      .experiment.Storenotice button {
        margin-left: 8px;
      }
      
      @media (min-width: 480px) {
        .experiment.Storenotice {
          justify-content: flex-start;
        }
        .experiment.Storenotice div {
          display: inline;
        }
      }
    `;
    productListParent.appendChild(storenoticeStyle);

    productListParent.style.flexWrap = 'wrap';

    const storenotice = document.createElement('div');
    storenotice.classList.add('Grid-cell', 'u-sizeFull');
    storenotice.innerHTML = `
      <div class="experiment Storenotice">
        <div>
          <div>Nu visas varor för:</div> 
          <div class="Storenotice--data">Hemleverans i Stockholm</div>
        </div>
        <button type="button" class="Button Button--greenDark Button--small Button--radius js-cartClick" onclick="document.querySelector('.js-cncTrigger .CartButton').click();">Ändra</button>
      </div>
    `;
    productListParent.insertBefore(storenotice, productListParent.firstChild);
  }
}

showStorenotice();

window.addEventListener('ga:virtualPageView', () => {
  window.addEventListener('ga:productImpression', showStorenotice, {
    once: true,
  });
});
