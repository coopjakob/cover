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
      console.debug('<experiment> see ', containClass);
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
      console.debug('return true');
      let element = document.querySelector('.ProductSearch-footer button');
      console.debug('<experiment> see resultslink');
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
});

let wrapper = document.querySelector('.Search');

console.debug('<experiment> observing search results');
observer.observe(wrapper, {
  childList: true,
  subtree: false,
});

let style = document.createElement('style');
style.innerHTML = `
  .Search.Search--online .Search-icon {
    top: -1px;
    right: -1px;
    left: unset;
    width: 40px;
    height: 44px;
    padding: 0;
    border-right: 4px solid #00aa46;
    background-color: #00aa46;
    border-radius: 0 22px 22px 0;
  }

  .Search.Search--radiusDropdown.is-active .Search-icon {
    border-radius: 0 22px 0 0;
  }

  .Search-clear {
    right: 44px !important;
  }

  .Search-input {
    padding-left: 1rem;
  }

  .Search.Search--green .Search-content .Search-icon svg {
    stroke: white !important;
  }
`;
document.body.appendChild(style);

let element = document.querySelector('.Search.Search--online .Search-icon');

element.addEventListener('click', () => {
  console.debug('<experiment> click searchbutton');
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'searchbutton-click',
    eventLabel: '',
  });
  const enterkey = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  document.querySelector('.Search-input').dispatchEvent(enterkey);
});
