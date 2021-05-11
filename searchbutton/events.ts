document
  .querySelector('.Search-input')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      console.debug('<experiment> enterkey');
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'search-enterkey',
        eventLabel: '',
      });
    }
  });

function containClassInNodes(nodes, containClass) {
  let foundNode = false;
  for (const node of nodes) {
    if (node.childNodes) {
      // console.debug('<experiment> child exist');
      foundNode = containClassInNodes(node.childNodes, containClass);
    }
    // console.debug('<experiment> node', node);
    if (!node.tagName) continue;
    if (node.classList.contains(containClass)) {
      console.debug('<experiment> see', containClass);
      foundNode = node;
      break;
    }
  }
  return foundNode;
}

let observer = new MutationObserver((mutations) => {
  // console.debug('<experiment> change detected');
  for (const { addedNodes } of mutations) {
    // console.debug('<experiment> added node', addedNodes);
    if (containClassInNodes(addedNodes, 'ProductSearch-footer')) {
      console.debug('<experiment> footer exist');

      let element = document.querySelector('.ProductSearch-footer button');
      if (element) {
        console.debug('<experiment> button in footer exist');
        element.addEventListener('click', () => {
          console.debug('<experiment> click resultslink');
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'Experiment',
            eventAction: 'search-resultslink',
            eventLabel: '',
          });
        });
      }
    }
  }
});

let wrapper = document.querySelector('.Search');

console.debug('<experiment> observing search results');
observer.observe(wrapper, {
  childList: true,
  subtree: false,
});
