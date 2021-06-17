let observer = new MutationObserver((mutations) => {
  console.debug('<experiment> modal change detected');
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      console.debug('<experiment> added node', node);
      if (!node.tagName) {
        console.debug('<experiment> not an element');
        continue;
      }
      if (node.matches('.Cart') || node.querySelector('.Cart')) {
        console.debug('<experiment> optimize.activate.cartback');
        dataLayer.push({
          event: 'optimize.activate.cartback',
        });
      }
    }
  }
});

observer.observe(document.querySelector('#portal'), {
  childList: true,
  subtree: true,
});
