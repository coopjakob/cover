var experimentStyle = document.createElement('style');
experimentStyle.innerHTML = "\n.Cart--mini .Cart-headerInfo--thin {\n  height: auto \n}\n.Cart--mini .Cart-headerInfo--thin .experiment {\n  display: none;\n}\n";
document.body.appendChild(experimentStyle);
var header = document.querySelector('.Cart-header.Cart-headerInfo');
var clickLink = header.querySelector('.Link');

if (clickLink.innerText === 'Hemleverans') {
  clickLink = header.querySelectorAll('.Link')[1];
}

var buyButton = document.createElement('button');
buyButton.setAttribute('type', 'button');
buyButton.classList.add('experiment', 'Button', 'Button--green', 'Button--small', 'Button--radius');
buyButton.style.marginTop = '8px';
buyButton.innerText = 'Ändra leveranssätt';
buyButton.addEventListener('click', function () {
  clickLink.click();
});
header.appendChild(buyButton);