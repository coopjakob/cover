const drawerObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    // console.debug('mutation', mutation);
    for (const addedNode of mutation.addedNodes) {
      //   console.log('addedNode', addedNode);
      try {
        if (addedNode.querySelector('h2').innerText == 'Varukorg') {
          let header = document.querySelector('.Cart-header.Cart-headerInfo');
          header.style.paddingBottom = 0;

          let clickLink = header.querySelector('.Link');
          if (clickLink.innerText == 'Hemleverans') {
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
            console.log('click()', clickLink);
          });
          header.appendChild(buyButton);
        }
      } catch (error) {}
    }
  }
});

drawerObserver.observe(document.querySelector('#portal'), {
  attributes: false,
  childList: true,
  subtree: true,
});
