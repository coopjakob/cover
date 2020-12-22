const experimentStyle = document.createElement('style');
experimentStyle.innerHTML = `
.Cart--mini .Cart-headerInfo--thin {
  height: auto 
}
.Cart--mini .Cart-headerInfo--thin .experiment {
  display: none;
}
`;
document.body.appendChild(experimentStyle);

let header = document.querySelector('.Cart-header.Cart-headerInfo');

let clickLink = header.querySelector('.Link');
if (clickLink.innerText === 'Hemleverans') {
  clickLink = header.querySelectorAll('.Link')[1];
}

let changeButton = document.createElement('button');
changeButton.setAttribute('type', 'button');
changeButton.classList.add(
  'experiment',
  'Button',
  'Button--green',
  'Button--small',
  'Button--radius'
);
changeButton.style.marginTop = '8px';
changeButton.innerText = 'Ändra leveranssätt';
changeButton.addEventListener('click', () => {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'change-button-click',
    eventLabel: '',
    transport: 'beacon',
    nonInteraction: true,
  });
  clickLink.click();
});
header.appendChild(changeButton);
