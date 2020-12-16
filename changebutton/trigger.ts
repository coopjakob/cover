const drawerObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    for (const addedNode of mutation.addedNodes) {
      try {
        if (addedNode.querySelector('h2').innerText === 'Varukorg') {
          console.debug('<experiment> activate');
          dataLayer.push({
            event: 'optimize.activate',
          });
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
