const experimentStyle = document.createElement('style');
experimentStyle.innerHTML = `
.Cart--mini .Cart-headerInfo--thin {
  height: auto 
}
.Cart--mini .Cart-headerInfo--thin .Cart-title {
  display: block;
}
`;
document.body.appendChild(experimentStyle);

let header = document.querySelector('.Cart-header.Cart-headerInfo');

let clickLink = header.querySelector('.Link');
if (clickLink.innerText === 'Hemleverans') {
  clickLink = header.querySelectorAll('.Link')[1];
}

let buyButton = document.createElement('button');
buyButton.setAttribute('type', 'button');
buyButton.classList.add(
  'experiment',
  'Button',
  'Button--green',
  'Button--small',
  'Button--radius'
);
buyButton.style.marginTop = '8px';
buyButton.innerText = 'Ändra leveranssätt';
buyButton.addEventListener('click', () => {
  clickLink.click();
});
header.appendChild(buyButton);
