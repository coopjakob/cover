let header = document.querySelector('.Cart-header.Cart-headerInfo');
header.style.paddingBottom = 0;
header.style.height = 'auto';

let clickLink = header.querySelector('.Link');
if (clickLink.innerText === 'Hemleverans') {
  clickLink = header.querySelectorAll('.Link')[1];
}

let buyButton = document.createElement('button');
buyButton.setAttribute('type', 'button');
buyButton.classList.add(
  'Button',
  'Button--green',
  'Button--small',
  'Button--radius'
);
buyButton.style.marginTop = '8px';
buyButton.style.marginBottom = '12px';
buyButton.innerText = 'Ändra leveranssätt';
buyButton.addEventListener('click', () => {
  clickLink.click();
});
header.appendChild(buyButton);
