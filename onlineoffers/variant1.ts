let storeModulesSection = document.querySelector('.js-storeModulesSection');

if (storeModulesSection) {
  const onlineoffersStyle = document.createElement('style');
  onlineoffersStyle.innerHTML = `
        .experiment.onlineoffers {
            box-sizing: border-box;
            text-align: center;
            background-color: #e8f2d2;
            padding: 13px 16px;
            width: 100%;
            margin: 1em 0;
        }
        .experiment.onlineoffers a {
            margin-top: 8px;
        }`;
  storeModulesSection.appendChild(onlineoffersStyle);

  const onlineoffers = document.createElement('div');
  onlineoffers.classList.add('Grid-cell', 'u-sizeFull');
  onlineoffers.innerHTML = `
        <div class="experiment onlineoffers">
            <div>Det finns ytterligare erbjudanden när du beställer från coop.se</div>
            <div><a href="/handla/aktuella-erbjudanden/" class="Button Button--green Button--small Button--radius">Aktuella erbjudanden</a></div>
        </div>`;
  storeModulesSection.appendChild(onlineoffers);
}
