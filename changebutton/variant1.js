var experimentStyle = document.createElement('style');
experimentStyle.innerHTML = "\n.Cart--mini .Cart-headerInfo--thin {\n  height: auto \n}\n.Cart--mini .Cart-headerInfo--thin .experiment {\n  display: none;\n}\n";
document.body.appendChild(experimentStyle);
var header = document.querySelector('.Cart-header.Cart-headerInfo');
var clickLink = header.querySelector('.Link');

if (clickLink.innerText === 'Hemleverans') {
  clickLink = header.querySelectorAll('.Link')[1];
}

var changeButton = document.createElement('button');
changeButton.setAttribute('type', 'button');
changeButton.classList.add('experiment', 'Button', 'Button--green', 'Button--small', 'Button--radius');
changeButton.style.marginTop = '8px';
changeButton.innerText = 'Ändra leveranssätt';
changeButton.addEventListener('click', function () {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Experiment',
    eventAction: 'change-button-click',
    eventLabel: '',
    transport: 'beacon',
    nonInteraction: true
  });
  clickLink.click();
});
header.appendChild(changeButton);