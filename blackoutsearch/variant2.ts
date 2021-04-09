let searchInput = search.querySelector('.Search-input');
searchInput.addEventListener('change', run);
searchInput.addEventListener('input', run);

function run() {
  if (!document.querySelector('.experiment.t45')) {
    let modal = document.createElement('div');
    modal.classList.add('experiment', 't45', 'Modal', 'is-visible');
    modal.style.zIndex = '9';

    let modalOverlay = document.createElement('div');
    modalOverlay.classList.add('Modal-overlay');

    modal.appendChild(modalOverlay);
    document.body.appendChild(modal);

    function experimentClose() {
      modal.remove();
      observer.disconnect();
    }

    searchInput.addEventListener('blur', experimentClose);

    window.addEventListener('ga:virtualPageView', experimentClose);

    modal.addEventListener('click', () => {
      experimentClose();
      console.debug('<experiment> blackclick');
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'blackoutsearch-blackclick',
        eventLabel: '',
      });
    });

    const observer = new MutationObserver((mutations) => {
      console.debug('<experiment> change detected');
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) {
          if (!node.tagName) continue; // not an element
          if (node.classList.contains('Search-clear')) {
            console.debug('<experiment> added clear');
            node.addEventListener('click', () => {
              setTimeout(() => {
                experimentClose();
              }, 50);
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

    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        experimentClose();
      }
    });
  }
}
