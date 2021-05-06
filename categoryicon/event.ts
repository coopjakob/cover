(() => {
  const element = document.querySelector('[data-test=mobileCategoryTrigger]');

  if (element) {
    run();
  } else {
    const wrapper = document.querySelector('#ecommerceHeader');

    const observer = new MutationObserver((mutationsList) => {
      console.debug('<experiment> change detected');
      for (const mutation of mutationsList) {
        console.debug('<experiment> mutation', mutation);

        if (
          mutation.addedNodes.length > 0 &&
          mutation.addedNodes[0].querySelector(
            '[data-test=mobileCategoryTrigger]'
          )
        ) {
          console.debug('<experiment> run change');
          run();

          observer.disconnect();
        }
      }
    });

    console.debug('<experiment> observing search results');
    observer.observe(wrapper, {
      attributes: false,
      childList: true,
    });
  }

  function run() {
    document
      .querySelector('.js-sidebarTrigger')
      .addEventListener('click', (event) => {
        if (event.currentTarget.classList.contains('is-active')) {
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'Experiment',
            eventAction: 'categoryicon-click',
          });
        }
      });
  }
})();
