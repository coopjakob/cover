document
  .querySelector('.Search-input')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      console.debug('<experiment> escapekey');
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'search-escapekey',
        eventLabel: '',
      });
    }
  });

document.querySelector('.Search-input').addEventListener('blur', () => {
  console.debug('<experiment> leavefield');
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'search-leavefield',
    eventLabel: '',
  });
});

const observer = new MutationObserver((mutations) => {
  console.debug('<experiment> change detected');
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (!node.tagName) continue; // not an element
      if (node.classList.contains('Search-clear')) {
        node.addEventListener('click', () => {
          console.debug('<experiment> closeicon');
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'Experiment',
            eventAction: 'search-closeicon',
            eventLabel: '',
          });
        });
      }
    }
  }
});

let wrapper = document.querySelector('.Search-content');

console.debug('<experiment> observing search');
observer.observe(wrapper, {
  childList: true,
  subtree: false,
});
